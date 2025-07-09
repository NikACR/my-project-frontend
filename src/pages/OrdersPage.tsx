// src/pages/OrdersPage.tsx
import React, { useEffect, useState, useMemo } from 'react'
import api from '../utils/api'
import {
  Clock as ClockIcon,
  DollarSign as PriceIcon,
  Gift as GiftIcon,
  CheckCircle as StatusIcon,
} from 'lucide-react'

interface Order {
  id_objednavky: number
  celkova_castka: string
  body_ziskane: number
  cas_pripravy: string | null
  stav: string
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // pro vyhledávání/filtrování
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Všechny stavy')

  useEffect(() => {
    api
      .get<Order[]>('/objednavky')
      .then(res => setOrders(res.data))
      .catch(() => setError('Nepodařilo se načíst objednávky.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return orders
      .filter(o =>
        `${o.id_objednavky}`.includes(search.trim())
      )
      .filter(o =>
        filter === 'Všechny stavy' ? true : o.stav === filter
      )
  }, [orders, search, filter])

  if (loading) return <div className="text-center mt-8">Načítám objednávky…</div>
  if (error)   return <div className="text-center mt-8 text-red-600">{error}</div>

  // vyber unikátních stavů pro dropdown
  const statuses = Array.from(new Set(orders.map(o => o.stav)))
  statuses.sort()

  return (
    <>
      {/* —— HERO SEKCE NA CELOU ŠÍŘKU —— */}
      <div className="w-full bg-indigo-50 py-12 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Moje objednávky</h1>
        <p className="text-gray-600">
          Zde najdeš přehled svých objednávek – vyhledávej, filtruj a listuj.
        </p>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* vyhledávání + filtr */}
        <div className="mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Hledej číslo objednávky"
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-4 py-2 focus:outline-none focus:ring"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>Všechny stavy</option>
            {statuses.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* grid karet */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map(o => {
            // čas ve formátu HH:mm nebo pomlčka
            const ready = o.cas_pripravy
              ? new Date(o.cas_pripravy).toLocaleTimeString('cs-CZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '–'

            return (
              <div
                key={o.id_objednavky}
                className="bg-white rounded shadow p-5 border-l-4 border-indigo-600"
              >
                <p className="text-xl font-semibold mb-4">Č. {o.id_objednavky}</p>

                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    Hotovo do: <span className="ml-1 font-medium">{ready}</span>
                  </li>
                  <li className="flex items-center">
                    <PriceIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    Celkem: <span className="ml-1 font-medium">{parseFloat(o.celkova_castka).toFixed(0)} Kč</span>
                  </li>
                  <li className="flex items-center">
                    <GiftIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    Body získané: <span className="ml-1 font-medium">{o.body_ziskane}</span>
                  </li>
                  <li className="flex items-center">
                    <StatusIcon className="w-5 h-5 mr-2 text-indigo-500" />
                    Stav: <span className="ml-1 font-medium">{o.stav}</span>
                  </li>
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default OrdersPage
