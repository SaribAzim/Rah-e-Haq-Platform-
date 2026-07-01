'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiHeart, FiUsers, FiArrowRight } from 'react-icons/fi'

export default function VolunteerCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="volunteer" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-800 to-emerald-900">
        <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity }} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={isInView ? { scale: 1 } : {}} transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8">
            <FiHeart className="w-5 h-5 text-secondary animate-pulse" />
            <span className="font-semibold">Join Our Growing Family</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
            className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Your Hands Can{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-secondary">Change Lives</span>
              <motion.span className="absolute -bottom-2 left-0 right-0 h-4 bg-white/10 rounded-full blur-sm" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6 }} />
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Whether you can give your time, skills, or resources, there's a place for you in our mission.
            Together, we can bring hope to those who need it most.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[{ value: '500+', label: 'Volunteers' }, { value: '50K+', label: 'Hours Given' }, { value: '100+', label: 'Events' }, { value: '15', label: 'Cities' }].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }} className="text-center">
                <p className="font-display font-bold text-3xl md:text-4xl text-white">{stat.value}</p>
                <p className="text-white/60 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a href="#apply" className="group relative overflow-hidden bg-white text-primary font-bold px-10 py-5 rounded-full shadow-2xl transition-all hover:scale-105"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span className="relative z-10 flex items-center gap-3">
                <FiUsers className="w-5 h-5" />
                Become a Volunteer
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiArrowRight className="w-4 h-4" />
                </span>
              </span>
            </motion.a>
            <motion.a href="/donate" className="group relative overflow-hidden bg-secondary text-white font-bold px-10 py-5 rounded-full shadow-2xl shadow-secondary/30 transition-all hover:scale-105"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span className="relative z-10 flex items-center gap-3">
                <FiHeart className="w-5 h-5" />
                Donate Now
              </span>
            </motion.a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }}
            className="text-white/50 text-sm mt-8">
            Trusted by 10,000+ donors worldwide | 501(c)(3) Nonprofit Organization
          </motion.p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 55C840 50 960 40 1080 35C1200 30 1320 30 1380 30L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  )
}
