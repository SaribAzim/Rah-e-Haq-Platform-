'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiPower } from 'react-icons/fi'
import Cookies from 'js-cookie'
import { getAllCampaigns, createCampaign, updateCampaign, deleteCampaign, toggleCampaign } from '@/lib/api'

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state
  const [form, setForm] = useState({ title: '', description: '', goal_amount: '', current_amount: 0, deadline: '' })

  const fetchCampaigns = async () => {
    setLoading(true)
    const token = Cookies.get('admin_token')
    if (token) {
      try {
        const data = await getAllCampaigns(token)
        setCampaigns(data)
      } catch (err) {}
    }
    setLoading(false)
  }

  useEffect(() => { fetchCampaigns() }, [])

  const openModal = (campaign = null) => {
    if (campaign) {
      setEditing(campaign.id)
      setForm({
        title: campaign.title,
        description: campaign.description,
        goal_amount: campaign.goal_amount,
        current_amount: campaign.current_amount,
        deadline: campaign.deadline || '',
      })
    } else {
      setEditing(null)
      setForm({ title: '', description: '', goal_amount: '', current_amount: 0, deadline: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = Cookies.get('admin_token')
    if (!token) return

    const payload = {
      ...form,
      goal_amount: parseFloat(form.goal_amount),
      current_amount: parseFloat(form.current_amount),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
    }

    try {
      if (editing) {
        await updateCampaign(editing, payload, token)
      } else {
        await createCampaign(payload, token)
      }
      setIsModalOpen(false)
      fetchCampaigns()
    } catch (err) {}
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return
    const token = Cookies.get('admin_token')
    try {
      await deleteCampaign(id, token)
      fetchCampaigns()
    } catch (err) {}
  }

  const handleToggle = async (id) => {
    const token = Cookies.get('admin_token')
    try {
      await toggleCampaign(id, token)
      fetchCampaigns()
    } catch (err) {}
  }

  if (loading) return <div className="p-8 text-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Campaign Management</h1>
          <p className="text-muted">Create and manage active donation drives.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 font-semibold">Campaign Title</th>
              <th className="px-6 py-4 font-semibold">Progress</th>
              <th className="px-6 py-4 font-semibold">Deadline</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-muted">No campaigns found. Create one above.</td></tr>
            ) : (
              campaigns.map(campaign => {
                const percent = campaign.goal_amount ? Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100)) : 0
                return (
                  <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-dark">{campaign.title}</div>
                      <div className="text-xs text-muted truncate max-w-xs">{campaign.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Rs.{campaign.current_amount.toLocaleString()}</span>
                        <span className="font-medium">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'No deadline'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${campaign.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {campaign.is_active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleToggle(campaign.id)} className={`p-2 rounded-lg transition-colors ${campaign.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`} title={campaign.is_active ? 'Pause' : 'Activate'}>
                          <FiPower className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal(campaign)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(campaign.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-6">{editing ? 'Edit Campaign' : 'Create Campaign'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Goal Amount (PKR)</label>
                  <input required type="number" value={form.goal_amount} onChange={e => setForm(p => ({ ...p, goal_amount: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Amount</label>
                  <input type="number" value={form.current_amount} onChange={e => setForm(p => ({ ...p, current_amount: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline (Optional)</label>
                <input type="date" value={form.deadline ? new Date(form.deadline).toISOString().split('T')[0] : ''} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
