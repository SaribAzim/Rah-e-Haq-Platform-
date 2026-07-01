'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiMail, FiCalendar } from 'react-icons/fi'
import Cookies from 'js-cookie'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchSubscribers = async () => {
      const token = Cookies.get('admin_token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

      try {
        const res = await fetch(`${API_URL}/api/newsletter/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!res.ok) throw new Error('Failed to fetch subscribers')
        const data = await res.json()
        setSubscribers(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSubscribers()
  }, [])

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Newsletter Subscribers</h1>
          <p className="text-muted">{subscribers.length} total subscribers</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          Error: {error}
        </div>
      )}

      {/* Subscribers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-muted">Loading subscribers...</div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FiUsers className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-muted">
              {subscribers.length === 0 ? 'No subscribers yet' : 'No results found'}
            </p>
          </div>
        ) : (
          filteredSubscribers.map((subscriber, i) => (
            <motion.div
              key={subscriber.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-dark text-sm">{subscriber.email}</p>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <FiCalendar className="w-3 h-3" />
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
