'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-10 h-10" /> // Placeholder

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 overflow-hidden"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <FiSun className="w-5 h-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <FiMoon className="w-5 h-5" />
      </motion.div>
    </button>
  )
}
