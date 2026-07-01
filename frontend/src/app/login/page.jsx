'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiHeart, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Invalid credentials')
      }

      const data = await response.json()
      Cookies.set('admin_token', data.access_token, { expires: 7 })

      // Force redirect
      window.location.href = '/admin'
    } catch (err) {
      setError(err.message || 'Login failed')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg">
              <FiHeart className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl text-slate-800">Rah-E-Haq</span>
              <p className="text-slate-500 text-xs">Admin Portal</p>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a href="/" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
              Back to Home
            </a>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <p className="text-white/80 text-sm text-center mb-2">Demo Credentials:</p>
          <div className="text-white/60 text-sm text-center">
            <span>Email: admin@rahehaq.org</span>
            <span className="mx-2">|</span>
            <span>Password: admin123</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
