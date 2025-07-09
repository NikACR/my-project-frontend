// src/pages/AkcePage.tsx
import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import {
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  Tag as TagIcon,
} from 'lucide-react'

interface PodnikovaAkce {
  id_akce: number
  nazev: string
  popis: string
  cena: number | string
  kapacita: number
  obsazeno: number
  obrazek_url: string | null
}

const AkcePage: React.FC = () => {
  const [akce, setAkce] = useState<PodnikovaAkce[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    api
      .get<PodnikovaAkce[]>('/akce')
      .then(res => setAkce(res.data))
      .catch(() => setError('Nepodařilo se načíst seznam akcí.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () =>
      akce.filter(a =>
        a.nazev.toLowerCase().includes(q.toLowerCase())
      ),
    [akce, q]
  )

  if (loading) return <div className="text-center mt-8">Načítám akce…</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* hlavička s pozadím */}
      <div className="bg-gray-100 py-8 mb-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">Firemní akce</h1>
          <p className="text-gray-600 mt-2">
            Vyberte si z naší pestré nabídky – naše akce jsou flexi podle zájmu a naplněnosti skupin.
          </p>
          <div className="mt-6">
            <input
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Hledat akci…"
              className="w-full md:w-1/2 py-2 px-4 border rounded shadow-sm focus:outline-none focus:ring"
            />
          </div>
        </div>
      </div>

      {/* karty */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <ul className="grid gap-6 md:grid-cols-2">
          {filtered.map(a => {
            const price = Number(a.cena) || 0
            return (
              <li
                key={a.id_akce}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {a.obrazek_url && (
                  <img
                    src={a.obrazek_url}
                    alt={a.nazev}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-2xl font-semibold mb-2">{a.nazev}</h2>
                  <p className="text-gray-700 mb-4">{a.popis}</p>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Dle zájmu lidí a naplněnosti.
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <UsersIcon className="w-5 h-5 mr-2" />
                    Obsazeno {a.obsazeno}/{a.kapacita}
                  </div>

                  <div className="flex items-center text-indigo-600 font-bold text-lg mb-4">
                    <TagIcon className="w-5 h-5 mr-2" />
                    {price.toFixed(2)} Kč
                  </div>

                  <Link
                    to={`/new-reservation?type=action&id=${a.id_akce}`}
                    className="mt-auto inline-block text-center py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Rezervovat
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AkcePage
