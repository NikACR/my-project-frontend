// src/pages/WorkshopsPage.tsx
import React, { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'

interface Workshop {
  id_workshop: number
  nazev: string
  popis: string
  cena: number | string
  obrazek_url: string | null
  kapacita: number
}

const WorkshopsPage: React.FC = () => {
  const [list, setList] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filtr + stránkování
  const [filterTerm, setFilterTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    api
      .get<Workshop[]>('/workshops')
      .then(res => setList(res.data))
      .catch(() => setError('Nepodařilo se načíst workshopy.'))
      .finally(() => setLoading(false))
  }, [])

  // aplikuj filtr
  const filtered = useMemo(
    () =>
      list.filter(w =>
        w.nazev.toLowerCase().includes(filterTerm.toLowerCase())
      ),
    [list, filterTerm]
  )

  // výpočet stránek
  const pageCount = Math.ceil(filtered.length / itemsPerPage)
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filtered, currentPage]
  )

  if (loading) return <div className="text-center mt-16">Načítám workshopy…</div>
  if (error)   return <div className="text-center mt-16 text-red-600">{error}</div>

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Nadpis a úvod */}
        <h1 className="text-4xl font-bold mb-2 text-gray-800 text-center">
          Workshopy
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Vyberte si z naší pestré nabídky workshopů – naše kurzy jsou flexi podle zájmu a naplněnosti skupin.
        </p>

        {/* Filtr */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Hledat workshop…"
            value={filterTerm}
            onChange={e => {
              setFilterTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring"
          />
        </div>

        {/* Grid karet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginated.map(w => {
            const price = Number(w.cena) || 0
            return (
              <div
                key={w.id_workshop}
                className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {/* Obrázek */}
                {w.obrazek_url && (
                  <img
                    src={w.obrazek_url}
                    alt={w.nazev}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}

                {/* Obsah karty */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {w.nazev}
                  </h2>

                  {/* Detailní popisek */}
                  <p className="mt-3 text-gray-700 flex-1">
                    {w.popis}
                  </p>

                  {/* Metadata */}
                  <div className="mt-4 text-gray-600 text-sm space-y-1">
                    <div className="italic">
                      📅 Dle zájmu lidí a naplněnosti.
                    </div>
                    <div>
                      👥 Kapacita: {w.kapacita}
                    </div>
                    <div>
                      💸 Cena: {price.toFixed(2)} Kč
                    </div>
                  </div>

                  {/* Rezervační tlačítko */}
                  <Link
                    to={`/new-reservation?workshop=${w.id_workshop}`}
                    className="mt-6 inline-block text-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Rezervovat místo
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Pokud nic neodpovídá filtru */}
          {(!paginated.length) && (
            <p className="col-span-full text-center text-gray-500">
              Nic nenalezeno pro „{filterTerm}“.
            </p>
          )}
        </div>

        {/* Stránkování */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  px-3 py-1 rounded 
                  ${page === currentPage 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white border text-gray-700 hover:bg-gray-50'}
                `}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkshopsPage
