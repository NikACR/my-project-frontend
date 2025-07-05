import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import ProductCard from '../components/ProductCard';

interface Allergen {
  id_alergenu: number;
  nazev: string;
}

interface MenuItem {
  id_menu_polozka: number;
  nazev: string;
  popis: string;
  cena: number;
  alergeny: Allergen[];
  priprava: number; // minuty
  body: number;     // body
}

const ProductsPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<MenuItem[]>('/menu')
      .then(r => setItems(r.data))
      .catch(() => setError('Nepodařilo se načíst nabídku.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {items.map(i => (
        <ProductCard
          key={i.id_menu_polozka}
          id={i.id_menu_polozka}
          title={i.nazev}
          description={i.popis}
          price={i.cena}
          allergens={i.alergeny}
          prepTime={i.priprava}
          loyaltyPoints={i.body}
        />
      ))}
    </div>
  );
};

export default ProductsPage;
