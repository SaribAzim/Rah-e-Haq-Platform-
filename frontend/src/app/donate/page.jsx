'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHeart, FiCopy, FiCheck, FiUpload, FiX, FiUser,
  FiMail, FiDollarSign, FiMessageSquare, FiCheckCircle,
  FiSmartphone, FiCreditCard, FiAlertCircle
} from 'react-icons/fi'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const BANK_DETAILS = {
  bank: {
    label: 'Bank Transfer',
    icon: FiCreditCard,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    accentColor: 'text-blue-600 dark:text-blue-400',
    fields: [
      { label: 'Account Number (IBAN)', value: 'PK51BAHL0049009501218501', copyable: true },
      { label: 'Account Title', value: 'Syed Shehroz Amin', copyable: true },
      { label: 'Bank Name', value: 'Bank Al Habib Limited', copyable: false },
    ],
  },
  mobile: {
    label: 'EasyPaisa / NayaPay',
    icon: FiSmartphone,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    fields: [
      { label: 'Mobile Number', value: '03369587167', copyable: true },
      { label: 'Account Name', value: 'Reyan Babar', copyable: true },
      { label: 'Accepted Via', value: 'EasyPaisa / NayaPay', copyable: false },
    ],
  },
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="ml-2 p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors flex-shrink-0"
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCheck className="w-3.5 h-3.5 text-emerald-500" /></motion.span>
          : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><FiCopy className="w-3.5 h-3.5 text-slate-400" /></motion.span>
        }
      </AnimatePresence>
    </button>
  )
}

