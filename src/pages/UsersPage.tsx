// src/pages/UsersPage.tsx
import React, { useEffect, useState } from 'react'
import api from '../utils/api'

interface User {
  id_zakaznika: number
  jmeno: string
  prijmeni: string
  email: string
  telefon?: string
  roles?: string[]
}

const roleNames: Record<string, string> = {
  user:  'Uživatel',
  staff: 'Pracovník',
  admin: 'Administrátor'
}

const PAGE_SIZE = 10

const UsersPage: React.FC = () => {
  const [users, setUsers]       = useState<User[]>([])
  const [jmeno, setJmeno]       = useState('')
  const [prijmeni, setPrijmeni] = useState('')
  const [email, setEmail]       = useState('')
  const [telefon, setTelefon]   = useState('')
  const [password, setPassword] = useState('')
  const [editId, setEditId]     = useState<number | null>(null)
  const [page, setPage]         = useState(1)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/zakaznik')
      setUsers(res.data)
    } catch {
      alert('Nepodařilo se načíst uživatele.')
    }
  }

  const resetForm = () => {
    setEditId(null)
    setJmeno('')
    setPrijmeni('')
    setEmail('')
    setTelefon('')
    setPassword('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editId !== null) {
        const body: any = { jmeno, prijmeni, email, telefon }
        if (password) body.password = password
        await api.put(`/zakaznik/${editId}`, body)
      } else {
        await api.post('/zakaznik', { jmeno, prijmeni, email, telefon, password })
      }
      resetForm()
      fetchUsers()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Chyba při ukládání uživatele')
    }
  }

  const handleEdit = (u: User) => {
    setEditId(u.id_zakaznika)
    setJmeno(u.jmeno)
    setPrijmeni(u.prijmeni)
    setEmail(u.email)
    setTelefon(u.telefon || '')
    setPassword('')
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Opravdu smazat tohoto uživatele?')) return
    try {
      await api.delete(`/zakaznik/${id}`)
      fetchUsers()
    } catch {
      alert('Chyba při mazání uživatele.')
    }
  }

  // pagination
  const pageCount = Math.ceil(users.length / PAGE_SIZE)
  const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero pás */}
      <div className="bg-indigo-100 py-8 mb-6">
        <h1 className="text-3xl font-bold text-center text-indigo-800">
          Správa uživatelů
        </h1>
        <p className="text-center text-gray-700 mt-2">
          Přehled, úprava a správa uživatelských účtů.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Formulář */}
        <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Jméno"
            required
            value={jmeno}
            onChange={e => setJmeno(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm"
          />
          <input
            type="text"
            placeholder="Příjmení"
            required
            value={prijmeni}
            onChange={e => setPrijmeni(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="md:col-span-2 border px-3 py-2 rounded shadow-sm"
          />
          <input
            type="text"
            placeholder="Telefon"
            value={telefon}
            onChange={e => setTelefon(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm"
          />
          <input
            type="password"
            placeholder={editId ? 'Nové heslo (nepovinné)' : 'Heslo'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border px-3 py-2 rounded shadow-sm"
          />
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className={`flex-1 py-2 rounded text-white ${
                editId !== null
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {editId !== null ? 'Upravit uživatele' : 'Přidat uživatele'}
            </button>
            {editId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Zrušit
              </button>
            )}
          </div>
        </form>

        {/* Tabulka */}
        <div className="overflow-x-auto shadow-lg bg-white rounded-lg">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Jméno</th>
                <th className="px-4 py-3 text-left">Příjmení</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Telefon</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Akce</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map(u => (
                <tr key={u.id_zakaznika} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-2">{u.id_zakaznika}</td>
                  <td className="px-4 py-2">{u.jmeno}</td>
                  <td className="px-4 py-2">{u.prijmeni}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.telefon || '-'}</td>
                  <td className="px-4 py-2">
                    {(u.roles ?? []).map(r => roleNames[r] || r).join(', ') || 'Uživatel'}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id_zakaznika)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stránkování */}
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            ‹ Předchozí
          </button>
          <span className="text-gray-700">
            Strana <strong>{page}</strong> z <strong>{pageCount}</strong>
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Další ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default UsersPage
