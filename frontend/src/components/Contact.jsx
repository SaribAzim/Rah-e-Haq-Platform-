'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare } from 'react-icons/fi'
import { submitContact } from '@/lib/api'
import { useToast } from '@/lib/useToast'
import Toast from '@/components/Toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { toasts, addToast, removeToast } = useToast()

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await submitContact(formData)
      addToast({
        title: 'Message Sent!',
        message: "We've received your message and will get back to you shortly.",
        type: 'success'
      })
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError('Failed to send message. Please try again.')
      addToast({
        title: 'Error',
        message: 'Failed to send message. Please try again later.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="relative py-24 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <Toast toasts={toasts} removeToast={removeToast} />
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #0F766E 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <FiMessageSquare className="w-4 h-4" />
            Get In Touch
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark dark:text-white mb-6 transition-colors duration-300">
            We'd Love To{' '}
            <span className="gradient-text">Hear From You</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Have questions about our programs or want to get involved? Reach out and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 transition-colors duration-300 shadow-sm dark:shadow-none">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm transition-colors duration-300">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Ali Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="alik@gmail.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="font-display font-bold text-2xl text-dark dark:text-white transition-colors duration-300">Contact Information</h3>
            <p className="text-muted dark:text-slate-400 leading-relaxed transition-colors duration-300">
              We're here to help! Reach out to us through any of the following channels and we'll respond as soon as possible.
            </p>

            <div className="space-y-4">
              {[
                { icon: FiPhone, title: 'Phone Number', info: '+92 333 5863432, +92 336 9587167' },
                { icon: FiMail, title: 'Email Address', info: 'info@rahehaq.org' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl transition-colors duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark dark:text-white transition-colors duration-300">{item.title}</h4>
                    <p className="text-muted dark:text-slate-400 transition-colors duration-300">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Working Hours */}
            <div className="p-6 bg-gradient-to-br from-primary/10 dark:from-primary/20 to-accent/10 dark:to-accent/20 rounded-2xl transition-colors duration-300">
              <h4 className="font-display font-semibold text-dark dark:text-white mb-3 transition-colors duration-300">Working Hours</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted dark:text-slate-400 transition-colors duration-300">Monday - Friday</span>
                  <span className="text-dark dark:text-white font-medium transition-colors duration-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted dark:text-slate-400 transition-colors duration-300">Saturday</span>
                  <span className="text-dark dark:text-white font-medium transition-colors duration-300">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted dark:text-slate-400 transition-colors duration-300">Sunday</span>
                  <span className="text-red-500 dark:text-red-400 font-medium transition-colors duration-300">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
