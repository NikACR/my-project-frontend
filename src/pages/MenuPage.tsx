// src/pages/MenuPage.tsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import Spinner from '../components/Spinner'
import { useCart } from '../contexts/CartContext'
import { imageMap, FALLBACK_IMAGE } from '../utils/imageMap'

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
  kategorie: string
  alergeny: Allergen[]
}

const MenuPage: React.FC = () => {
  const [items, setItems]           = useState<MenuItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string|null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [activeCat, setActiveCat]   = useState<string>('')

  const { add } = useCart()

  useEffect(() => {
    api.get<MenuItem[]>('/menu')
      .then(r => {
        setItems(r.data)
        const cats = Array.from(new Set(r.data.map(i => i.kategorie)))
        setCategories(cats)
        if (cats.length > 0) setActiveCat(cats[0])
      })
      .catch(() => setError('Nepodařilo se načíst menu.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <p className="text-red-600 text-center mt-8">{error}</p>

  const itemsForCat = items.filter(i => i.kategorie === activeCat)

  return (
    <div className="p-4 space-y-6">
      {/* Karty kategorií */}
      <div className="flex space-x-4 border-b pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`px-4 py-2 rounded ${
              activeCat === cat
                ? 'border-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {itemsForCat.length === 0 ? (
        <p className="text-center text-gray-500">Žádné položky v této kategorii.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsForCat.map(i => {
            // nejprve API url, pak naše mapa, pak placeholder
            const src = i.obrazek_url || imageMap[i.id_menu_polozka] || FALLBACK_IMAGE
            const price = typeof i.cena === 'number'
              ? i.cena
              : parseFloat(i.cena as string) || 0

            return (
              <div key={i.id_menu_polozka} className="bg-white rounded shadow flex flex-col overflow-hidden">
                <Link to={`/menu/${i.id_menu_polozka}`} className="flex-1">
                  <div className="w-full h-56 bg-gray-100">
                    <img
                      src={src}
                      alt={i.nazev}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 h-60 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{i.nazev}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{i.popis}</p>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">{price.toFixed(2)} Kč</span>
                    </div>
                    {i.alergeny.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {i.alergeny.map(a => (
                          <span
                            key={a.id_alergenu}
                            className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full"
                          >
                            {a.nazev}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => add({ id: i.id_menu_polozka, title: i.nazev, price })}
                  className="mt-auto bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
                >
                  Přidat do košíku
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MenuPage
