// src/pages/HomePage.tsx
import React from 'react'

export default function HomePage() {
  return (
    <div className="flex flex-col mt-0">
      {/* —— Hero sekce —— */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src="/static/images/hero-restaurant.jpg"
          alt="Restaurace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-4">Restaurace U Nás doma</h1>
            <p className="text-xl">
              Vítejte v naší restauraci U NÁS DOMA – prohlédněte si nabídku, uspořádejte firemní večírek
              nebo si rezervujte stůl či workshop.
            </p>
          </div>
        </div>
      </section>

      {/* —— Gradientový pásek —— */}
      <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* —— Čtyři karty —— */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Stoly', icon: '🍽️', text: 'Komfortní sezení pro každou příležitost.' },
            { title: 'Salónek', icon: '🏠', text: 'Soukromí pro firemní večírky a oslavy.' },
            { title: 'Firemní akce', icon: '🎉', text: 'Teambuilding a speciální eventy.' },
            { title: 'Workshopy', icon: '👩‍🍳', text: 'Kurzy vaření, pečení i míchání koktejlů.' },
          ].map((c, i) => (
            <div key={i} className="p-6 bg-gray-50 rounded-lg shadow text-center">
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{c.title}</h3>
              <p className="text-gray-600">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* —— Galerie obrázků —— */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Naše prostory v obrazech</h2>
        <div className="max-w-6xl mx-auto grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-lg hover:scale-105 transition-transform duration-200"
            >
              <img
                src={`/static/images/ig-placeholder-${idx + 1}.jpg`}
                alt={`Galerie ${idx + 1}`}
                className="w-full h-32 object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* —— Patička —— */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
          {/* Kontakt */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Kontakt</h4>
            <address className="not-italic space-y-1">
              <p>Restaurace U Nás doma</p>
              <p>Hlavní 123, 100 00 Praha</p>
              <p>tel: +420 123 456 789</p>
              <p>email: info@unasdoma.cz</p>
            </address>
          </div>

          {/* Odkazy */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Odkazy</h4>
            <ul className="space-y-1">
              <li><a href="/reservations" className="hover:underline">Rezervace stolů</a></li>
              <li><a href="/events" className="hover:underline">Firemní akce</a></li>
              <li><a href="/workshops" className="hover:underline">Workshopy</a></li>
              <li><a href="/menu" className="hover:underline">Nabídka jídla</a></li>
            </ul>
          </div>

          {/* Sociální sítě */}
          <div>
            <h4 className="text-lg font-semibold mb-2 text-white">Sledujte nás</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">📘 Facebook</a>
              <a href="#" className="hover:text-white">📸 Instagram</a>
              <a href="#" className="hover:text-white">🐦 Twitter</a>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8">
          © {new Date().getFullYear()} Restaurace U Nás doma. Všechna práva vyhrazena.
        </p>
      </footer>
    </div>
  )
}
