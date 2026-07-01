'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiTarget, FiEye, FiHeart, FiCheckCircle } from 'react-icons/fi'

const values = [
  'Compassion in every action',
  'Transparency in all operations',
  'Community-first approach',
  'Sustainable impact programs',
]

export default function Mission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0F766E 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=700&fit=crop"
                alt="Community members working together"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="absolute bottom-6 left-6 right-6 glass-dark rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Founded in</p>
                    <p className="text-white font-display font-bold text-2xl">2018</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Communities</p>
                    <p className="text-white font-display font-bold text-2xl">15+</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-white/60 text-sm">Lives Impacted</p>
                    <p className="text-white font-display font-bold text-2xl">5000+</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="absolute -top-6 -left-6 w-24 h-24 bg-secondary/20 rounded-2xl -z-10"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <FiTarget className="w-4 h-4" />
              Our Mission
            </span>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark leading-tight">
              Creating Lasting Change{' '}
              <span className="gradient-text">Through Compassion</span>
            </h2>

            <p className="text-muted text-lg leading-relaxed">
              Rah-E-Haq is dedicated to uplifting underprivileged communities through comprehensive
              welfare programs. We believe that true progress is measured not by wealth, but by
              how we treat those who have the least.
            </p>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiEye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-dark text-lg mb-2">Our Vision</h4>
                  <p className="text-muted leading-relaxed">
                    To build a society where every individual has access to basic necessities,
                    quality education, and opportunities to thrive.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-display font-semibold text-dark text-lg flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-secondary" />
                Our Core Values
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {values.map((value, i) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-primary/20"
                  >
                    <FiCheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
