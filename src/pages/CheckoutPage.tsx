// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const CheckoutPage: React.FC = () => {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState<string>('');
  const [paid, setPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState<number>();
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);

  const handlePay = async () => {
    setError('');

    // Vytvoříme payload přesně podle ObjednavkaUserCreateSchema
    const payload = {
      items: items.map(item => ({
        id_menu_polozka: item.id,    // odpovídá id_menu_polozka v backendu
        mnozstvi:        item.quantity
      })),
      apply_discount: false         // případně true, když chceš uplatnit slevu
    };

    try {
      const res = await api.post('/objednavky', payload);

      // Uložíme odpověď
      setPaidAmount(parseFloat(res.data.celkova_castka as string));
      if (res.data.cas_pripravy) {
        const start = new Date(res.data.datum_cas).getTime();
        const ready = new Date(res.data.cas_pripravy).getTime();
        setPrepTime(Math.ceil((ready - start) / 60000));
      }
      setEarnedPoints(res.data.body_ziskane as number);

      clear();
      setPaid(true);
    } catch (e: any) {
      console.error('OBJEDNAVKY ERROR status:', e.response?.status);
      console.error('OBJEDNAVKY ERROR data:', e.response?.data);
      if (e.response?.status === 422) {
        setError('Chybný vstup – prosím zkontroluj položky v košíku.');
      } else {
        setError('Došlo k chybě při odesílání objednávky.');
      }
    }
  };

  if (paid) {
    const amount = paidAmount ?? total;
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Děkujeme za objednávku!</h2>
        <p className="mb-4">
          Zaplatili jste <strong>{amount.toFixed(2)} Kč</strong>
        </p>
        {prepTime !== null && (
          <p className="mb-4">
            Objednávka bude hotová za <strong>{prepTime} minut</strong>
          </p>
        )}
        {earnedPoints !== null && (
          <p className="mb-6">
            Získali jste <strong>{earnedPoints} bodů</strong>
          </p>
        )}
        <button
          onClick={() => nav('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Domů
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Potvrzení platby</h2>
      <p className="mb-4">
        Celkem: <strong>{total.toFixed(2)} Kč</strong>
      </p>
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
          Kartou online
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
  );
};

export default CheckoutPage;
