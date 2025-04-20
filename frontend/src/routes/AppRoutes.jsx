import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import Orders from '../pages/Orders';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import { AnimatePresence } from 'framer-motion';
import PaymentPage from '../pages/Payment';
import OrderCheckout from '../pages/OrderCheckout';
import EditProfileModal from '../pages/EditProfile';

export default function AppRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes key={location.pathname} location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><OrderCheckout /></ProtectedRoute>} />
                <Route path="/editprofile" element={<ProtectedRoute><EditProfileModal /></ProtectedRoute>} />
            </Routes>
        </AnimatePresence>


    )
}