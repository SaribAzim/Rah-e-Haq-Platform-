'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiX, FiMenu, FiHome, FiUsers, FiMessageSquare, FiMail, FiDollarSign, FiStar, FiLogOut, FiChevronDown } from 'react-icons/fi'
import Cookies from 'js-cookie'
import Link from 'next/link'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Contacts', href: '/admin/contacts', icon: FiMail },
  { name: 'Volunteers', href: '/admin/volunteers', icon: FiUsers },
  { name: 'Donations', href: '/admin/donations', icon: FiDollarSign },
  { name: 'Stories', href: '/admin/stories', icon: FiStar },
  { name: 'Subscribers', href: '/admin/subscribers', icon: FiMessageSquare },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    Cookies.remove('admin_token')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — CSS-based translate so lg:translate-x-0 works correctly */}
      <aside
        className={`fixed left-0 top-0 h-full w-[280px] bg-dark z-50 lg:z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white">Rah-E-Haq</span>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
