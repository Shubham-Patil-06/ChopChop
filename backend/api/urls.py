from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView
)
from .views import CreatePaymentOrderView, SendOTPView, SignupView, UserProfileView, MenuListView, CartItemView, OrderView, AddressView, VerifyOTPView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("logout/", TokenBlacklistView.as_view(), name="token_blacklist"),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('menu/', MenuListView.as_view(),name="menu-list"),
    path('cart/', CartItemView.as_view()),
    path('orders/', OrderView.as_view()),
    path('address/', AddressView.as_view()),
    path("payment/", CreatePaymentOrderView.as_view()),
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

]
