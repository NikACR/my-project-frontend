import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { ShoppingCart } from 'lucide-react'

const NavBar: React.FC = () => {
  const { user, logout } = useAuth()
  const { itemsCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow mb-6">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          MojeRestaurace
        </Link>

        <div className="flex items-center space-x-4">
          {!user && (
            <>
              <Link to="/login" className="hover:underline">
                Přihlášení
              </Link>
              <Link to="/register" className="hover:underline">
                Registrace
              </Link>
            </>
          )}

          {user && (
            <>
              {/* Odkaz na menu */}
              <Link
                to="/menu"
                className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
              >
                Menu
              </Link>

              <Link to="/reservations" className="hover:underline">
                Rezervace
              </Link>

              <Link to="/new-reservation" className="hover:underline">
                Nová rezervace
              </Link>

              <Link to="/events" className="hover:underline">
                Firemní akce
              </Link>

              <Link to="/users" className="hover:underline">
                Uživatelé
              </Link>

              {user.roles.includes('admin') && (
                <Link
                  to="/admin"
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Admin
                </Link>
              )}

              <Link to="/profile" className="hover:underline">
                Profil
              </Link>

              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-gray-900" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {itemsCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="ml-4 text-red-600 hover:underline"
              >
                Odhlásit se
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
