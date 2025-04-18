from django.contrib import admin
from .models import MenuItem, Category, Order, CartItem, Address

admin.site.register(MenuItem)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(CartItem)
admin.site.register(Address)
