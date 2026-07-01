'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTarget, FiClock, FiHeart, FiTrendingUp } from 'react-icons/fi'
import { useLanguage } from '@/lib/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const SAMPLE_CAMPAIGNS = [
  {
    id: 1, title: 'Ramadan Ration Drive 2024', description: 'Providing 500 families with complete ration packages this Ramadan.',
    goal_amount: 1500000, current_amount: 987000, deadline: '2024-12-31', image_url: null, is_active: true
  },
  {
    id: 2, title: 'School Supplies for 200 Children', description: 'Equipping underprivileged children with books, bags, and stationery.',
    goal_amount: 500000, current_amount: 320000, deadline: '2024-11-30', image_url: null, is_active: true
  },
  {
    id: 3, title: 'Medical Camp — Rural Sindh', description: 'Free medical checkups and medicine for 1,000 patients in remote areas.',
    goal_amount: 800000, current_amount: 800000, deadline: '2024-10-15', image_url: null, is_active: true
  },
]

function CircularProgress({ percent }) {
  const r = 44
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - Math.min(percent / 100, 1))

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" className="dark:stroke-slate-700" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="url(#grad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{Math.round(percent)}%</span>
      </div>
    </div>
  )
}

function getDaysLeft(deadline) {
  if (!deadline) return null
  const diff = new Date(deadline) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function Campaigns({ standalone = false }) {
  const { t } = useLanguage()
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [donating, setDonating] = useState(null)
  const [donationForm, setDonationForm] = useState({ name: '', email: '', amount: '' })
  const [donated, setDonated] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/campaigns/`)
      .then(r => r.json())
      .then(data => setCampaigns(data.length > 0 ? data : SAMPLE_CAMPAIGNS))
      .catch(() => setCampaigns(SAMPLE_CAMPAIGNS))
      .finally(() => setLoading(false))
  }, [])

  const handleDonate = async (e) => {
    e.preventDefault()
    const amount = parseFloat(donationForm.amount)
    if (!amount || amount <= 0) return
    try {
      await fetch(`${API_BASE}/api/donations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor_name: donationForm.name,
          donor_email: donationForm.email,
          amount,
          currency: 'PKR',
          campaign_id: donating,
        })
      })
      setDonated(donating)
      setDonating(null)
      setCampaigns(prev => prev.map(c => c.id === donating ? { ...c, current_amount: c.current_amount + amount } : c))
      setTimeout(() => setDonated(null), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  return (
    <section id="campaigns" className={`${standalone ? 'pt-32' : 'py-24'} pb-24 bg-slate-50 dark:bg-slate-950`}>
      {standalone && (
        <div className="text-center mb-4 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4"
          >
            ✦ Rah-E-Haq
          </motion.div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <FiTarget className="w-4 h-4" />
            {t('campaigns.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-dark dark:text-white mb-4"
          >
            {t('campaigns.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              {t('campaigns.title2')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            {t('campaigns.subtitle')}
          </motion.p>
        </div>

        {campaigns.length === 0 ? (
          <p className="text-center text-muted py-12">{t('campaigns.empty')}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, i) => {
              const percent = campaign.goal_amount > 0 ? (campaign.current_amount / campaign.goal_amount) * 100 : 0
              const daysLeft = getDaysLeft(campaign.deadline)
              const completed = percent >= 100

              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border ${completed ? 'border-emerald-200 dark:border-emerald-700/50' : 'border-slate-100 dark:border-slate-700'}`}
                >
                  {/* Campaign image placeholder */}
                  <div className={`w-full h-40 rounded-2xl mb-5 overflow-hidden bg-gradient-to-br ${
                    i % 3 === 0 ? 'from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40' :
                    i % 3 === 1 ? 'from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40' :
                    'from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40'
                  } flex items-center justify-center text-5xl`}>
                    {['🌙', '📚', '🏥'][i % 3]}
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-lg text-dark dark:text-white mb-1 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {campaign.title}
                      </h3>
                      <p className="text-muted text-sm line-clamp-2">{campaign.description}</p>
                    </div>
                    <CircularProgress percent={percent} />
                  </div>

                  {/* Amount stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
                      <p className="text-xs text-muted mb-1">{t('campaigns.raised')}</p>
                      <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        PKR {(campaign.current_amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                      <p className="text-xs text-muted mb-1">{t('campaigns.goal')}</p>
                      <p className="font-bold text-dark dark:text-white text-sm">
                        PKR {campaign.goal_amount.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {daysLeft !== null && (
                    <div className="flex items-center gap-1 text-xs text-muted mb-5">
                      <FiClock className="w-3 h-3" />
                      {completed ? '✅ Goal Reached!' : `${daysLeft} ${t('campaigns.days')}`}
                    </div>
                  )}

                  <button
                    onClick={() => { setDonating(campaign.id); setDonationForm({ name: '', email: '', amount: '' }) }}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5'
                    }`}
                  >
                    <FiHeart className="w-4 h-4" />
                    {completed ? 'Campaign Complete!' : t('campaigns.donate')}
                  </button>

                  {donated === campaign.id && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-emerald-600 text-sm mt-3 font-medium">
                      ✅ Thank you for your donation!
                    </motion.p>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Donation Modal */}
      <AnimatePresence>
        {donating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setDonating(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="font-display font-bold text-2xl text-dark dark:text-white mb-2">
                {t('campaigns.donate')}
              </h3>
              <p className="text-muted text-sm mb-6">
                {campaigns.find(c => c.id === donating)?.title}
              </p>
              <form onSubmit={handleDonate} className="space-y-4">
                <input required placeholder="Your Name" value={donationForm.name}
                  onChange={e => setDonationForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input required type="email" placeholder="Email Address" value={donationForm.email}
                  onChange={e => setDonationForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input required type="number" min="100" placeholder="Amount (PKR)" value={donationForm.amount}
                  onChange={e => setDonationForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setDonating(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-muted hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Donate
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
