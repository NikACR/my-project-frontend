// src/App.tsx

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'

import MenuPage from './pages/MenuPage'
import ProductDetailPage from './pages/ProductDetailPage'
import MyReservationsPage from './pages/MyReservationsPage'
import NewReservationPage from './pages/NewReservationPage'
import AkcePage from './pages/AkcePage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'     // ← import OrdersPage

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

const App: React.FC = () => (
  <>
    <NavBar />

    <div className="container mx-auto px-4">
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />

        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:id" element={<ProductDetailPage />} />

        <Route path="/reservations" element={<MyReservationsPage />} />
        <Route path="/new-reservation" element={<NewReservationPage />} />

        <Route path="/events" element={<AkcePage />} />

        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />   {/* ← OrdersPage route */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  </>
)

export default App
