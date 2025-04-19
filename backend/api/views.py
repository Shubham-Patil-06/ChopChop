from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.conf import settings
from .models import MenuItem, CartItem, Order, OrderItem, Address, OTP, Category
from .serializers import (
    EmailOTPSerializer, LoginSerializer, MenuItemSerializer, CartItemSerializer, OrderSerializer,
    AddressSerializer, UserSerializer, RegisterSerializer, EmailOnlySerializer,    PaymentOrderSerializer
)
import random
import razorpay
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated

User = get_user_model()
# def generate_otp():
#     return str(random.randint(100000, 999999))

# # ✅ SMS sending via Fast2SMS
# def send_sms_otp(phone, otp_code):
#     url = "https://www.fast2sms.com/dev/bulkV2"
#     headers = {
#         'authorization': settings.FAST2SMS_API_KEY,
#         'Content-Type': 'application/json'
#     }
#     payload = {
#         "route": "otp",
#         "variables_values": otp_code,
#         "numbers": phone
#     }
#     try:
#         res = requests.post(url, json=payload, headers=headers)
#         print("SMS response:", res.status_code, res.text)
#         return res.status_code == 200
#     except Exception as e:
#         print("SMS error:", e)
#         return False


# ✅ Signup with email/password
class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

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

        # ✅ Update user fields
        user.email = data.get("email", user.email)
        user.first_name = data.get("name", user.first_name)
        user.save()

        # ✅ Update or create address with mobile number
        mobile = data.get("mobile")
        address, created = Address.objects.get_or_create(user=user)

        if mobile:
            address.mobile = mobile
            address.save()

        return Response({
            "username": user.username,
            "email": user.email,
            "name": user.first_name,
            "mobile": address.mobile if mobile else "Not set"
        }, status=status.HTTP_200_OK)



# ✅ Menu Items List
class MenuListView(generics.ListAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['category']


# ✅ Cart
class CartItemView(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Orders
class OrderView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Address
class AddressView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Razorpay Integration
class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")

        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

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
            print("❌ Razorpay Error:", e)
            return Response({"error": "Payment initiation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#from .serializers import EmailOnlySerializer, EmailOTPSerializer

# ✅ Send OTP via email safely
class SendOTPView(generics.GenericAPIView):
    serializer_class = EmailOnlySerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # ✅ Try to fetch by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # If not found, create a new user with email and random username
            base_username = email.split('@')[0]
            i = 1
            while User.objects.filter(username=base_username).exists():
                base_username = f"{base_username}{i}"
                i += 1
            user = User.objects.create(
                username=base_username,
                email=email
            )
            user.set_unusable_password()
            user.save()

        # ✅ Generate OTP
        otp_code = str(random.randint(100000, 999999))
        OTP.objects.update_or_create(
            user=user,
            defaults={"code": otp_code, "phone": ""}
        )

        # ✅ Send OTP
        send_mail(
            subject="Your ChopChop OTP",
            message=f"Your OTP is: {otp_code}",
            from_email="noreply@chopchop.com",
            recipient_list=[email],
        )

        return Response({"message": "OTP sent successfully."}, status=200)
    
# ✅ Verify OTP
class VerifyOTPView(generics.GenericAPIView):
    serializer_class = EmailOTPSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp_code = serializer.validated_data["otp"]

        try:
            user = User.objects.get(username=email)
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
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "username": user.username,
                "email": user.email
            }
        }, status=200)
