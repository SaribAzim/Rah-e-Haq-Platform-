'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronRight, FiChevronLeft, FiShare2, FiCheck, FiAlertCircle, FiRefreshCw, FiInfo } from 'react-icons/fi'
import { useLanguage } from '@/lib/LanguageContext'

const NISAB_GOLD_TOLAS = 7.5
const GOLD_PKR_PER_TOLA = 285000
const SILVER_PKR_PER_TOLA = 3200
const ZAKAT_RATE = 0.025

const steps = [
  {
    key: 'gold', label: 'Gold Holdings', unit: 'Tolas', icon: '🥇',
    desc: 'Enter your total gold in tolas (1 tola = 11.66g)',
    hint: 'Include all gold jewellery, coins & bars held for savings',
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
  },
  {
    key: 'silver', label: 'Silver Holdings', unit: 'Tolas', icon: '🥈',
    desc: 'Enter your total silver in tolas',
    hint: 'Silver coins, utensils, and bars used for savings',
    color: 'from-slate-400 to-slate-500',
    bg: 'bg-slate-400/10 border-slate-400/20',
  },
  {
    key: 'cash', label: 'Cash & Bank Balance', unit: 'PKR', icon: '💵',
    desc: 'Total liquid money in PKR',
    hint: 'Include current accounts, savings accounts, cash at home',
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    key: 'business', label: 'Business & Investments', unit: 'PKR', icon: '📈',
    desc: 'Value of business stock, receivables, shares',
    hint: 'Do not include fixed assets like machinery or property',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'deductions', label: 'Debts & Deductions', unit: 'PKR', icon: '📋',
    desc: 'Immediate liabilities and debts payable now',
    hint: 'Only include short-term debts due within the year',
    color: 'from-red-500 to-rose-500',
    bg: 'bg-red-500/10 border-red-500/20',
  },
]

// Format number with commas
function formatNum(n) {
  if (!n && n !== 0) return ''
  return n.toLocaleString('en-PK', { maximumFractionDigits: 0 })
}

