'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiCheck, FiTrash2, FiSearch, FiMapPin, FiCalendar,
  FiMail, FiPhone, FiUser, FiAlertCircle
} from 'react-icons/fi'
import Cookies from 'js-cookie'
import { getVolunteers, approveVolunteer, deleteVolunteer } from '@/lib/api'

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchVolunteers = async () => {
    setLoading(true)
    const token = Cookies.get('admin_token')
    if (token) {
      try {
        const data = await getVolunteers(token)
        setVolunteers(data)
      } catch (err) {}
    }
    setLoading(false)
  }

  useEffect(() => { fetchVolunteers() }, [])

  const handleApprove = async (id) => {
    const token = Cookies.get('admin_token')
    try {
      await approveVolunteer(id, token)
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, is_approved: true } : v))
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    const token = Cookies.get('admin_token')
    try {
      await deleteVolunteer(id, token)
      setVolunteers(prev => prev.filter(v => v.id !== id))
      setConfirmDelete(null)
    } catch (err) {}
  }

  const filtered = volunteers.filter(v => {
    if (filter === 'pending' && v.is_approved) return false
    if (filter === 'approved' && !v.is_approved) return false
    if (search) {
      const q = search.toLowerCase()
      return v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.city?.toLowerCase().includes(q)
    }
    return true
  })

  if (loading) return (
    <div className="py-20 flex justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 text-center mb-2">Remove Volunteer?</h3>
              <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone. The volunteer record will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-slate-900">Volunteer Applications</h1>
            <p className="text-slate-400">Review and approve new volunteer signups.</p>
          </div>
          <div className="flex gap-3 text-sm text-slate-500">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-semibold">
              {volunteers.filter(v => !v.is_approved).length} Pending
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold">
              {volunteers.filter(v => v.is_approved).length} Approved
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              All ({volunteers.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Pending ({volunteers.filter(v => !v.is_approved).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Approved ({volunteers.filter(v => v.is_approved).length})
            </button>
          </div>
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search volunteers..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Volunteer Cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <FiUser className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-medium">No volunteers found matching your criteria.</p>
            </div>
          ) : (
            filtered.map((volunteer, i) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
              >
                {/* Avatar + Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {volunteer.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-bold text-lg text-slate-900">{volunteer.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        volunteer.is_approved
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {volunteer.is_approved ? '✓ Approved' : '⏳ Pending Review'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5 text-slate-400" />{volunteer.email}</span>
                      {volunteer.phone && <span className="flex items-center gap-1.5"><FiPhone className="w-3.5 h-3.5 text-slate-400" />{volunteer.phone}</span>}
                      {volunteer.city && <span className="flex items-center gap-1.5"><FiMapPin className="w-3.5 h-3.5 text-slate-400" />{volunteer.city}</span>}
                      {volunteer.availability && <span className="flex items-center gap-1.5"><FiCalendar className="w-3.5 h-3.5 text-slate-400" />{volunteer.availability}</span>}
                    </div>

                    {volunteer.motivation && (
                      <div className="bg-slate-50 px-3 py-2 rounded-xl mb-3">
                        <p className="text-sm text-slate-600 italic">"{volunteer.motivation}"</p>
                      </div>
                    )}

                    {volunteer.skills && (
                      <div className="flex flex-wrap gap-1.5">
                        {volunteer.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-2 md:min-w-[130px]">
                  {!volunteer.is_approved && (
                    <button
                      onClick={() => handleApprove(volunteer.id)}
                      className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-4 h-4" /> Approve
                    </button>
                  )}
                  <a
                    href={`mailto:${volunteer.email}`}
                    className="flex-1 md:flex-none py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail className="w-4 h-4" /> Email
                  </a>
                  <button
                    onClick={() => setConfirmDelete(volunteer.id)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
