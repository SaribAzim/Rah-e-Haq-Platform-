'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiBell, FiDollarSign, FiUsers, FiMessageSquare, FiX } from 'react-icons/fi'
import Cookies from 'js-cookie'
import { getNotifications, getUnreadCount, markAllNotificationsRead } from '@/lib/api'

const TYPE_ICONS = {
  donation: { icon: FiDollarSign, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  volunteer: { icon: FiUsers, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  contact: { icon: FiMessageSquare, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)

  const fetchNotifs = async () => {
    const token = Cookies.get('admin_token')
    if (!token) return
    try {
      const data = await getNotifications(token)
      setNotifications(Array.isArray(data) ? data : [])
      setUnreadCount(data.filter(n => !n.is_read).length)
    } catch {}
  }

  useEffect(() => {
    fetchNotifs()
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = async () => {
    setOpen(o => !o)
    if (!open && unreadCount > 0) {
      const token = Cookies.get('admin_token')
      if (token) {
        try {
          await markAllNotificationsRead(token)
          setUnreadCount(0)
          setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        } catch {}
      }
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        aria-label="Notifications"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}
        >
          <FiBell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </motion.div>

        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-dark dark:text-white text-sm">Notifications</h3>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center">
                <FiX className="w-3 h-3 text-muted" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <FiBell className="w-8 h-8 text-muted mx-auto mb-2 opacity-30" />
                  <p className="text-muted text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 15).map((notif) => {
                  const typeInfo = TYPE_ICONS[notif.type] || TYPE_ICONS.contact
                  const Icon = typeInfo.icon
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.bg}`}>
                        <Icon className={`w-4 h-4 ${typeInfo.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark dark:text-white line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-muted mt-1">{timeAgo(notif.created_at)}</p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
