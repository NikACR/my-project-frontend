// src/pages/NewReservationPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import {
  Calendar as CalendarIcon,
  Users as UsersIcon,
  CheckCircle as CheckIcon,
} from 'lucide-react'

type ResType = 'stul' | 'salonek' | 'akce' | 'workshop'

interface Option {
  id: number
  title: string
  capacity: number
  occupied: number
  description?: string
}

const NewReservationPage: React.FC = () => {
  const navigate = useNavigate()

  // 1) Základní údaje
  const [dateTime, setDateTime] = useState('')
  const [people, setPeople]     = useState(1)

  // 2) Typ rezervace a dostupné možnosti
  const [type, setType]         = useState<ResType>('stul')
  const [options, setOptions]   = useState<Option[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [error, setError]       = useState('')

  // 3) Načtení možností pokaždé, když se změní typ
  useEffect(() => {
    let url = '/stul'
    if (type === 'salonek')   url = '/salonek'
    if (type === 'akce')      url = '/akce'
    if (type === 'workshop')  url = '/workshops'

    api.get<any[]>(url)
      .then(res => {
        const opts: Option[] = res.data.map(item => ({
          id:       item.id_stul   ?? item.id_salonek ?? item.id_akce ?? item.id_workshop,
          title:    item.cislo
                      ? `Stůl č. ${item.cislo}`
                      : item.nazev,
          capacity: item.kapacita,
          occupied: item.rezervace?.length ?? item.occupied ?? 0,
          description:
            item.popis ||
            (type === 'akce'      ? item.popis :
             type === 'workshop'  ? item.popis :
             ''),
        }))
        setOptions(opts)
        setSelected(null)
      })
      .catch(() => {
        setOptions([])
      })
  }, [type])

  // 4) Odeslání
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!dateTime || !selected) {
      setError('Vyplňte datum, čas a vyberte možnost.')
      return
    }
    try {
      await api.post('/rezervace', {
        datum_cas: dateTime,
        pocet_osob: people,
        id_stul:      type === 'stul'     ? selected : null,
        id_salonek:   type === 'salonek'  ? selected : null,
        id_akce:      type === 'akce'     ? selected : null,
        id_workshop:  type === 'workshop' ? selected : null,
      })
      navigate('/reservations')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Nepodařilo se vytvořit rezervaci.')
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* —— Hlavička —— */}
      <div className="bg-indigo-50 p-6 rounded mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Nová rezervace</h1>
        <p className="text-gray-600">
          Vyberte datum, počet osob a místo – a my se o zbytek postaráme.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datum + čas */}
        <div>
          <label className="block mb-1 font-medium">Datum a čas</label>
          <div className="flex items-center border rounded px-3 py-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500 mr-2" />
            <input
              type="datetime-local"
              className="w-full focus:outline-none"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
            />
          </div>
        </div>

        {/* Počet osob */}
        <div>
          <label className="block mb-1 font-medium">Počet osob</label>
          <div className="flex items-center border rounded px-3 py-2">
            <UsersIcon className="w-5 h-5 text-indigo-500 mr-2" />
            <input
              type="number"
              min={1}
              className="w-20 focus:outline-none"
              value={people}
              onChange={e => setPeople(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Výběr typu */}
        <div>
          <label className="block mb-2 font-medium">Typ rezervace</label>
          <div className="inline-flex rounded border overflow-hidden">
            {[
              { key: 'stul'     as ResType, label: 'Stůl' },
              { key: 'salonek'  as ResType, label: 'Salónek' },
              { key: 'akce'     as ResType, label: 'Firemní akce' },
              { key: 'workshop' as ResType, label: 'Workshop' },
            ].map(opt => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setType(opt.key)}
                className={
                  `px-4 py-2 font-medium text-sm ${
                    type === opt.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Galerie možností */}
        <div>
          <label className="block mb-2 font-medium">
            Vyberte{' '}
            {{
              stul: 'stůl',
              salonek: 'salónek',
              akce: 'firemní akci',
              workshop: 'workshop',
            }[type]}
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            {options.map(o => {
              const full = o.occupied >= o.capacity
              const isSelected = selected === o.id

              return (
                <div
                  key={o.id}
                  onClick={() => !full && setSelected(o.id)}
                  className={`
                    relative p-4 rounded border 
                    ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}
                    ${full ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow'}
                  `}
                >
                  <h3 className="font-semibold mb-1">{o.title}</h3>
                  {o.description && (
                    <p className="text-gray-600 text-sm mb-2">{o.description}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    Obsazeno{' '}
                    <span className="font-medium">
                      {o.occupied}/{o.capacity}
                    </span>
                  </p>

                  {full && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                      <span className="text-red-600 font-bold">PLNÉ</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Chyba */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Tlačítko */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded text-lg font-medium hover:bg-indigo-700"
        >
          Vytvořit rezervaci
        </button>
      </form>
    </div>
  )
}

export default NewReservationPage
