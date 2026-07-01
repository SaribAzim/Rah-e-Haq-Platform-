'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAward, FiHeart } from 'react-icons/fi'
import { useLanguage } from '@/lib/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const SAMPLE_DONORS = [
  { donor_name: 'Abdullah Khan', total_amount: 250000, currency: 'PKR', donor_message: 'For the love of Allah and our brothers and sisters in need.', donation_count: 8 },
  { donor_name: 'Fatima Malik', total_amount: 180000, currency: 'PKR', donor_message: 'May Allah accept our small contribution.', donation_count: 5 },
  { donor_name: 'Dr. Imran Shah', total_amount: 150000, currency: 'PKR', donor_message: null, donation_count: 3 },
  { donor_name: 'Zainab & Family', total_amount: 100000, currency: 'PKR', donor_message: 'In memory of our parents who always gave.', donation_count: 4 },
  { donor_name: 'Muhammad Ali', total_amount: 75000, currency: 'PKR', donor_message: null, donation_count: 6 },
]

const RANK_STYLES = [
  { badge: '🥇', bg: 'from-amber-400/20 to-yellow-400/20', border: 'border-amber-400/40', glow: 'shadow-amber-400/20', text: 'text-amber-600 dark:text-amber-400', label: '1st' },
  { badge: '🥈', bg: 'from-slate-400/20 to-slate-300/20', border: 'border-slate-400/40', glow: 'shadow-slate-400/20', text: 'text-slate-600 dark:text-slate-400', label: '2nd' },
  { badge: '🥉', bg: 'from-orange-400/20 to-amber-300/20', border: 'border-orange-400/40', glow: 'shadow-orange-400/20', text: 'text-orange-600 dark:text-orange-400', label: '3rd' },
]

function Confetti() {
  const colors = ['#059669', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6']
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px',
            backgroundColor: colors[i % colors.length],
            rotate: Math.random() * 360,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, Math.random() * 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 1,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

export default function DonorWall() {
  const { t } = useLanguage()
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const hasShown = useRef(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/leaderboard/`)
      .then(r => r.json())
      .then(data => {
        const list = data.leaderboard || []
        setDonors(list.length > 0 ? list : SAMPLE_DONORS)
        if (!hasShown.current) {
          setShowConfetti(true)
          hasShown.current = true
          setTimeout(() => setShowConfetti(false), 4000)
        }
      })
      .catch(() => {
        setDonors(SAMPLE_DONORS)
        if (!hasShown.current) {
          setShowConfetti(true)
          hasShown.current = true
          setTimeout(() => setShowConfetti(false), 4000)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="donors" className="py-24 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {showConfetti && <Confetti />}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6"
          >
            <FiAward className="w-4 h-4" />
            {t('donors.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-white mb-4"
          >
            {t('donors.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
              {t('donors.title2')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            {t('donors.subtitle')}
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : donors.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 py-12">
            {t('donors.empty')}
          </motion.p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {donors.map((donor, i) => {
              const style = i < 3 ? RANK_STYLES[i] : null

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex items-center gap-4 rounded-2xl p-5 border transition-all ${
                    style
                      ? `bg-gradient-to-r ${style.bg} border ${style.border} shadow-xl ${style.glow}`
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 text-center w-10">
                    {style ? (
                      <span className="text-2xl">{style.badge}</span>
                    ) : (
                      <span className="text-slate-400 font-bold text-sm">#{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    style ? `bg-gradient-to-br ${style.bg} border ${style.border}` : 'bg-emerald-500/20'
                  }`}>
                    <span className="text-lg font-bold text-white">
                      {donor.donor_name?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-white truncate">{donor.donor_name}</h3>
                      {style && <span className={`text-xs font-bold ${style.text} hidden sm:block`}>{style.label} Place</span>}
                    </div>
                    {donor.donor_message && (
                      <p className="text-slate-400 text-sm italic truncate">"{donor.donor_message}"</p>
                    )}
                    {donor.donation_count > 1 && (
                      <p className="text-slate-500 text-xs">{donor.donation_count} donations</p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-display font-bold text-lg ${style ? style.text : 'text-emerald-400'}`}>
                      PKR {(donor.total_amount || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-slate-500 text-xs">{t('donors.donated')}</p>
                  </div>

                  {/* Glow effect for top 3 */}
                  {style && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${style.bg} opacity-0 hover:opacity-100 transition-opacity pointer-events-none`} />
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {/* CTA to donate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">Want to appear on the Wall of Honor?</p>
          <a href="/donate" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all">
            <FiHeart className="w-4 h-4" />
            Make a Public Donation
          </a>
        </motion.div>
      </div>
    </section>
  )
}
