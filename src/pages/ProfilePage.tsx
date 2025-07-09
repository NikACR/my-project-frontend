// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'

interface PointsResponse {
  id_ucet: number
  id_zakaznika: number
  body: number
  datum_zalozeni: string
}

// Překlad rolí
const roleNames: Record<string, string> = {
  user:  'Uživatel',
  staff: 'Pracovník',
  admin: 'Administrátor'
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [points, setPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true)
        const res = await api.get<PointsResponse>('/users/me/points')
        setPoints(res.data.body)
      } catch (e) {
        console.error(e)
        setError('Nepodařilo se načíst stav bodů.')
      } finally {
        setLoading(false)
      }
    }
    fetchPoints()
  }, [user.id])

  const remaining = points !== null ? Math.max(400 - points, 0) : null
  const phoneText = user.phone ?? 'Uživatel telefonní číslo neposkytnul.'
  const rolesText = (user.roles ?? []).length
    ? user.roles.map(r => roleNames[r] || r).join(', ')
    : roleNames.user

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero pás */}
      <div className="bg-indigo-100 py-8 mb-6">
        <h1 className="text-center text-3xl font-bold text-indigo-800">Můj profil</h1>
        <p className="text-center text-gray-700 mt-2">
          Přehled vašich osobních údajů, rolí a věrnostních bodů
        </p>
      </div>

      {/* Karta s detailem */}
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 space-y-3">
            <p><strong>Jméno a příjmení:</strong> {user.jmeno} {user.prijmeni}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Telefon:</strong> {phoneText}</p>
            <p><strong>Role:</strong> {rolesText}</p>

            <hr className="my-4" />

            {loading
              ? <p>Načítám body…</p>
              : error
                ? <p className="text-red-600">{error}</p>
                : (
                  <>
                    <p><strong>Body:</strong> {points}</p>
                    {points! >= 400
                      ? <p className="text-green-600">Máte dostatek bodů na slevu!</p>
                      : <p>Zbývá do slevy 400 bodů: {remaining} bodů.</p>
                    }
                  </>
                )
            }
          </div>
          <div className="bg-gray-50 px-6 py-4">
            <p className="text-gray-600 text-sm italic">
              Tuto stránku lze rozšířit o další nastavení profilu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
