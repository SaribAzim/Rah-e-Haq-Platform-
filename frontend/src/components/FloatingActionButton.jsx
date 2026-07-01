'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="/donate"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold px-5 py-3.5 rounded-full shadow-2xl shadow-primary/40 cursor-pointer"
          aria-label="Donate Now"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiHeart className="w-5 h-5 fill-white" />
          </motion.span>
          <span className="text-sm">Donate</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
