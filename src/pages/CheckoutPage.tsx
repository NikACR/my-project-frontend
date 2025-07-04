// src/pages/CheckoutPage.tsx

import React, { useState } from 'react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const CheckoutPage: React.FC = () => {
  const { total, clear } = useCart()
  const { user } = useAuth()
  const nav = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [paidAmount, setPaidAmount] = useState<number | null>(null)
  const [paid, setPaid] = useState(false)

  const handlePay = async () => {
    setError(null)

    // --- validace ---
    if (paymentMethod === 'card') {
      if (!/^\d{16}$/.test(cardNumber)) {
        setError('Číslo karty musí obsahovat 16 číslic.')
        return
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError('Platnost musí být ve formátu MM/YY.')
        return
      }
      const [m, y] = expiry.split('/').map(n => parseInt(n, 10))
      const expDate = new Date(2000 + y, m - 1)
      if (expDate <= new Date()) {
        setError('Platnost karty již vypršela.')
        return
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('CVV musí mít 3 nebo 4 číslice.')
        return
      }
    }

    // --- připravíme payload tak, aby back-end validace prošla ---
    // 1) odstraníme "Z" z ISO stringu (marshmallow.fromiso nezná "Z")
    const nowIso = new Date().toISOString().replace(/Z$/, '')

    // 2) přidáme "stav" (jinak DB hází NOT NULL violation)
    const payload = {
      datum_cas:      nowIso,              // např. "2025-07-03T23:40:27.745"
      stav:           'čekající',          // nebo jakkoliv chcete označit nový stav
      celkova_castka: total.toFixed(2),    // string "995.00"
      id_zakaznika:   user.id_zakaznika
    }

    try {
      await api.post('/objednavka', payload)

      setPaidAmount(total)
      clear()
      setPaid(true)
    } catch (e) {
      console.error(e)
      setError('Platba selhala. Zkuste to prosím znovu.')
    }
  }

  if (paid) {
    const amount = paidAmount ?? total
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Děkujeme za objednávku!</h2>
        <p className="mb-6">
          Částka <strong>{amount.toFixed(2)} Kč</strong> byla uhrazena.
        </p>
        <button
          onClick={() => nav('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Domů
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Potvrzení platby</h2>
      <p className="mb-4">Celková částka: <strong>{total.toFixed(2)} Kč</strong></p>
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <div className="mb-4 space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
            className="mr-2"
          />
          Hotově na místě
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            className="mr-2"
          />
          Online kartou
        </label>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="Číslo karty (16 číslic)"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value.replace(/\s/g, ''))}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Platnost MM/YY"
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}

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
