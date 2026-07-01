'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

export default function StoriesPage() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStories = async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'

      try {
        const res = await fetch(`${API_URL}/api/stories/`)
        if (!res.ok) throw new Error('Failed to fetch stories')
        const data = await res.json()
        setStories(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStories()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark">Success Stories</h1>
          <p className="text-muted">{stories.length} testimonials</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          Error: {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-muted">Loading stories...</div>
        ) : stories.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FiStar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-muted">No testimonials yet</p>
          </div>
        ) : (
          stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={story.image || 'https://via.placeholder.com/100'}
                    alt={story.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-dark">{story.name}</h3>
                    <p className="text-sm text-primary">{story.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(story.rating || 5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-sm line-clamp-4 mb-4">{story.story}</p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-sm text-muted">{story.location}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
