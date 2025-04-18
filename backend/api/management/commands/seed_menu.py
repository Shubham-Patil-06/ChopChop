from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Category, MenuItem, Order, CartItem, Address

class Command(BaseCommand):
    help = "Seed categories, menu items, users, addresses, and orders"

    def handle(self, *args, **kwargs):
        # Create users
        user1, _ = User.objects.get_or_create(username="testuser")
        user1.set_password("1234")
        user1.save()

        user2, _ = User.objects.get_or_create(username="janedoe")
        user2.set_password("abcd")
        user2.save()

        # Create categories
        noodles, _ = Category.objects.get_or_create(name="Noodles")
        sushi, _ = Category.objects.get_or_create(name="Sushi")
        burger, _ = Category.objects.get_or_create(name="Burger")

        # Create menu items
        ramen = MenuItem.objects.get_or_create(
            name="Spicy Ramen",
            image="https://source.unsplash.com/featured/?ramen",
            price=12.99,
            description="Delicious spicy ramen with rich broth.",
            category = noodles
        )[0]

        sushi_item = MenuItem.objects.get_or_create(
            name="Sushi Platter",
            image="https://source.unsplash.com/featured/?sushi",
            price=18.49,
            description="Fresh assorted sushi with wasabi and soy.",
            category=sushi
        )[0]

        burger_item = MenuItem.objects.get_or_create(
            name="Cheeseburger",
            image="https://source.unsplash.com/featured/?burger",
            price=9.99,
            description="Juicy beef patty with melted cheese.",
            category=burger
        )[0]

        # Create addresses
        Address.objects.get_or_create(user=user1, address="123 Ramen St, Tokyo")
        Address.objects.get_or_create(user=user2, address="456 Sushi Ave, Kyoto")

        # Create orders and cart items
        order1 = Order.objects.create(user=user1, total=0)
        CartItem.objects.create(user=user1, order=order1, menu_item=ramen, quantity=2)
        CartItem.objects.create(user=user2, order=order1, menu_item=burger_item, quantity=1)
        order1.total = sum(ci.menu_item.price * ci.quantity for ci in CartItem.objects.filter(order=order1))
        order1.save()

        order2 = Order.objects.create(user=user2, total=0)
        CartItem.objects.create(user=user2, order=order2, menu_item=sushi_item, quantity=2)
        order2.total = sum(ci.menu_item.price * ci.quantity for ci in CartItem.objects.filter(order=order2))
        order2.save()

        self.stdout.write(self.style.SUCCESS("✅ Seeded categories, items, users, addresses, and orders."))
