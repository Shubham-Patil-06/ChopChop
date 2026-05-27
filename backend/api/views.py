from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.conf import settings
from .models import MenuItem, CartItem, Order, OrderItem, Address, OTP, Category
from .serializers import (
    EmailOTPSerializer, LoginSerializer, MenuItemSerializer, CartItemSerializer, OrderSerializer,
    AddressSerializer, UserSerializer, RegisterSerializer, EmailOnlySerializer, PaymentOrderSerializer
)
import random
import razorpay
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"]
        )

        if user is None:
            return Response({"error": "Invalid credentials"}, status=401)

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "username": user.username,
                "email": user.email
            }
        })


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data

        user.email = data.get("email", user.email)
        user.first_name = data.get("name", user.first_name)
        user.save()

        mobile = data.get("mobile")
        address, _ = Address.objects.get_or_create(
            user=user,
            defaults={"address": "", "city": "", "zip_code": ""}
        )
        if mobile:
            address.mobile = mobile
            address.save()

        return Response({
            "username": user.username,
            "email": user.email,
            "name": user.first_name,
            "mobile": address.mobile if address.mobile else "Not set"
        }, status=status.HTTP_200_OK)


class MenuListView(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category']


class CartItemView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        menu_item_id = self.request.data.get("menu_item")
        try:
            existing = CartItem.objects.get(user=self.request.user, menu_item_id=menu_item_id)
            existing.quantity += 1
            existing.save()
        except CartItem.DoesNotExist:
            serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        menu_item_id = request.data.get("menu_item")
        try:
            existing = CartItem.objects.get(user=request.user, menu_item_id=menu_item_id)
            existing.quantity += 1
            existing.save()
            return Response(CartItemSerializer(existing).data, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return super().create(request, *args, **kwargs)


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)


class OrderView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        total = request.data.get('total')
        address_text = request.data.get('address', '').strip()
        items_data = request.data.get('items', [])

        if not total:
            return Response({"error": "total is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not items_data:
            return Response({"error": "items are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Upsert address record for this user
        address_obj, _ = Address.objects.get_or_create(
            user=request.user,
            defaults={"address": address_text, "city": "", "zip_code": ""}
        )
        if address_text:
            address_obj.address = address_text
            address_obj.save()

        order = Order.objects.create(
            user=request.user,
            address=address_obj,
            total=total
        )

        for item in items_data:
            OrderItem.objects.create(
                order=order,
                name=item.get('name', ''),
                price=item.get('price', 0),
                quantity=item.get('quantity', 1),
            )

        # Clear server-side cart items after order is placed
        CartItem.objects.filter(user=request.user).delete()

        return Response(
            {"message": "Order placed successfully", "order_id": order.id},
            status=status.HTTP_201_CREATED
        )


class AddressView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")

        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response({"error": "Payment gateway not configured"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            data = {
                "amount": int(amount),
                "currency": "INR",
                "payment_capture": 1,
            }
            order = client.order.create(data=data)
            return Response(order, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Payment initiation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SendOTPView(generics.GenericAPIView):
    serializer_class = EmailOnlySerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            base_username = email.split('@')[0]
            username = base_username
            i = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{i}"
                i += 1
            user = User.objects.create(username=username, email=email)
            user.set_unusable_password()
            user.save()

        otp_code = str(random.randint(100000, 999999))
        OTP.objects.update_or_create(
            user=user,
            defaults={"code": otp_code, "phone": ""}
        )

        send_mail(
            subject="Your ChopChop OTP",
            message=f"Your OTP is: {otp_code}\n\nThis OTP expires in 5 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )

        return Response({"message": "OTP sent successfully."}, status=200)


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = EmailOTPSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        try:
            otp_obj = OTP.objects.get(user=user, code=otp_code)
        except OTP.DoesNotExist:
            return Response({"error": "Invalid OTP."}, status=400)

        if otp_obj.is_expired():
            otp_obj.delete()
            return Response({"error": "OTP expired."}, status=400)

        refresh = RefreshToken.for_user(user)
        otp_obj.delete()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "username": user.username,
                "email": user.email
            }
        }, status=200)