function BankCard({ type, details }) {
  const Icon = details.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${details.borderColor} ${details.bgColor} p-5 mb-4`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${details.color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className={`font-bold text-sm ${details.accentColor}`}>{details.label}</h3>
      </div>
      <div className="space-y-3">
        {details.fields.map(field => (
          <div key={field.label}>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">{field.label}</p>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-slate-800 dark:text-white text-sm font-mono tracking-wide">
                {field.value}
              </p>
              {field.copyable && <CopyButton value={field.value} />}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function DonatePage() {
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    payment_method: 'Bank Transfer',
    donor_message: '',
  })
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotPreview, setScreenshotPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }))

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP, etc.)')
      return
    }
    setError(null)
    setScreenshot(file)
    setScreenshotPreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.donor_name || !form.donor_email || !form.amount) {
      setError('Please fill in all required fields.')
      return
    }
    if (!screenshot) {
      setError('Please upload a screenshot of your payment.')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('donor_name', form.donor_name)
      fd.append('donor_email', form.donor_email)
      fd.append('amount', parseFloat(form.amount.replace(/,/g, '')))
      fd.append('payment_method', form.payment_method)
      if (form.donor_message) fd.append('donor_message', form.donor_message)
      fd.append('screenshot', screenshot)

      const res = await fetch(`${API_BASE}/api/donations/submit`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error('Submission failed. Please try again.')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-400/30"
            >
              <FiCheckCircle className="w-14 h-14 text-white" />
            </motion.div>
            <h1 className="font-bold text-4xl text-slate-900 dark:text-white mb-4">JazakAllah Khair! 🤲</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
              Your donation of <strong className="text-emerald-600">PKR {parseFloat(form.amount.replace(/,/g, '')).toLocaleString()}</strong> has been received.
            </p>
            <p className="text-slate-400 text-sm mb-8">
              Our team will verify your payment and confirm it shortly. May Allah accept your generous contribution.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                Back to Home
              </a>
              <a href="/volunteer" className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Volunteer Too
              </a>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[44vh] flex items-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-4 relative text-center py-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium mb-6"
          >
            <FiHeart className="w-4 h-4 animate-pulse" /> Make a Difference Today
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-bold text-5xl md:text-6xl text-white mb-4"
          >
            Donate to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Rah-E-Haq</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg max-w-xl mx-auto"
          >
            Your generosity fuels our mission — helping communities across Pakistan with food, education, and hope.
          </motion.p>
        </div>
      </section>

      {/* Steps Banner */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {[
              { step: '1', label: 'Transfer Amount', desc: 'Send to bank or mobile wallet' },
              { step: '2', label: 'Take Screenshot', desc: 'Capture payment confirmation' },
              { step: '3', label: 'Fill & Submit', desc: 'Complete the form below' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-center gap-3 sm:gap-0">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.label}</p>
                    <p className="text-slate-400 text-xs">{s.desc}</p>
                  </div>
                </div>
                {i < 2 && <div className="hidden sm:block w-12 h-0.5 bg-slate-200 dark:bg-slate-600 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 items-start">

            {/* Left: Bank Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-24">
                <h2 className="font-bold text-xl text-slate-900 dark:text-white mb-2">Payment Details</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Transfer your donation to any of the accounts below, then fill out the form.
                </p>

                <BankCard type="bank" details={BANK_DETAILS.bank} />
                <BankCard type="mobile" details={BANK_DETAILS.mobile} />

                {/* Trust badge */}
                <div className="mt-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-0.5">100% Goes to Cause</p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-500/80">
                      Every rupee is used directly for community welfare. No admin fees deducted.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Donation Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8">
                <h2 className="font-bold text-2xl text-slate-900 dark:text-white mb-1">Confirm Your Donation</h2>
                <p className="text-slate-400 text-sm mb-8">Fill in your details and upload your payment screenshot.</p>

                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        value={form.donor_name}
                        onChange={e => update('donor_name', e.target.value)}
                        placeholder="e.g. Ahmed Khan"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="email"
                        value={form.donor_email}
                        onChange={e => update('donor_email', e.target.value)}
                        placeholder="ahmed@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Amount + Method */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Donation Amount (PKR) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">Rs.</span>
                        <input
                          type="text"
                          value={form.amount}
                          onChange={e => {
                            const raw = e.target.value.replace(/[^0-9]/g, '')
                            update('amount', raw ? parseInt(raw).toLocaleString() : '')
                          }}
                          placeholder="1,000"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={form.payment_method}
                        onChange={e => update('payment_method', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
                      >
                        <option>Bank Transfer</option>
                        <option>EasyPaisa</option>
                        <option>NayaPay</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick amount pills */}
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Quick amounts</p>
                    <div className="flex flex-wrap gap-2">
                      {['500', '1,000', '2,000', '5,000', '10,000'].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => update('amount', amt)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                            form.amount === amt
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-emerald-300'
                          }`}
                        >
                          Rs. {amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Message <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-4 top-4 text-slate-400 w-4 h-4" />
                      <textarea
                        value={form.donor_message}
                        onChange={e => update('donor_message', e.target.value)}
                        placeholder="Share a message or dua..."
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Payment Screenshot <span className="text-red-400">*</span>
                    </label>

                    {screenshotPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-100 dark:bg-slate-700">
                        <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-56 object-contain" />
                        <button
                          type="button"
                          onClick={() => { setScreenshot(null); setScreenshotPreview(null) }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                          <p className="text-white text-xs font-medium flex items-center gap-1.5">
                            <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Screenshot uploaded — {screenshot?.name}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragging(true) }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                          dragging
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                            : 'border-slate-200 dark:border-slate-600 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleFile(e.target.files[0])}
                        />
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
                          dragging ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-slate-100 dark:bg-slate-700'
                        }`}>
                          <FiUpload className={`w-6 h-6 ${dragging ? 'text-emerald-500' : 'text-slate-400'}`} />
                        </div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {dragging ? 'Drop your screenshot here' : 'Upload payment screenshot'}
                        </p>
                        <p className="text-slate-400 text-sm">Drag & drop or click to browse — JPG, PNG, WebP</p>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                    >
                      <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiHeart className="w-5 h-5" />
                        Submit Donation
                      </>
                    )}
                  </button>

                  <p className="text-center text-slate-400 text-xs">
                    By submitting, you confirm that the payment has been made. Our team will verify within 24 hours.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