// Smart number input — empty string when blank, no leading zeros
function SmartInput({ value, onChange, unit, color }) {
  const [raw, setRaw] = useState(value === 0 ? '' : String(value))

  // Sync if parent resets
  useEffect(() => {
    if (value === 0) setRaw('')
  }, [value])

  const handleChange = (e) => {
    const v = e.target.value
    // Allow empty, digits, and one decimal point
    if (v === '' || /^\d*\.?\d*$/.test(v)) {
      setRaw(v)
      onChange(v === '' ? 0 : parseFloat(v) || 0)
    }
  }

  return (
    <div className="relative group">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-10 group-focus-within:opacity-20 transition-opacity`} />
      <input
        type="text"
        inputMode="decimal"
        value={raw}
        onChange={handleChange}
        placeholder="0"
        className="relative w-full px-6 py-5 text-3xl font-bold bg-white/5 border border-white/10 group-focus-within:border-white/30 rounded-2xl focus:outline-none text-white transition-all text-center tracking-wide placeholder-white/20"
      />
      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/40 pointer-events-none">
        {unit}
      </span>
    </div>
  )
}

// Animated counter
function AnimatedValue({ value, prefix = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="tabular-nums"
    >
      {prefix}{formatNum(Math.round(value))}
    </motion.span>
  )
}

export default function ZakatCalculator({ standalone = false }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({ gold: 0, silver: 0, cash: 0, business: 0, deductions: 0 })
  const [result, setResult] = useState(null)
  const [goldPrice, setGoldPrice] = useState(GOLD_PKR_PER_TOLA)
  const [copied, setCopied] = useState(false)
  const [livePreview, setLivePreview] = useState(null)

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(data => {
        if (data?.rates?.PKR) {
          const pkrPerUsd = data.rates.PKR
          const goldOzUsd = 2350
          const approxPkrPerTola = goldOzUsd * 0.375 * pkrPerUsd
          if (approxPkrPerTola > 0) setGoldPrice(Math.round(approxPkrPerTola))
        }
      })
      .catch(() => {})
  }, [])

  // Live preview calculation
  const computeZakat = useCallback((vals, gp) => {
    const goldValue = vals.gold * gp
    const silverValue = vals.silver * SILVER_PKR_PER_TOLA
    const totalAssets = goldValue + silverValue + vals.cash + vals.business
    const netAssets = Math.max(0, totalAssets - vals.deductions)
    const nisabValue = NISAB_GOLD_TOLAS * gp
    const zakatDue = netAssets >= nisabValue ? netAssets * ZAKAT_RATE : 0
    return { goldValue, silverValue, totalAssets, netAssets, nisabValue, zakatDue, aboveNisab: netAssets >= nisabValue }
  }, [])

  useEffect(() => {
    setLivePreview(computeZakat(values, goldPrice))
  }, [values, goldPrice, computeZakat])

  const calculate = () => {
    const r = computeZakat(values, goldPrice)
    setResult({
      ...r,
      breakdown: { goldValue: r.goldValue, silverValue: r.silverValue, cash: values.cash, business: values.business, deductions: values.deductions }
    })
    setStep(steps.length)
  }

  const handleShare = () => {
    const text = `I've calculated my Zakat: PKR ${formatNum(Math.round(result.zakatDue))} — via Rah-E-Haq Zakat Calculator 🌙 Join me in fulfilling this pillar of Islam!`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const reset = () => {
    setStep(0)
    setValues({ gold: 0, silver: 0, cash: 0, business: 0, deductions: 0 })
    setResult(null)
  }

  const currentStep = steps[step]
  const progress = step < steps.length ? (step / steps.length) * 100 : 100

  return (
    <section
      id="zakat"
      className={`${standalone ? 'min-h-screen' : ''} relative overflow-hidden bg-[#030f0a]`}
      style={{ paddingTop: standalone ? '5rem' : undefined, paddingBottom: standalone ? '4rem' : undefined }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-900/40 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-teal-900/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/50 rounded-full blur-[180px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-6 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Zakat Calculator 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display font-black text-5xl md:text-7xl text-white mb-5 leading-tight tracking-tight"
          >
            Calculate Your{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                Zakat
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.5 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A free, precise calculator to fulfil your annual Zakat obligation — based on current gold prices.
          </motion.p>

          {/* Gold price ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 mt-5 text-xs text-emerald-400/70 bg-emerald-500/5 border border-emerald-500/15 rounded-full px-4 py-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live gold price: ≈ PKR {goldPrice.toLocaleString()}/tola
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8 items-start">
          {/* Left — Steps panel */}
          <div className="lg:col-span-2 space-y-3">
            {steps.map((s, i) => {
              const val = values[s.key]
              const done = i < step || result
              const active = i === step && !result
              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  onClick={() => !result && setStep(i)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    active
                      ? 'bg-white/10 border-white/20 shadow-lg'
                      : done
                      ? 'bg-white/5 border-white/10 opacity-80'
                      : 'bg-white/[0.03] border-white/5 opacity-50'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    done ? 'bg-emerald-500/20' : active ? 'bg-white/10' : 'bg-white/5'
                  }`}>
                    {done && i < step ? <FiCheck className="w-5 h-5 text-emerald-400" /> : s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
                      {val > 0 && (
                        <span className="text-xs text-emerald-400 font-mono">{formatNum(val)} {s.unit}</span>
                      )}
                    </div>
                  </div>
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  )}
                </motion.div>
              )
            })}

            {/* Live preview card */}
            {livePreview && !result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/30 border border-emerald-500/20"
              >
                <p className="text-xs text-emerald-400/70 font-medium mb-3 uppercase tracking-wider">Live Estimate</p>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-1">
                  PKR <AnimatedValue value={livePreview.zakatDue} />
                </div>
                <div className={`text-xs mt-2 font-medium ${livePreview.aboveNisab ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {livePreview.aboveNisab ? '✓ Above Nisab — Zakat is due' : `Nisab: PKR ${formatNum(Math.round(livePreview.nisabValue))}`}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Input / Result panel */}
          <div className="lg:col-span-3">
            {/* Progress bar */}
            {!result && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Step {step + 1} of {steps.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            )}

            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key={`step-${step}`}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="p-8"
                  >
                    {/* Step header */}
                    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${currentStep.bg} mb-8`}>
                      <span className="text-2xl">{currentStep.icon}</span>
                      <div>
                        <p className="text-white font-bold text-sm">{currentStep.label}</p>
                        <p className="text-white/50 text-xs">{currentStep.desc}</p>
                      </div>
                    </div>

                    {/* Input */}
                    <SmartInput
                      key={currentStep.key}
                      value={values[currentStep.key]}
                      onChange={(val) => setValues(prev => ({ ...prev, [currentStep.key]: val }))}
                      unit={currentStep.unit}
                      color={currentStep.color}
                    />

                    {/* Hint */}
                    <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <FiInfo className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-white/40 leading-relaxed">{currentStep.hint}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8">
                      {step > 0 && (
                        <button
                          onClick={() => setStep(s => s - 1)}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium text-sm"
                        >
                          <FiChevronLeft className="w-4 h-4" /> Back
                        </button>
                      )}
                      {step < steps.length - 1 ? (
                        <button
                          onClick={() => setStep(s => s + 1)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r ${currentStep.color} text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all`}
                        >
                          Continue <FiChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={calculate}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
                        >
                          Calculate My Zakat ✦
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-8"
                  >
                    {result.aboveNisab ? (
                      <>
                        {/* Success */}
                        <div className="text-center mb-8">
                          <div className="relative inline-flex mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                              <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
                            </div>
                            <motion.div
                              className="absolute inset-0 rounded-full border-2 border-emerald-400/40"
                              animate={{ scale: [1, 1.4, 1.4], opacity: [1, 0, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <p className="text-slate-400 text-sm mb-2">Your Zakat Due</p>
                          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-1">
                            PKR {formatNum(Math.round(result.zakatDue))}
                          </div>
                          <p className="text-xs text-emerald-400/60 mt-2">
                            2.5% of PKR {formatNum(Math.round(result.netAssets))} net assets
                          </p>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 mb-6 space-y-3">
                          {[
                            { label: 'Gold Value', val: result.breakdown.goldValue, icon: '🥇' },
                            { label: 'Silver Value', val: result.breakdown.silverValue, icon: '🥈' },
                            { label: 'Cash & Bank', val: result.breakdown.cash, icon: '💵' },
                            { label: 'Business Assets', val: result.breakdown.business, icon: '📈' },
                            { label: 'Less: Debts', val: -result.breakdown.deductions, icon: '📋' },
                          ].filter(({ val }) => val !== 0).map(({ label, val, icon }) => (
                            <div key={label} className="flex items-center justify-between text-sm">
                              <span className="text-slate-400 flex items-center gap-2">
                                <span className="text-base">{icon}</span> {label}
                              </span>
                              <span className={`font-semibold font-mono ${val < 0 ? 'text-red-400' : 'text-white'}`}>
                                {val < 0 ? '-' : ''}PKR {formatNum(Math.abs(Math.round(val)))}
                              </span>
                            </div>
                          ))}
                          <div className="h-px bg-white/10 my-1" />
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Nisab Threshold</span>
                            <span className="text-emerald-400 font-semibold font-mono">PKR {formatNum(Math.round(result.nisabValue))}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span className="text-white">Net Zakatable Assets</span>
                            <span className="text-white font-mono">PKR {formatNum(Math.round(result.netAssets))}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/30"
                          >
                            {copied ? <FiCheck className="w-4 h-4" /> : <FiShare2 className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Share Pledge'}
                          </button>
                          <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                          >
                            <FiRefreshCw className="w-4 h-4" /> Recalculate
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
                          <FiAlertCircle className="w-10 h-10 text-amber-400" />
                        </div>
                        <h3 className="text-white font-bold text-2xl mb-3">Below Nisab Threshold</h3>
                        <p className="text-slate-400 mb-4 max-w-sm mx-auto">
                          Your net zakatable assets are below the Nisab. Zakat is not yet obligatory on you.
                        </p>
                        <p className="text-sm text-slate-500 mb-8 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                          Nisab threshold: <span className="text-amber-400 font-semibold">PKR {formatNum(Math.round(result.nisabValue))}</span><br />
                          Your net assets: <span className="text-white font-semibold">PKR {formatNum(Math.round(result.netAssets))}</span>
                        </p>
                        <button
                          onClick={reset}
                          className="flex items-center justify-center gap-2 mx-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:scale-[1.02] transition-all shadow-lg shadow-emerald-500/30"
                        >
                          <FiRefreshCw className="w-4 h-4" /> Recalculate
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-slate-600 mt-6 px-4">
              This calculator is for guidance only. Consult a qualified Islamic scholar for a ruling specific to your situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
