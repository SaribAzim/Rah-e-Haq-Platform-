'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiMail, FiDollarSign, FiHeart, FiTarget, FiCalendar, FiTrendingUp } from 'react-icons/fi'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { getAnalyticsOverview, getDonationsTimeline } from '@/lib/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = Cookies.get('admin_token')
      if (!token) return
      
      try {
        const [overviewRes, timelineRes] = await Promise.all([
          getAnalyticsOverview(token),
          getDonationsTimeline(token)
        ])
        
        setStats(overviewRes)
        setTimeline(timelineRes.timeline || [])
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const kpiCards = stats ? [
    { title: 'Total Raised', value: `PKR ${stats.total_raised.toLocaleString()}`, icon: FiDollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Donations', value: stats.completed_donations, icon: FiHeart, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { title: 'Approved Volunteers', value: stats.approved_volunteers, icon: FiUsers, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { title: 'Unread Messages', value: stats.unread_messages, icon: FiMail, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  ] : []

  // Sample data for pie chart since we don't have method breakdown in the backend yet
  const methodData = [
    { name: 'Bank Transfer', value: 45 },
    { name: 'Cash', value: 30 },
    { name: 'Credit Card', value: 25 },
  ]
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-dark">Analytics Dashboard</h1>
        <p className="text-muted">Welcome back! Here's what's happening today.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <FiTrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-display font-bold text-2xl text-dark mb-1 truncate">{stat.value}</h3>
            <p className="text-muted text-sm font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h2 className="font-display font-bold text-lg text-dark mb-6">Donations Timeline (Last 30 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(v) => `Rs.${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Secondary Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="font-display font-bold text-lg text-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admin/campaigns" className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                <FiTarget className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Campaigns</span>
              </Link>
              <Link href="/admin/events" className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                <FiCalendar className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Events</span>
              </Link>
              <Link href="/admin/volunteers" className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
                <FiUsers className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Volunteers</span>
              </Link>
              <Link href="/admin/donations" className="flex flex-col items-center justify-center p-4 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                <FiDollarSign className="w-6 h-6 mb-2" />
                <span className="text-xs font-semibold">Donations</span>
              </Link>
            </div>
          </motion.div>

          {/* Mini Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <h2 className="font-display font-bold text-sm text-dark mb-4 text-center">Donation Methods</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {methodData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
