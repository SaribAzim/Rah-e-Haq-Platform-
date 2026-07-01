'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiHeart, FiUsers, FiBook, FiHome } from 'react-icons/fi'

const impactCards = [
  {
    icon: FiHeart,
    title: 'Food Distribution',
    description: 'Providing nutritious meals and food packages to families in need, ensuring no one goes hungry in our community.',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    stats: '500+ families served',
    gradientBg: 'conic-gradient(from 0deg, transparent, #fbbf24, #f97316, transparent)',
  },
  {
    icon: FiHome,
    title: 'Community Welfare',
    description: 'Building stronger communities through essential services, healthcare support, and emergency relief programs.',
    color: 'from-primary to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-primary',
    stats: '12 welfare drives',
    gradientBg: 'conic-gradient(from 0deg, transparent, #0f766e, #059669, transparent)',
  },
  {
    icon: FiUsers,
    title: 'Volunteer Network',
    description: 'Empowering passionate individuals to make a difference. Our volunteers are the heart of our organization.',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    stats: '25+ active volunteers',
    gradientBg: 'conic-gradient(from 0deg, transparent, #60a5fa, #6366f1, transparent)',
  },
  {
    icon: FiBook,
    title: 'Educational Support',
    description: 'Sponsoring education for underprivileged children, providing supplies, mentorship, and learning resources.',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-500',
    stats: '100+ students supported',
    gradientBg: 'conic-gradient(from 0deg, transparent, #c084fc, #ec4899, transparent)',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Impact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="impact" className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <FiHeart className="w-4 h-4" />
            Our Impact
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark dark:text-white mb-6">
            Making A Real{' '}
            <span className="gradient-text">Difference</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Through dedication and compassion, we're creating lasting change in our communities.
            Every program we run is designed to uplift, empower, and transform lives.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {impactCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="relative group rounded-3xl p-[2px] shadow-lg card-hover cursor-pointer"
            >
              {/* Rotating Gradient Border on Hover */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite]"
                style={{ background: card.gradientBg }}
              />
              
              {/* Card Content Layer */}
              <div className={`relative h-full ${card.bgColor} dark:bg-slate-800 rounded-[22px] p-8 transition-colors duration-300`}>
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <card.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="font-display font-bold text-xl text-dark dark:text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-muted leading-relaxed mb-4">
                  {card.description}
                </p>

                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${card.bgColor} dark:bg-slate-700/50 ${card.iconColor} dark:text-white transition-colors duration-300`}>
                  {card.stats}
                </span>

                <div className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

