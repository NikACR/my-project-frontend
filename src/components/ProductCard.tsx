import React from 'react';
import { useCart } from '../contexts/CartContext';

interface Allergen {
  id_alergenu: number;
  nazev: string;
}

interface Props {
  id: number;
  title: string;
  description: string;
  price: number | string;
  allergens: Allergen[];
  prepTime: number;     // minuty přípravy
  loyaltyPoints: number;
}

const ProductCard: React.FC<Props> = ({
  id,
  title,
  description,
  price,
  allergens,
  prepTime,
  loyaltyPoints
}) => {
  const { add } = useCart();
  const numericPrice = typeof price === 'number' ? price : parseFloat(price as string) || 0;

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
        {allergens.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {allergens.map(a => (
              <span
                key={a.id_alergenu}
                className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full"
              >
                {a.nazev}
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Příprava: {prepTime} min | Body: {loyaltyPoints}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold">{numericPrice.toFixed(2)} Kč</span>
        <button
          onClick={() =>
            add({ id, title, price: numericPrice, prepTime, points: loyaltyPoints })
          }
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Přidat
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
