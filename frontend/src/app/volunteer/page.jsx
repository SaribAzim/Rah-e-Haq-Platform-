'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCheckCircle, FiChevronRight, FiChevronLeft, FiHeart } from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const SKILLS = [
  { id: 'teaching', label: 'Teaching', icon: '📚' },
  { id: 'medical', label: 'Medical / First Aid', icon: '🏥' },
  { id: 'driving', label: 'Driving', icon: '🚗' },
  { id: 'cooking', label: 'Cooking', icon: '🍳' },
  { id: 'carpentry', label: 'Carpentry', icon: '🔨' },
  { id: 'technology', label: 'Technology / IT', icon: '💻' },
  { id: 'fundraising', label: 'Fundraising', icon: '💰' },
  { id: 'social_media', label: 'Social Media', icon: '📱' },
  { id: 'photography', label: 'Photography', icon: '📷' },
  { id: 'counseling', label: 'Counseling', icon: '🤝' },
  { id: 'translation', label: 'Translation / Urdu', icon: '🌐' },
  { id: 'physical', label: 'Physical Labour', icon: '💪' },
]

const AVAILABILITY = ['Weekdays', 'Weekends', 'Evenings only', 'Full-time', 'Flexible']

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Other']

function ConfettiBlast() {
  const colors = ['#059669', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444']
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: '40%',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: colors[i % colors.length],
          }}
          animate={{
            y: [0, -150 - Math.random() * 200, 500],
            x: [(Math.random() - 0.5) * 300],
            rotate: [0, Math.random() * 720],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.5, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

const STEP_LABELS = ['Personal Info', 'Skills & Availability', 'Motivation']

export default function VolunteerPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    skills_list: [],
    availability: '',
    motivation: '',
    event_interest: '',
  })

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills_list: p.skills_list.includes(skill)
        ? p.skills_list.filter(s => s !== skill)
        : [...p.skills_list, skill]
    }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch(`${API_BASE}/api/volunteer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills_list.join(', '),
        }),
      })
      setShowConfetti(true)
      setSubmitted(true)
      setTimeout(() => setShowConfetti(false), 4000)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.phone && form.city
    if (step === 1) return form.skills_list.length > 0 && form.availability
    return true
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      {showConfetti && <ConfettiBlast />}

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 relative text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-6"
          >
            <FiHeart className="w-4 h-4" />
            Join the Movement
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-6xl text-white mb-6"
          >
            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Volunteer</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-300 text-xl max-w-2xl mx-auto"
          >
            Join 500+ volunteers across Pakistan making a real difference in communities that need it most.
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            {[['500+', 'Active Volunteers'], ['25+', 'Cities Covered'], ['100%', 'Free to Join']].map(([val, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{val}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto text-center"
              >
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                  <FiCheckCircle className="w-14 h-14 text-white" />
                </div>
                <h2 className="font-display font-bold text-4xl text-dark dark:text-white mb-4">You're In! 🎉</h2>
                <p className="text-muted text-lg mb-6">
                  Welcome to the Rah-E-Haq family, <strong>{form.name}</strong>! Our team will reach out to you shortly at <strong>{form.email}</strong>.
                </p>
                <p className="text-muted">While you wait, explore our active campaigns and events below.</p>
                <div className="flex gap-3 justify-center mt-8">
                  <a href="/#campaigns" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg transition-all">
                    View Campaigns
                  </a>
                  <a href="/#events" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-dark dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    See Events
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" className="max-w-2xl mx-auto">
                {/* Step Progress */}
                <div className="flex items-center justify-center mb-12">
                  {STEP_LABELS.map((label, i) => (
                    <div key={i} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          i < step ? 'bg-emerald-500 text-white' :
                          i === step ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20' :
                          'bg-slate-200 dark:bg-slate-700 text-muted'
                        }`}>
                          {i < step ? <FiCheckCircle className="w-5 h-5" /> : i + 1}
                        </div>
                        <span className={`text-xs mt-2 font-medium hidden sm:block ${i === step ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`h-0.5 w-16 sm:w-24 mx-2 transition-all duration-300 ${i < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 0: Personal Info */}
                    {step === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-2">Personal Information</h2>
                        <p className="text-muted text-sm mb-8">Tell us a bit about yourself so we can match you with the right drives.</p>
                        <div className="space-y-4">
                          <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                            <input value={form.name} onChange={e => update('name', e.target.value)}
                              placeholder="Full Name *" className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                              placeholder="Email Address *" className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                            <input value={form.phone} onChange={e => update('phone', e.target.value)}
                              placeholder="Phone Number *" className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                          </div>
                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                            <select value={form.city} onChange={e => update('city', e.target.value)}
                              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                            >
                              <option value="">Select your city *</option>
                              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 1: Skills */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-2">Skills & Availability</h2>
                        <p className="text-muted text-sm mb-6">Select all skills you can offer — we match volunteers to drives based on these.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                          {SKILLS.map(skill => (
                            <button
                              key={skill.id}
                              type="button"
                              onClick={() => toggleSkill(skill.id)}
                              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                                form.skills_list.includes(skill.id)
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                  : 'border-slate-200 dark:border-slate-600 text-muted hover:border-slate-300 dark:hover:border-slate-500'
                              }`}
                            >
                              <span>{skill.icon}</span>
                              <span className="truncate">{skill.label}</span>
                            </button>
                          ))}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-dark dark:text-white mb-3">Availability *</p>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABILITY.map(avail => (
                              <button
                                key={avail}
                                type="button"
                                onClick={() => update('availability', avail)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                                  form.availability === avail
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                    : 'border-slate-200 dark:border-slate-600 text-muted hover:border-slate-300'
                                }`}
                              >
                                {avail}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Motivation */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h2 className="font-display font-bold text-2xl text-dark dark:text-white mb-2">Your Motivation</h2>
                        <p className="text-muted text-sm mb-6">Share your story — why do you want to volunteer with Rah-E-Haq?</p>

                        <textarea
                          value={form.motivation} onChange={e => update('motivation', e.target.value)}
                          placeholder="Tell us what drives your passion to help others..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none mb-4"
                        />

                        <div>
                          <label className="text-sm font-semibold text-dark dark:text-white mb-2 block">
                            Which type of events are you interested in? (optional)
                          </label>
                          <input
                            value={form.event_interest} onChange={e => update('event_interest', e.target.value)}
                            placeholder="e.g. Ration drives, Medical camps, Tree plantation..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8">
                    {step > 0 && (
                      <button onClick={() => setStep(s => s - 1)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-dark dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
                      >
                        <FiChevronLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                    {step < STEP_LABELS.length - 1 ? (
                      <button
                        onClick={() => setStep(s => s + 1)}
                        disabled={!canNext()}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                          canNext()
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                            : 'bg-slate-100 dark:bg-slate-700 text-muted cursor-not-allowed'
                        }`}
                      >
                        Continue <FiChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                      >
                        {submitting ? (
                          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                        ) : (
                          <><FiHeart className="w-4 h-4" /> Submit Application</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  )
}
