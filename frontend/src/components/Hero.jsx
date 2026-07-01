'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion'
import { FiHeart, FiUsers, FiChevronDown } from 'react-icons/fi'

const stats = [
  { icon: FiHeart, value: 1000, suffix: '+', label: 'Meals Served' },
  { icon: FiUsers, value: 25, suffix: '+', label: 'Volunteers' },
  { icon: FiHeart, value: 3, suffix: '+', label: 'Community Events' },
  { icon: FiHeart, value: 3, suffix: '', label: 'Welfare Institutions' },
]

// ── Typewriter words ──────────────────────────────────────────────
const headlineWords = ['Bringing', 'Hope', 'To', 'Those', 'In', 'Need']
const highlightWord = 'Hope'

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const sentenceVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } },
}

// ── Animated Counter ──────────────────────────────────────────────
function AnimatedCounter({ value, suffix, shouldCount }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldCount) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, shouldCount])

  return (
    <span className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl">
      {count}{suffix}
    </span>
  )
}

// ── Magnetic Button ───────────────────────────────────────────────
function MagneticButton({ href, className, children }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 18 })
  const springY = useSpring(y, { stiffness: 150, damping: 18 })

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.35)
    y.set((e.clientY - cy) * 0.35)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  )
}

// ── Main Component ────────────────────────────────────────────────
export default function Hero() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' })

  // Parallax
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, 180])

  // Particles
  const particles = useMemo(() => (
    Array.from({ length: 15 }, () => ({
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 4}s`,
      size: 3 + Math.random() * 3,
    }))
  ), [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 hero-bg scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/50 via-dark/40 to-dark/70" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{
                left: p.left,
                bottom: '-20px',
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: `particleFloat ${p.duration} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Join Our Mission Today
            </span>
          </motion.div>

          {/* Typewriter Headline */}
          <motion.h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`inline-block mr-[0.25em] ${
                  word === highlightWord
                    ? 'bg-gradient-to-r from-secondary via-amber-400 to-secondary bg-clip-text text-transparent'
                    : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            At Rah-E-Haq, we believe every individual deserves dignity, care, and opportunity.
            Through compassion in action, we transform lives and build stronger communities.
          </motion.p>

          {/* CTA Buttons — Magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <MagneticButton href="/donate" className="btn-cta">
              <span className="flex items-center gap-3">
                <FiHeart className="w-5 h-5 animate-pulse" />
                Donate Now
              </span>
            </MagneticButton>
            <MagneticButton href="/volunteer" className="btn-secondary">
              <span className="flex items-center gap-3">
                <FiUsers className="w-5 h-5" />
                Become a Volunteer
              </span>
            </MagneticButton>
          </motion.div>

          {/* Stats — useInView counter */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0 + index * 0.15 }}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-3" />
                <AnimatedCounter value={stat.value} suffix={stat.suffix} shouldCount={statsInView} />
                <p className="text-white/70 text-sm mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/60 cursor-pointer"
          onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <FiChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F8FAFC" />
        </svg>
      </div>

      <style>{`
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 0.6; transform: translateY(-100vh) scale(1); }
          90% { opacity: 0.6; transform: translateY(-90vh) scale(1); }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
