'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi'

const testimonials = [
  {
    id: 1,
    name: 'Amina Khan',
    role: 'Beneficiary',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face',
    story: 'Rah-E-Haq changed my life. Through their food distribution program, my family no longer worries about where our next meal will come from. The volunteers treated us with such dignity and respect.',
    rating: 5,
    location: 'Karachi, Pakistan',
  },
  {
    id: 2,
    name: 'Muhammad Ali',
    role: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    story: "Volunteering with Rah-E-Haq has been the most rewarding experience of my life. Seeing the joy on people's faces when we deliver aid is priceless. This organization truly makes a difference.",
    rating: 5,
    location: 'Lahore, Pakistan',
  },
  {
    id: 3,
    name: 'Fatima Bibi',
    role: 'Parent',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    story: "Thanks to their educational support program, my children now have textbooks, uniforms, and the encouragement they need to succeed in school. You're giving them a future.",
    rating: 5,
    location: 'Islamabad, Pakistan',
  },
]

export default function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  const current = testimonials[currentIndex]

  return (
    <section id="stories" className="relative py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-4">
            <FiMessageSquare className="w-4 h-4" />
            Success Stories
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark mb-6">
            Voices That{' '}
            <span className="gradient-text">Inspire Us</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Real stories from real people whose lives have been transformed through your generosity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-6 right-6 text-primary/10">
              <FiMessageSquare className="w-24 h-24" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-secondary" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-3 gap-8 items-center"
              >
                <div className="flex flex-col items-center text-center md:col-span-1">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                  <h4 className="font-display font-bold text-xl text-dark mt-6">{current.name}</h4>
                  <p className="text-primary font-medium">{current.role}</p>
                  <p className="text-muted text-sm mt-1">{current.location}</p>
                </div>

                <div className="md:col-span-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                    {[...Array(current.rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 text-lg md:text-xl leading-relaxed italic">
                    "{current.story}"
                  </blockquote>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i) }}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'bg-primary w-8' : 'bg-slate-300 w-3 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.button onClick={handlePrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-primary text-slate-600 hover:text-white flex items-center justify-center transition-colors">
                  <FiChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-primary text-slate-600 hover:text-white flex items-center justify-center transition-colors">
                  <FiChevronRight className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
