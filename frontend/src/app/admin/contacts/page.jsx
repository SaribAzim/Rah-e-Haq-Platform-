'use client'

import { useState, useEffect } from 'react'
import { FiMail, FiSearch, FiCalendar } from 'react-icons/fi'
import Cookies from 'js-cookie'

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      const token = Cookies.get('admin_token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

      try {
        const res = await fetch(`${API_URL}/api/contact/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Failed to fetch contacts')
        const data = await res.json()
        setContacts(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [])

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-800">Contact Messages</h1>
        <p className="text-slate-500">{contacts.length} total messages</p>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          Error: {error}
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <FiMail className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">
              {contacts.length === 0 ? 'No contact messages yet' : 'No results found'}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl p-6 shadow-sm ${!contact.is_read ? 'border-l-4 border-emerald-500' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${!contact.is_read ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <FiMail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800">{contact.name}</h3>
                    {!contact.is_read && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-emerald-600 text-sm">{contact.email}</p>
                  {contact.subject && (
                    <p className="text-slate-500 text-sm mt-1">Subject: {contact.subject}</p>
                  )}
                  <p className="text-slate-600 mt-3">{contact.message}</p>
                  <div className="flex items-center gap-2 mt-3 text-slate-400 text-sm">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(contact.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
