// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const CheckoutPage: React.FC = () => {
  const { items, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState<string>('');
  const [paid, setPaid] = useState(false);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);

  const handlePay = async () => {
    setError('');

    // 1) Odešleme objednávku
    const objednavkaPayload = {
      items: items.map(item => ({
        id_menu_polozka: item.id,
        mnozstvi:        item.quantity ?? 1,
        cena:            item.price.toFixed(2)
      })),
      apply_discount: false
    };

    try {
      // vytvoříme objednávku
      const resObj = await api.post('/objednavky', objednavkaPayload);

      const idObjednavky     = resObj.data.id_objednavky as number;
      const castkaIso        = resObj.data.celkova_castka as string;
      const bodyZiskane      = resObj.data.body_ziskane      as number;
      const casPripravyIso   = resObj.data.cas_pripravy      as string;

      // převedeme částku na number
      const castka = parseFloat(castkaIso);

      // 2) Odešleme platbu
      const platbaPayload = {
        id_objednavky: idObjednavky,
        castka:        castka.toFixed(2),
        typ_platby:    paymentMethod === 'cash' ? 'hotove' : 'kartou',
        datum:         new Date().toISOString()
      };
      await api.post('/platba', platbaPayload);

      // 3) Spočteme zbývající minuty
      const finishMs    = new Date(casPripravyIso).getTime();
      const nowMs       = Date.now();
      const minutesLeft = Math.max(0, Math.round((finishMs - nowMs) / 60000));

      // 4) Uložíme výsledky
      setPaidAmount(castka);
      setEarnedPoints(bodyZiskane);
      setPrepTime(minutesLeft);
      clear();
      setPaid(true);

    } catch (e: any) {
      console.error('PLATBA ERROR status:', e.response?.status);
      console.error('PLATBA ERROR data:', e.response?.data);
      if (e.response?.status === 422) {
        setError('Chybný vstup – prosím zkontroluj položky v košíku.');
      } else if (e.response?.status === 404) {
        setError('Nepodařilo se najít endpoint pro platbu. Zkontroluj URL v kódu.');
      } else {
        setError('Došlo k chybě při odesílání objednávky nebo platby.');
      }
    }
  };

  // Shrnutí po úspěchu
  if (paid) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Děkujeme za objednávku!</h2>
        <p className="mb-4">
          Zaplatili jste <strong>{paidAmount.toFixed(2)} Kč</strong>
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

  // Formulář platby
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Potvrzení platby</h2>
      <p className="mb-4">
        Celkem: <strong>{paidAmount > 0 ? paidAmount.toFixed(2) : '0.00'} Kč</strong>
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
