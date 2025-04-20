# 🍽️ ChopChop – Food Delivery App

Welcome to **ChopChop** – a full-stack food delivery web app built to satisfy your cravings, inspired by Zomato. Enjoy a smooth, animated, and mobile-responsive experience with features like dual login (password + email OTP), Razorpay integration, user profiles, and a stunning foodie-style UI.

---

## 🚀 Live Demo

- 🔗 **Frontend**: [chopchopfooddelivery.netlify.app](https://chopchopfooddelivery.netlify.app)
- 🔗 **Backend API**: [chopchop-backend.onrender.com](https://chopchop-backend.onrender.com)

---

## 🧩 Tech Stack

### 🌐 Frontend
- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (for UI animation)
- [Axios](https://axios-http.com/)

### ⚙️ Backend
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Razorpay](https://razorpay.com/)

---

## ✨ Features

### 🔐 Authentication
- Email + Password login
- OTP (One Time Password) login via email
- Resend OTP timer + Masked email
- JWT-based authentication

### 🏠 Home Page
- Zomato-style city homepage design
- Distinct views for logged-in and non-logged-in users
- Animated cards, category highlights, foodie-themed fonts

### 🍔 Menu & Cart
- Browse menu items with images and category filters
- Add/remove items with quantity control
- Animated Cart + Item Count + Empty state with Lottie animation

### 💳 Checkout & Payment
- Combined order summary + checkout view
- Delivery address saved locally
- Razorpay integration for payment
- Order confirmation on success

### 👤 User Profile
- Editable profile with avatar, name, email, mobile
- Auto-save delivery address
- Smooth modals and animations
- Inspired by [Zomato profile design](https://www.zomato.com/users/926522-249860678/reviews)

### 📦 Future Features
- Order history
- Ratings & reviews
- Restaurant partner dashboard
- Food delivery tracking

---

## 🧪 Testing & Linting

> End-to-end testing setup in progress using `pytest` & `Cypress`.

### Backend
```bash
# Run backend tests
python manage.py test
