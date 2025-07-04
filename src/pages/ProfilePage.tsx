// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchPoints, redeemPoints } from '../utils/api'
import { useNotifications } from '../contexts/NotificationsContext'

const THRESHOLD = 20
const CZK_PER_POINT = 200

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const [points, setPoints] = useState(0)
  const [loadingPts, setLoadingPts] = useState(true)
  const { addNotification } = useNotifications()

  useEffect(() => {
    fetchPoints()
      .then(r => setPoints(r.data.body))
      .finally(() => setLoadingPts(false))
  }, [])

  if (loading || loadingPts) return <p className="text-center mt-8">Načítám…</p>
  if (!user) return <p className="text-center mt-8 text-red-600">Nejste přihlášeni.</p>

  const toGo = Math.max(0, THRESHOLD - points)
  const czkToNext = toGo * CZK_PER_POINT

  const handleRedeem = async () => {
    try {
      const r = await redeemPoints(THRESHOLD)
      setPoints(r.data.body)
      addNotification(`Uplatněno ${THRESHOLD} bodů za ${CZK_PER_POINT} Kč slevu.`)
    } catch {
      addNotification('Nepodařilo se uplatnit body.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-12 space-y-4">
      <h1 className="text-2xl font-bold">Můj profil</h1>
      <p><strong>Jméno:</strong> {user.jmeno} {user.prijmeni}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Telefon:</strong> {user.telefon || '–'}</p>

      <div className="mt-6 bg-gray-50 p-4 rounded shadow-sm">
        <p>Nasbíráno bodů: <strong>{points}</strong></p>
        {points < THRESHOLD ? (
          <p>Zbývá utratit: <strong>{czkToNext.toLocaleString()} Kč</strong></p>
        ) : (
          <button
            onClick={handleRedeem}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Uplatnit {THRESHOLD} bodů za {CZK_PER_POINT} Kč
          </button>
        )}
      </div>
    </div>
  )
}

export default ProfilePage
