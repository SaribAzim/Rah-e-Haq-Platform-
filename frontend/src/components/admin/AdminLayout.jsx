'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { FiMenu, FiLoader } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('admin_token')
    if (!token) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-[280px] min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FiMenu className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="font-display font-semibold text-slate-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
