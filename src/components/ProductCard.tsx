// src/components/ProductCard.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

interface Allergen {
  id_alergenu: number
  nazev: string
}

interface Props {
  id: number
  title: string
  description: string
  price: number | string
  allergens: Allergen[]
  obrazekUrl?: string | null
}

const ProductCard: React.FC<Props> = ({
  id,
  title,
  description,
  price,
  allergens,
  obrazekUrl = null,
}) => {
  const { add } = useCart()

  const numericPrice =
    typeof price === 'number' ? price : parseFloat(price as string) || 0

  const handleAdd = () => {
    add({ id, title, price: numericPrice })
  }

  return (
    <div className="bg-white rounded shadow flex flex-col">
      {/* Obrázek */}
      {obrazekUrl ? (
        <img
          src={obrazekUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-t"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-t flex items-center justify-center text-gray-400">
          {/* placeholder */}
          <img src="/images/default-food.jpg" alt="placeholder" className="h-16" />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Odkaz na detail */}
          <Link to={`/products/${id}`} className="text-xl font-semibold text-indigo-600 hover:underline">
            {title}
          </Link>
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
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg">
            {numericPrice.toFixed(2)} Kč
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Přidat
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
