'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiShield, FiDollarSign, FiClock, FiActivity, FiCheck, FiTrendingUp } from 'react-icons/fi'

const partners = [
  { name: 'Global Aid', logo: 'GA' },
  { name: 'Hope Foundation', logo: 'HF' },
  { name: 'Care Network', logo: 'CN' },
  { name: 'Help Alliance', logo: 'HA' },
  { name: 'Heart Foundation', logo: 'HRT' },
  { name: 'Mercy Corps', logo: 'MC' },
]

function AnimatedMetric({ value, suffix, label, icon: Icon, delay }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''))
      const increment = numericValue / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) { setCount(numericValue); clearInterval(timer) }
        else { setCount(Math.floor(current)) }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <p className="font-display font-bold text-3xl text-dark mb-1">
        {typeof count === 'number' && value.includes('%') ? `${count}%` : `${count}${suffix}`}
      </p>
      <p className="text-muted text-sm font-medium">{label}</p>
    </motion.div>
  )
}

export default function Trust() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <FiShield className="w-4 h-4" />
            Our Credibility
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark mb-6">
            Transparency & <span className="gradient-text">Accountability</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            We believe in complete transparency. Here's how your donations are making a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <AnimatedMetric value="92" suffix="%" label="Funds to Programs" icon={FiTrendingUp} delay={0.1} />
          <AnimatedMetric value="8" suffix="%" label="Administrative" icon={FiActivity} delay={0.2} />
          <AnimatedMetric value="100" suffix="%" label="Transparency" icon={FiShield} delay={0.3} />
          <AnimatedMetric value="4.9" suffix="/5" label="Donor Rating" icon={FiCheck} delay={0.4} />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-dark">How Your Donation Helps</h3>
                <p className="text-muted text-sm">Every rupee counts</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { amount: 'Rs. 500', impact: 'Provides a meal for a family of 4', color: 'bg-amber-500' },
                { amount: 'Rs. 2,000', impact: 'Monthly food ration for one family', color: 'bg-orange-500' },
                { amount: 'Rs. 5,000', impact: 'School supplies for one child', color: 'bg-emerald-500' },
                { amount: 'Rs. 10,000', impact: 'Medical supplies for community camp', color: 'bg-blue-500' },
                { amount: 'Rs. 25,000', impact: 'Sponsor education for one child/month', color: 'bg-purple-500' },
              ].map((item, i) => (
                <motion.div key={item.amount} initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-dark">{item.amount}</p>
                    <p className="text-muted text-sm">{item.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <FiClock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-dark">Recent Activities</h3>
                <p className="text-muted text-sm">Stay updated with our work</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary" />
              <div className="space-y-6">
                {[
                  { date: 'June 2024', title: 'Ramadan Food Drive', description: 'Distributed 500 food packages', impact: '500 families' },
                  { date: 'May 2024', title: 'School Supply Distribution', description: 'Provided materials to 200 students', impact: '200 students' },
                  { date: 'April 2024', title: 'Community Health Camp', description: 'Free medical checkups', impact: '300 patients' },
                  { date: 'March 2024', title: 'Eid Gift Program', description: 'Gifts for underprivileged children', impact: '150 children' },
                ].map((activity, i) => (
                  <motion.div key={activity.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }} className="relative pl-8">
                    <div className="absolute left-0 top-2 w-5 h-5 rounded-full bg-white border-4 border-primary shadow-lg" />
                    <div className="bg-slate-50 rounded-xl p-4 hover:bg-primary/5 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{activity.date}</span>
                        <span className="text-xs font-semibold text-accent">{activity.impact}</span>
                      </div>
                      <h4 className="font-semibold text-dark mb-1">{activity.title}</h4>
                      <p className="text-muted text-sm">{activity.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }}
          className="mt-16 text-center">
          <p className="text-muted text-sm font-medium mb-6 uppercase tracking-wider">Trusted Partners & Collaborators</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((partner, i) => (
              <motion.div key={partner.name} initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }} whileHover={{ scale: 1.1 }}
                className="w-24 h-16 bg-white rounded-xl shadow-md flex items-center justify-center partner-logo cursor-pointer">
                <span className="font-display font-bold text-lg text-slate-400">{partner.logo}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
