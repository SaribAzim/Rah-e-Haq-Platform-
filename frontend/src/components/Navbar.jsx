'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiHeart } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import { useLanguage } from '@/lib/LanguageContext'

const navLinks = [
  { name: 'Home', href: '/', targetId: 'home', external: true },
  { name: 'About', href: '/#about', targetId: 'about', external: false },
  { name: 'Impact', href: '/#impact', targetId: 'impact', external: false },
  { name: 'Zakat', href: '/zakat', targetId: 'zakat', external: true },
  { name: 'Volunteer', href: '/volunteer', targetId: 'volunteer', external: true },
  { name: 'Contact', href: '/#contact', targetId: 'contact', external: false },
]

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      if (window.scrollY < 100) setActiveSection('home')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -70% 0px' }
    )

    navLinks.forEach(({ targetId }) => {
      const el = document.getElementById(targetId)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-lg shadow-slate-900/5 dark:shadow-black/20 border-b border-transparent dark:border-slate-800'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="/logo.png"
              alt="Rah-E-Haq Logo"
              className="w-12 h-12 object-cover rounded-2xl"
            />
            <div className="flex flex-col">
              <span className={`font-display font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-dark dark:text-white' : 'text-white'
                }`}>
                Rah-E-Haq
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${isScrolled ? 'text-muted dark:text-slate-400' : 'text-white/80'
                }`}>
                Building Hope Together
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 relative">
            {navLinks.map((link) => {
              const isActive = link.external
                ? pathname === link.href
                : activeSection === link.targetId || (activeSection === 'home' && link.name === 'Home')
              return link.external ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link font-medium relative px-2 py-1 transition-colors duration-300 ${isActive
                      ? (isScrolled ? 'text-primary dark:text-primary' : 'text-white')
                      : (isScrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary' : 'text-white/90 hover:text-white')
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute bottom-[-4px] left-0 right-0 h-0.5 rounded-full ${isScrolled ? 'bg-primary' : 'bg-white'
                        }`}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ) : (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`nav-link font-medium relative px-2 py-1 transition-colors duration-300 ${isActive
                      ? (isScrolled ? 'text-primary dark:text-primary' : 'text-white')
                      : (isScrolled ? 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary' : 'text-white/90 hover:text-white')
                    }`}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className={`absolute bottom-[-4px] left-0 right-0 h-0.5 rounded-full ${isScrolled ? 'bg-primary' : 'bg-white'
                        }`}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              whileTap={{ scale: 0.95 }}
              className={`hidden sm:flex items-center px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${isScrolled
                  ? 'border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30'
                  : 'border-white/30 text-white/90 hover:bg-white/10'
                }`}
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </motion.button>
            <ThemeToggle />

            {/* Donate Button (Desktop) */}
            <div className="hidden lg:flex items-center">
              <motion.a
                href="/login"
                className="relative btn-primary ripple group flex items-center justify-center !px-5 !py-2.5 !text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FiHeart className="w-4 h-4 animate-pulse" />
                  Admin Login
                </span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-3 rounded-xl transition-colors duration-300 ${isScrolled ? 'bg-slate-100 dark:bg-slate-800 text-dark dark:text-white' : 'bg-white/10 text-white'
                }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/50 dark:border-slate-800"
          >
            <div className="px-4 py-6 space-y-4">
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-2 w-full py-3 px-4 rounded-xl font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
              >
                <span className="text-lg">🌐</span>
                {language === 'en' ? 'Switch to اردو' : 'Switch to English'}
              </motion.button>
              {navLinks.map((link, index) => {
                const isActive = link.external
                  ? pathname === link.href
                  : activeSection === link.targetId || (activeSection === 'home' && link.name === 'Home')
                const cls = `block py-3 px-4 rounded-xl font-medium transition-colors ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/30 text-primary dark:text-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`
                return link.external ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cls}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cls}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                )
              })}
              <motion.a
                href="/login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full mt-4 btn-primary ripple flex items-center justify-center !py-3 !px-6 !text-base"
              >
                <span className="flex items-center gap-2">
                  <FiHeart className="w-4 h-4" />
                  Admin Login
                </span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
