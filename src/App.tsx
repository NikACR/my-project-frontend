import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import NewReservationPage from './pages/NewReservationPage';
import AkcePage from './pages/AkcePage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LoyaltyProvider } from './contexts/LoyaltyContext';

const App: React.FC = () => (
  <AuthProvider>
    <CartProvider>
      <LoyaltyProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/reservations" element={<MyReservationsPage />} />
            <Route path="/new-reservation" element={<NewReservationPage />} />
            <Route path="/events" element={<AkcePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          <Route element={<PrivateRoute requireStaff />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LoyaltyProvider>
    </CartProvider>
  </AuthProvider>
);

export default App;
