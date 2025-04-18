import os
import django

# Adjust if your project folder is named differently
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

# Now safely import models
from api.models import MenuItem, Address, Order
from django.contrib.auth.models import User

# Clear old data (optional, be careful in prod)
MenuItem.objects.all().delete()
User.objects.filter(username__in=["testuser", "janedoe"]).delete()
Address.objects.all().delete()
Order.objects.all().delete()

# 🍱 Menu items
items = [
    {
        "name": "Spicy Ramen",
        "image": "https://source.unsplash.com/featured/?ramen",
        "price": 12.99,
        "description": "Delicious spicy ramen with rich broth.",
        "category": "Noodles",
    },
    {
        "name": "Sushi Platter",
        "image": "https://source.unsplash.com/featured/?sushi",
        "price": 18.49,
        "description": "Fresh assorted sushi with wasabi and soy.",
        "category": "Sushi",
    },
    {
        "name": "Cheeseburger",
        "image": "https://source.unsplash.com/featured/?burger",
        "price": 9.99,
        "description": "Juicy beef patty with melted cheese.",
        "category": "Burger",
    }
]

for item in items:
    MenuItem.objects.create(**item)

print(f"✅ Seeded {len(items)} menu items.")

# 👤 Users
user1 = User.objects.create_user(username="testuser", password="1234")
user2 = User.objects.create_user(username="janedoe", password="abcd")

print("👥 Created 2 test users.")

# 📍 Addresses
Address.objects.create(user=user1, address="123 Ramen St, Tokyo")
Address.objects.create(user=user2, address="456 Burger Blvd, NYC")

print("📬 Added addresses.")

# 🛒 Orders
Order.objects.create(user=user1, items="Spicy Ramen x1, Cheeseburger x2", total=32.97)
Order.objects.create(user=user2, items="Sushi Platter x1", total=18.49)

print("🧾 Seeded example orders.")
