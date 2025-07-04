import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { useOrderEvents } from '../hooks/useOrderEvents'

interface Order {
  id_objednavky: number
  stav: string
  cas_pripravy: string
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    api.get<Order[]>('/objednavka')
      .then(r => {
        setOrders(r.data)
        setError(null)
      })
      .catch(() => setError('Nepodařilo se načíst objednávky.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center mt-8">Načítám objednávky…</p>
  if (error)   return <p className="text-red-500 text-center mt-8">{error}</p>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Moje objednávky</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">Ještě nemáte žádné objednávky.</p>
      ) : (
        orders.map(o => <OrderCard key={o.id_objednavky} order={o} />)
      )}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  useOrderEvents(order.id_objednavky)

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="font-semibold">Objednávka č. {order.id_objednavky}</h3>
      <p>Status: {order.stav}</p>
      <p>Hotovo do: {new Date(order.cas_pripravy).toLocaleTimeString()}</p>
    </div>
  )
}

export default OrdersPage
