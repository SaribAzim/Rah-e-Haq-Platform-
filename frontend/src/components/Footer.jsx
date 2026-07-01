'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiHeart, FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin, FiSend } from 'react-icons/fi'
import { subscribeNewsletter } from '@/lib/api'

const quickLinks = [
  { name: 'About Us', href: '#about' },
  { name: 'Our Mission', href: '#mission' },
  { name: 'Programs', href: '#impact' },
  { name: 'Volunteer', href: '/volunteer' },
  { name: 'Donate', href: '/donate' },
  { name: 'Contact', href: '#contact' },
]

const programs = [
  { name: 'Food Distribution', href: '#' },
  { name: 'Education Support', href: '#' },
  { name: 'Healthcare', href: '#' },
  { name: 'Emergency Relief', href: '#' },
  { name: 'Community Development', href: '#' },
]

const socialLinks = [
  { name: 'Facebook', icon: FiFacebook, href: '#' },
  { name: 'Twitter', icon: FiTwitter, href: '#' },
  { name: 'Instagram', icon: FiInstagram, href: '#' },
  { name: 'YouTube', icon: FiYoutube, href: '#' },
  { name: 'LinkedIn', icon: FiLinkedin, href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    try {
      await subscribeNewsletter(email)
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="relative bg-dark pt-20 pb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* About */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }} className="lg:col-span-2">
            <motion.a href="#" className="flex items-center gap-3 mb-6 group" whileHover={{ scale: 1.02 }}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <FiHeart className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white">Rah-E-Haq</span>
                <p className="text-white/60 text-sm">Building Hope Together</p>
              </div>
            </motion.a>
            <p className="text-white/70 leading-relaxed mb-6 max-w-md">
              Rah-E-Haq is dedicated to uplifting underprivileged communities through compassion,
              transparency, and sustainable development programs.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a key={social.name} href={social.href} initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}>
            <h4 className="font-display font-semibold text-white text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={link.name}>
                  <motion.a href={link.href} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.05 }} whileHover={{ x: 4 }}
                    className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}>
            <h4 className="font-display font-semibold text-white text-lg mb-6">Our Programs</h4>
            <ul className="space-y-3">
              {programs.map((program, i) => (
                <li key={program.name}>
                  <motion.a href={program.href} initial={{ opacity: 0, x: -10 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.05 }} whileHover={{ x: 4 }}
                    className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                    {program.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}>
            <h4 className="font-display font-semibold text-white text-lg mb-6">Get In Touch</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-white/70 text-sm">+92 333 5863432, +92 336 9587167</p>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-white/70 text-sm">info@rahehaq.org</p>
              </div>
            </div>
            <h5 className="font-semibold text-white mb-3">Newsletter</h5>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" className="newsletter-input pr-12" required />
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-secondary hover:bg-amber-600 flex items-center justify-center transition-colors disabled:opacity-50">
                  <FiSend className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              {isSubscribed && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-accent text-sm font-medium">
                  Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            {new Date().getFullYear()} Rah-E-Haq. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/50 text-sm hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 text-sm hover:text-secondary transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
