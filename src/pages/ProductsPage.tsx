import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  cena: number
  obrazek_url: string | null
  alergeny: Allergen[]
}

const ProductsPage: React.FC = () => {
  const [tab, setTab] = useState<'week' | 'weekend'>('week')
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const url =
      tab === 'week'
        ? '/menu/weekly'
        : '/menu/weekend'

    api.get<MenuItem[]>(url)
      .then(r => setItems(r.data))
      .catch(() => setError('Nepodařilo se načíst menu.'))
      .finally(() => setLoading(false))
  }, [tab])

  if (loading) return <Spinner />
  if (error) return <p className="text-red-600 text-center">{error}</p>

  return (
    <div className="py-6">
      {/* Přepínač */}
      <div className="flex space-x-2 mb-6 justify-center">
        <button
          onClick={() => setTab('week')}
          className={`px-4 py-2 rounded ${tab === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Týdenní menu
        </button>
        <button
          onClick={() => setTab('weekend')}
          className={`px-4 py-2 rounded ${tab === 'weekend' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Víkendové menu
        </button>
      </div>

      {/* Mřížka položek */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Link
            key={item.id_menu_polozka}
            to={`/menu/${item.id_menu_polozka}`}
            className="block border rounded-lg overflow-hidden hover:shadow-lg"
          >
            <div className="h-40 bg-gray-100">
              <img
                src={item.obrazek_url ?? '/images/placeholder.png'}
                alt={item.nazev}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-indigo-700">{item.nazev}</h3>
              <p className="text-gray-600 text-sm">{item.popis}</p>
              <p className="mt-2 font-medium">{item.cena.toFixed(2)} Kč</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.alergeny.map(a => (
                  <span
                    key={a.id_alergenu}
                    className="text-xs bg-red-100 text-red-800 rounded-full px-2 py-1"
                  >
                    {a.nazev}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
