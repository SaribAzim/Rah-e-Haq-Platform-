'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCalendar, FiMapPin, FiUsers, FiChevronLeft, FiChevronRight, FiX, FiHeart } from 'react-icons/fi'
import { useLanguage } from '@/lib/LanguageContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

const SAMPLE_EVENTS = [
  { id: 1, title: 'Karachi Ration Drive', description: 'Monthly food ration distribution for 200 underprivileged families in Lyari.', event_date: '2024-12-15', location: 'Lyari Community Center', city: 'Karachi', max_volunteers: 30, current_volunteers: 12 },
  { id: 2, title: 'Lahore Tree Plantation', description: 'Plant 500 trees in partnership with local schools as part of our green initiative.', event_date: '2024-12-22', location: 'Model Town Park', city: 'Lahore', max_volunteers: 50, current_volunteers: 28 },
  { id: 3, title: 'Islamabad Medical Camp', description: 'Free medical checkup and medicine dispensary for elderly residents.', event_date: '2025-01-10', location: 'G-9 Sector Community Hall', city: 'Islamabad', max_volunteers: 20, current_volunteers: 8 },
  { id: 4, title: 'Peshawar Winter Relief', description: 'Distributing warm blankets and clothes to flood-affected families.', event_date: '2025-01-18', location: 'Hayatabad Township', city: 'Peshawar', max_volunteers: 40, current_volunteers: 15 },
]

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function EventsCalendar({ standalone = false }) {
  const { t } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [today] = useState(new Date())
  const [viewDate, setViewDate] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/events/upcoming`)
      .then(r => r.json())
      .then(data => setEvents(data.length > 0 ? data : SAMPLE_EVENTS))
      .catch(() => setEvents(SAMPLE_EVENTS))
      .finally(() => setLoading(false))
  }, [])

  const prevMonth = () => setViewDate(prev => {
    const d = new Date(prev.year, prev.month - 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const nextMonth = () => setViewDate(prev => {
    const d = new Date(prev.year, prev.month + 1)
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const getEventsForDay = (day) => {
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.event_date?.startsWith(dateStr))
  }

  const handleJoin = async (event) => {
    setJoining(true)
    try {
      await fetch(`${API_BASE}/api/events/${event.id}/join`, { method: 'PUT' })
      setJoined(event.id)
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, current_volunteers: e.current_volunteers + 1 } : e))
    } catch (err) {}
    setJoining(false)
    setTimeout(() => setJoined(null), 3000)
  }

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month)
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month)

  return (
    <section id="events" className={`${standalone ? 'pt-32' : 'py-24'} pb-24 bg-white dark:bg-slate-900`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6"
          >
            <FiCalendar className="w-4 h-4" />
            {t('events.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-dark dark:text-white mb-4"
          >
            {t('events.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('events.title2')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            {t('events.subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            {/* Month Nav */}
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all flex items-center justify-center">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="font-display font-bold text-lg text-white">
                {MONTH_NAMES[viewDate.month]} {viewDate.year}
              </h3>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all flex items-center justify-center">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-muted py-3">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-1" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDay(day)
                const isToday = today.getDate() === day && today.getMonth() === viewDate.month && today.getFullYear() === viewDate.year

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                    className={`aspect-square p-1 flex flex-col items-center justify-center rounded-xl m-0.5 transition-all relative ${
                      dayEvents.length > 0 ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30' : 'cursor-default'
                    } ${isToday ? 'bg-blue-600 text-white' : 'text-dark dark:text-white'}`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-white' : ''}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-emerald-500'}`} />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {events.length === 0 && !loading && (
              <p className="text-center text-muted py-8">{t('events.empty')}</p>
            )}
          </motion.div>

          {/* Upcoming events list */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="font-display font-semibold text-lg text-dark dark:text-white mb-4">Upcoming Events</h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 animate-pulse">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              events.slice(0, 4).map((event, i) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl px-2 py-1 text-xs font-bold flex-shrink-0 text-center min-w-[48px]">
                      <div>{new Date(event.event_date).toLocaleDateString('en', { month: 'short' })}</div>
                      <div className="text-lg leading-none">{new Date(event.event_date).getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-dark dark:text-white text-sm line-clamp-1">{event.title}</h4>
                      <div className="flex items-center gap-1 text-muted text-xs mt-1">
                        <FiMapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{event.city}</span>
                      </div>
                      {event.max_volunteers && (
                        <div className="flex items-center gap-1 text-muted text-xs mt-0.5">
                          <FiUsers className="w-3 h-3 flex-shrink-0" />
                          <span>{event.current_volunteers}/{event.max_volunteers} volunteers</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Event Detail Panel */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedEvent(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-2xl px-4 py-2 text-center">
                  <div className="text-xs font-bold">{new Date(selectedEvent.event_date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</div>
                  <div className="text-3xl font-display font-bold">{new Date(selectedEvent.event_date).getDate()}</div>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                  <FiX className="w-4 h-4 text-muted" />
                </button>
              </div>

              <h3 className="font-display font-bold text-2xl text-dark dark:text-white mb-3">{selectedEvent.title}</h3>
              <p className="text-muted mb-5">{selectedEvent.description}</p>

              <div className="space-y-3 mb-6">
                {selectedEvent.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-dark dark:text-white">{selectedEvent.location}, {selectedEvent.city}</span>
                  </div>
                )}
                {selectedEvent.max_volunteers && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <FiUsers className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-dark dark:text-white">
                      {selectedEvent.current_volunteers}/{selectedEvent.max_volunteers} volunteers registered
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar for volunteers */}
              {selectedEvent.max_volunteers && (
                <div className="mb-6">
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(100, (selectedEvent.current_volunteers / selectedEvent.max_volunteers) * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleJoin(selectedEvent)}
                  disabled={joining || joined === selectedEvent.id || (selectedEvent.max_volunteers && selectedEvent.current_volunteers >= selectedEvent.max_volunteers)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    joined === selectedEvent.id
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : selectedEvent.max_volunteers && selectedEvent.current_volunteers >= selectedEvent.max_volunteers
                      ? 'bg-slate-100 dark:bg-slate-700 text-muted cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  <FiHeart className="w-4 h-4" />
                  {joined === selectedEvent.id ? '✅ Joined!' : 
                   selectedEvent.max_volunteers && selectedEvent.current_volunteers >= selectedEvent.max_volunteers
                   ? t('events.full') : t('events.join')}
                </button>
                <a
                  href="/volunteer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                >
                  Full Application
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
