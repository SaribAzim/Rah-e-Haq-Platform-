'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiUsers } from 'react-icons/fi'
import Cookies from 'js-cookie'
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '@/lib/api'

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', city: '', max_volunteers: '' })

  const fetchEvents = async () => {
    setLoading(true)
    const token = Cookies.get('admin_token')
    if (token) {
      try {
        const data = await getAllEvents(token)
        setEvents(data)
      } catch (err) {}
    }
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const openModal = (evt = null) => {
    if (evt) {
      setEditing(evt.id)
      setForm({
        title: evt.title,
        description: evt.description,
        event_date: evt.event_date ? new Date(evt.event_date).toISOString().split('T')[0] : '',
        location: evt.location || '',
        city: evt.city || '',
        max_volunteers: evt.max_volunteers || '',
      })
    } else {
      setEditing(null)
      setForm({ title: '', description: '', event_date: '', location: '', city: '', max_volunteers: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = Cookies.get('admin_token')
    if (!token) return

    const payload = {
      ...form,
      max_volunteers: form.max_volunteers ? parseInt(form.max_volunteers) : null,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : null,
    }

    try {
      if (editing) {
        await updateEvent(editing, payload, token)
      } else {
        await createEvent(payload, token)
      }
      setIsModalOpen(false)
      fetchEvents()
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    const token = Cookies.get('admin_token')
    try {
      await deleteEvent(id, token)
      fetchEvents()
    } catch (err) {}
  }

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Event Calendar</h1>
          <p className="text-muted">Manage volunteer drives and public events.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted border-2 border-dashed border-slate-200 rounded-3xl">
            No events found. Create one above.
          </div>
        ) : (
          events.map(evt => {
            const isPast = new Date(evt.event_date) < new Date()
            const percent = evt.max_volunteers ? Math.round((evt.current_volunteers / evt.max_volunteers) * 100) : 0
            
            return (
              <div key={evt.id} className={`bg-white rounded-3xl p-6 border transition-all hover:shadow-lg ${isPast ? 'border-slate-200 opacity-60' : 'border-blue-100 shadow-sm'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1.5 rounded-xl text-center flex-shrink-0 ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'}`}>
                    <div className="text-[10px] font-bold uppercase">{new Date(evt.event_date).toLocaleString('en', { month: 'short' })}</div>
                    <div className="text-xl font-display font-bold leading-none">{new Date(evt.event_date).getDate()}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(evt)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(evt.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-dark mb-1 line-clamp-1">{evt.title}</h3>
                <p className="text-sm text-muted line-clamp-2 mb-4 h-10">{evt.description}</p>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FiMapPin className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{evt.location}, {evt.city}</span>
                  </div>
                  {evt.max_volunteers && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FiUsers className="w-4 h-4 text-slate-400" />
                      <span>{evt.current_volunteers} / {evt.max_volunteers} registered</span>
                    </div>
                  )}
                </div>

                {evt.max_volunteers && (
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, percent)}%` }} />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editing ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Date</label>
                <input required type="date" value={form.event_date} onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Volunteers</label>
                  <input type="number" min="1" value={form.max_volunteers} onChange={e => setForm(p => ({ ...p, max_volunteers: e.target.value }))} placeholder="Optional" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Specific Location</label>
                <input required value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Model Town Park" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">Save Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
