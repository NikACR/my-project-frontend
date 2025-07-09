// src/pages/MyReservationsPage.tsx
import React, { useEffect, useState, useMemo } from 'react'
import api from '../utils/api'
import {
  Calendar,
  Users,
  Table,
  MapPin,
  Gift,
  Percent,
  CheckCircle,
  Bell
} from 'lucide-react'

interface Notification {
  id_notifikace: number
  datum_cas: string
  text: string
}

interface Reservace {
  id_rezervace: number
  datum_cas: string
  pocet_osob: number
  stul: { cislo: number } | string | null
  salonek: { nazev: string } | string | null
  akce: { nazev: string } | string | null
  workshop: { nazev: string } | string | null
  sleva: string
  stav_rezervace: string
  notifikace: Notification[] | string
}

const PAGE_SIZE = 4

const MyReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filtry a stránkování
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    api
      .get<Reservace[]>('/rezervace')
      .then(res => setReservations(res.data))
      .catch(() => setError('Nepodařilo se načíst rezervace.'))
      .finally(() => setLoading(false))
  }, [])

  // filtrovaná + stránkovaná data
  const filtered = useMemo(() => {
    let arr = reservations
    if (search) {
      arr = arr.filter(r =>
        String(r.id_rezervace).includes(search.trim())
      )
    }
    if (statusFilter) {
      arr = arr.filter(r => r.stav_rezervace === statusFilter)
    }
    return arr
  }, [reservations, search, statusFilter])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4 p-6 bg-white rounded shadow">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>
  }

  // formátování data a času
  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    const date = d.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const time = d.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    })
    return `${date} ${time}`
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="bg-indigo-50 py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Moje rezervace</h1>
        <p className="text-gray-600">
          Tady najdeš všechny detaily svých rezervací – snadno přehledné a na dosah.
        </p>
      </div>

      <div className="container mx-auto p-6">
        {/* Filtry */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Hledej číslo rez."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="border rounded p-2 w-full md:w-1/3"
          />
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="border rounded p-2 w-full md:w-1/4"
          >
            <option value="">Všechny stavy</option>
            <option value="potvrzená">Potvrzená</option>
            <option value="čekající">Čekající</option>
            <option value="zrušená">Zrušená</option>
          </select>
        </div>

        {/* Grid karet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paged.map(r => (
            <div
              key={r.id_rezervace}
              className="border-l-4 border-indigo-500 bg-white rounded-lg shadow p-6 hover:-translate-y-1 hover:shadow-lg transition-transform"
            >
              <h2 className="text-xl font-semibold mb-2">
                Rezervace č. {r.id_rezervace}
              </h2>

              <p className="flex items-center text-gray-700 mb-1">
                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                Čas rezervace:&nbsp;
                <strong>{formatDateTime(r.datum_cas)}</strong>
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <Users className="w-5 h-5 mr-2 text-indigo-500" />
                Počet osob:&nbsp;
                <strong>{r.pocet_osob}</strong>
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <Table className="w-5 h-5 mr-2 text-indigo-500" />
                Stůl:&nbsp;
                {typeof r.stul === 'string' || r.stul === null ? (
                  <span className="font-medium">{r.stul ?? '–'}</span>
                ) : (
                  <span className="font-medium">č. {r.stul.cislo}</span>
                )}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <MapPin className="w-5 h-5 mr-2 text-indigo-500" />
                Salónek:&nbsp;
                {typeof r.salonek === 'string' || r.salonek === null ? (
                  <span className="font-medium">{r.salonek ?? '–'}</span>
                ) : (
                  <span className="font-medium">{r.salonek.nazev}</span>
                )}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <Gift className="w-5 h-5 mr-2 text-indigo-500" />
                Akce:&nbsp;
                {typeof r.akce === 'string' || r.akce === null ? (
                  <span className="font-medium">{r.akce ?? '–'}</span>
                ) : (
                  <span className="font-medium">{r.akce.nazev}</span>
                )}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <Gift className="w-5 h-5 mr-2 text-indigo-500" />
                Workshop:&nbsp;
                {typeof r.workshop === 'string' || r.workshop === null ? (
                  <span className="font-medium">{r.workshop ?? '–'}</span>
                ) : (
                  <span className="font-medium">{r.workshop.nazev}</span>
                )}
              </p>

              <p className="flex items-center text-gray-700 mb-1">
                <Percent className="w-5 h-5 mr-2 text-indigo-500" />
                Sleva:&nbsp;
                <strong>{parseFloat(r.sleva).toFixed(0)} Kč</strong>
              </p>

              <p className="flex items-center text-gray-700 mb-2">
                <CheckCircle className="w-5 h-5 mr-2 text-indigo-500" />
                Stav rezervace:&nbsp;
                <strong className="capitalize">{r.stav_rezervace}</strong>
              </p>

              <div className="border-t pt-2">
                <h3 className="flex items-center text-gray-800 font-semibold mb-1">
                  <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                  Notifikace
                </h3>
                {Array.isArray(r.notifikace) ? (
                  r.notifikace.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-600">
                      {r.notifikace.map(n => (
                        <li key={n.id_notifikace}>
                          {formatDateTime(n.datum_cas)} – {n.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Žádné notifikace</p>
                  )
                ) : (
                  <p className="text-gray-500">{r.notifikace}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* stránkování */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyReservationsPage
