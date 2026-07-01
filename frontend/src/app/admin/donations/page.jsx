'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiDollarSign, FiCheck, FiTrash2, FiSearch, FiImage,
  FiX, FiClock, FiCheckCircle, FiUser, FiCalendar,
  FiSmartphone, FiCreditCard, FiAlertCircle
} from 'react-icons/fi'
import Cookies from 'js-cookie'
import { getAllDonations, getDonationStats, deleteDonation, verifyDonation } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

function ScreenshotModal({ url, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <p className="font-semibold text-slate-700">Payment Screenshot</p>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <FiX className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4">
          <img src={url} alt="Payment proof" className="w-full rounded-xl max-h-[70vh] object-contain" />
        </div>
      </motion.div>
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, gradient, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl p-6 text-white bg-gradient-to-br ${gradient}`}
    >
      <Icon className="w-9 h-9 mb-3 opacity-80" />
      <h3 className="font-bold text-3xl mb-1">{value}</h3>
      <p className="opacity-75 text-sm">{label}</p>
    </motion.div>
  )
}

function PaymentBadge({ method }) {
  const isBank = method?.toLowerCase().includes('bank')
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
      isBank
        ? 'bg-blue-50 text-blue-700 border border-blue-100'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
    }`}>
      {isBank ? <FiCreditCard className="w-3 h-3" /> : <FiSmartphone className="w-3 h-3" />}
      {method || 'Unknown'}
    </span>
  )
}

export default function DonationsPage() {
  const [donations, setDonations] = useState([])
  const [stats, setStats] = useState({ total_donations: 0, total_amount: 0, average_donation: 0, verified_donations: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedScreenshot, setSelectedScreenshot] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const token = typeof window !== 'undefined' ? Cookies.get('admin_token') : null

  const fetchData = async () => {
    setLoading(true)
    try {
      const [donationData, statsData] = await Promise.all([
        getAllDonations(token),
        getDonationStats(token),
      ])
      setDonations(donationData)
      setStats(statsData)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleVerify = async (id) => {
    try {
      await verifyDonation(id, token)
      setDonations(prev => prev.map(d => d.id === id ? { ...d, is_completed: true } : d))
      setStats(prev => ({ ...prev, verified_donations: prev.verified_donations + 1 }))
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id, token)
      setDonations(prev => prev.filter(d => d.id !== id))
      setConfirmDelete(null)
    } catch (err) {}
  }

  const filtered = donations.filter(d => {
    if (filter === 'pending' && d.is_completed) return false
    if (filter === 'verified' && !d.is_completed) return false
    if (search) {
      const q = search.toLowerCase()
      return d.donor_name?.toLowerCase().includes(q) || d.donor_email?.toLowerCase().includes(q)
    }
    return true
  })

  const formatAmount = (n) => `Rs. ${(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
  const formatDate = (d) => new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <>
      <AnimatePresence>
        {selectedScreenshot && (
          <ScreenshotModal url={selectedScreenshot} onClose={() => setSelectedScreenshot(null)} />
        )}
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
              <h3 className="font-bold text-lg text-slate-900 text-center mb-2">Delete Donation?</h3>
              <p className="text-slate-500 text-sm text-center mb-6">This will permanently remove the record and uploaded screenshot.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl text-slate-900">Donations</h1>
          <p className="text-slate-400">Review and verify donation submissions from donors.</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FiDollarSign} label="Total Raised" value={formatAmount(stats.total_amount)} gradient="from-emerald-500 to-emerald-600" delay={0} />
          <StatCard icon={FiDollarSign} label="Total Donations" value={stats.total_donations} gradient="from-blue-500 to-indigo-600" delay={0.05} />
          <StatCard icon={FiCheckCircle} label="Verified" value={stats.verified_donations ?? 0} gradient="from-teal-500 to-cyan-600" delay={0.1} />
          <StatCard icon={FiClock} label="Pending Review" value={(stats.total_donations || 0) - (stats.verified_donations || 0)} gradient="from-amber-500 to-orange-500" delay={0.15} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex gap-2 w-full sm:w-auto">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: `Pending (${donations.filter(d => !d.is_completed).length})` },
              { key: 'verified', label: `Verified (${donations.filter(d => d.is_completed).length})` },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filter === f.key
                    ? f.key === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Donation List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
            <FiDollarSign className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-medium">No donation records found.</p>
            <p className="text-sm mt-1">Donations submitted via the website will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((donation, i) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Avatar + Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {donation.donor_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-base">{donation.donor_name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          donation.is_completed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {donation.is_completed ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <FiUser className="w-3.5 h-3.5" />
                          {donation.donor_email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {formatDate(donation.created_at)}
                        </span>
                        <PaymentBadge method={donation.payment_method} />
                      </div>
                      {donation.donor_message && (
                        <p className="mt-2 text-sm text-slate-500 italic bg-slate-50 rounded-lg px-3 py-2">
                          "{donation.donor_message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Amount + Screenshot + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0 flex-wrap lg:flex-nowrap">
                    {/* Amount */}
                    <div className="text-right">
                      <p className="font-bold text-xl text-emerald-600">{formatAmount(donation.amount)}</p>
                      <p className="text-xs text-slate-400">PKR</p>
                    </div>

                    {/* Screenshot */}
                    {donation.screenshot_url ? (
                      <button
                        onClick={() => setSelectedScreenshot(`${API_BASE}/uploads/${donation.screenshot_url}`)}
                        className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-emerald-400 transition-colors flex-shrink-0 group relative"
                        title="View screenshot"
                      >
                        <img
                          src={`${API_BASE}/uploads/${donation.screenshot_url}`}
                          alt="Screenshot"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <FiImage className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ) : (
                      <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center flex-shrink-0">
                        <FiImage className="w-5 h-5 text-slate-300" />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {!donation.is_completed && (
                        <button
                          onClick={() => handleVerify(donation.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                          title="Mark as verified"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span className="hidden sm:inline">Verify</span>
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(donation.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
