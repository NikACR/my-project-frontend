// src/pages/CheckoutPage.tsx
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import api from '../utils/api'

const CheckoutPage: React.FC = () => {
  const { items, clear } = useCart()
  const navigate = useNavigate()

  // 1) Klientské přepočty – cena i body * počet (item.quantity)
  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = item.quantity ?? 1
        return sum + item.price * qty
      }, 0),
    [items]
  )
  const totalPoints = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = item.quantity ?? 1
        return sum + item.points * qty
      }, 0),
    [items]
  )

  // 1b) Klientský odhad doby přípravy = max prepTime (jedna položka)
  const estimatedPrepTime = useMemo(() => {
    if (items.length === 0) return 0
    return Math.max(...items.map(item => item.prepTime ?? 0))
  }, [items])

  // 2) Stav pro výsledek platby
  const [method, setMethod] = useState<'cash' | 'card'>('cash')
  const [applyDiscount, setApplyDiscount] = useState(false)
  const [error, setError] = useState<string>('')
  const [paid, setPaid] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null)
  const [currentPoints, setCurrentPoints] = useState<number | null>(null)
  const [prepTime, setPrepTime] = useState<number | null>(null)
  const [discountAmount, setDiscountAmount] = useState<number>(0)

  // 3) Odeslání objednávky + platby
  const handlePay = async () => {
    setError('')
    try {
      // vytvoření objednávky
      const objedRes = await api.post('/objednavky', {
        items: items.map(item => ({
          id_menu_polozka: item.id,
          mnozstvi: item.quantity ?? 1,
          cena: item.price.toFixed(2),
        })),
        apply_discount: applyDiscount,
      })
      const {
        id_objednavky,
        celkova_castka,
        body_ziskane,
        cas_pripravy,
        discount_amount: da,
      } = objedRes.data

      // platba
      const platbaRes = await api.post('/platba', {
        id_objednavky,
        castka: parseFloat(celkova_castka).toFixed(2),
        typ_platby: method === 'cash' ? 'hotove' : 'kartou',
        datum: new Date().toISOString(),
      })
      const { current_points } = platbaRes.data

      // uložení výsledků
      setPaidAmount(parseFloat(celkova_castka))
      setEarnedPoints(body_ziskane)
      setCurrentPoints(current_points)
      setPrepTime(cas_pripravy)
      setDiscountAmount(da)

      clear()
      setPaid(true)
    } catch (e: any) {
      console.error(e)
      setError('Došlo k chybě při platbě, zkuste to prosím znovu.')
    }
  }

  // 4) Zobrazení výsledků po zaplacení
  if (paid) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Děkujeme za objednávku!</h2>
        <p className="mb-2">
          Zaplatili jste: <strong>{paidAmount.toFixed(2)} Kč</strong>
        </p>
        {discountAmount > 0 && (
          <p className="mb-2">
            Sleva uplatněná: <strong>{discountAmount} Kč</strong>
          </p>
        )}
        {prepTime !== null && (
          <p className="mb-2">
            Objednávka bude hotová za: <strong>{prepTime} minut</strong>
          </p>
        )}
        {earnedPoints !== null && (
          <p className="mb-2">
            Body získané nyní: <strong>{earnedPoints}</strong>
          </p>
        )}
        {currentPoints !== null && (
          <p className="mb-4">
            Celkem bodů: <strong>{currentPoints}</strong>
          </p>
        )}
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Domů
        </button>
      </div>
    )
  }

  // 5) Formulář před platbou
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Potvrzení platby</h2>

      <p className="mb-2">
        Celkem: <strong>{totalPrice.toFixed(2)} Kč</strong>
      </p>
      <p className="mb-2">
        Body: <strong>{totalPoints}</strong>
      </p>
      <p className="mb-4">
        Odhad přípravy: <strong>{estimatedPrepTime} minut</strong>
      </p>

      {totalPoints >= 400 && (
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={applyDiscount}
            onChange={() => setApplyDiscount(!applyDiscount)}
            className="mr-2"
          />
          Uplatnit slevu 200 Kč z věrnostního programu
        </label>
      )}

      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="mb-4 space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            checked={method === 'cash'}
            onChange={() => setMethod('cash')}
            className="mr-2"
          />
          Hotově na místě
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            checked={method === 'card'}
            onChange={() => setMethod('card')}
            className="mr-2"
          />
          Kartou online
        </label>
      </div>

      <button
        onClick={handlePay}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Zaplatit
      </button>
    </div>
  )
}

export default CheckoutPage
