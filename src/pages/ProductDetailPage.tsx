import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Spinner from '../components/Spinner'

interface Allergen {
  id_alergenu: number
  nazev: string
}

interface MenuItem {
  id_menu_polozka: number
  nazev: string
  popis: string
  cena: number | string
  obrazek_url: string | null
  alergeny: Allergen[]
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<MenuItem>(`/menu/${id}`)
      .then(r => setItem(r.data))
      .catch(() => setError('Nepodařilo se načíst položku.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (error || !item) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">{error || 'Položka nenalezena'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          ← Zpět
        </button>
      </div>
    )
  }

  const price =
    typeof item.cena === 'number'
      ? item.cena
      : parseFloat(item.cena as string) || 0

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 hover:underline"
      >
        ← Zpět na menu
      </button>

      {item.obrazek_url ? (
        <img
          src={item.obrazek_url}
          alt={item.nazev}
          className="w-full h-64 object-cover rounded"
        />
      ) : null}

      <h1 className="text-3xl font-bold">{item.nazev}</h1>
      <p className="text-gray-700">{item.popis}</p>
      <p className="text-2xl font-semibold">{price.toFixed(2)} Kč</p>

      {item.alergeny.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.alergeny.map(a => (
            <span
              key={a.id_alergenu}
              className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full"
            >
              {a.nazev}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage
