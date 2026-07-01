'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiUsers } from 'react-icons/fi'
import { useLanguage } from '@/lib/LanguageContext'

// Dynamic import for Leaflet (SSR-safe)
let L = null

const PAKISTAN_CENTER = [30.3753, 69.3451]
const TILE_LIGHT = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const SAMPLE_ACTIVITIES = [
  { id: 1, title: 'Ration Drive', city: 'Karachi', latitude: 24.8607, longitude: 67.0011, people_helped: 320, date: '2024-03-15' },
  { id: 2, title: 'Medical Camp', city: 'Lahore', latitude: 31.5204, longitude: 74.3587, people_helped: 150, date: '2024-04-01' },
  { id: 3, title: 'Education Drive', city: 'Islamabad', latitude: 33.6844, longitude: 73.0479, people_helped: 80, date: '2024-05-10' },
  { id: 4, title: 'Flood Relief', city: 'Peshawar', latitude: 34.0151, longitude: 71.5249, people_helped: 500, date: '2024-02-20' },
  { id: 5, title: 'Winter Relief', city: 'Quetta', latitude: 30.1798, longitude: 66.9750, people_helped: 200, date: '2024-01-12' },
  { id: 6, title: 'Food Drive', city: 'Multan', latitude: 30.1575, longitude: 71.5249, people_helped: 260, date: '2024-06-05' },
]

export default function ImpactMap() {
  const { t } = useLanguage()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)

  useEffect(() => {
    // Detect dark mode
    const darkCheck = () => setIsDark(document.documentElement.classList.contains('dark'))
    darkCheck()
    const observer = new MutationObserver(darkCheck)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Fetch activities from API, fallback to sample data
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
    fetch(`${API_BASE}/api/activities/map`)
      .then(r => r.json())
      .then(data => {
        const valid = data.filter(a => a.latitude && a.longitude)
        setActivities(valid.length > 0 ? valid : SAMPLE_ACTIVITIES)
      })
      .catch(() => setActivities(SAMPLE_ACTIVITIES))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading || typeof window === 'undefined' || !mapRef.current) return

    const initMap = async () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      const leaflet = await import('leaflet')
      await import('leaflet/dist/leaflet.css')
      L = leaflet.default

      // Fix default icon paths
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: PAKISTAN_CENTER,
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      L.tileLayer(isDark ? TILE_DARK : TILE_LIGHT, {
        attribution: isDark
          ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Custom emerald icon
      const emeraldIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:linear-gradient(135deg,#059669,#10b981);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(5,150,105,0.4)"></div>`,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      })

      activities.forEach(activity => {
        const marker = L.marker([activity.latitude, activity.longitude], { icon: emeraldIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:'Inter',sans-serif;padding:4px;min-width:180px">
              <h3 style="font-weight:700;font-size:14px;color:#0f172a;margin:0 0 6px">${activity.title}</h3>
              <div style="display:flex;align-items:center;gap:6px;color:#059669;font-size:12px;margin-bottom:4px">
                <span>📍 ${activity.city || 'Pakistan'}</span>
              </div>
              ${activity.people_helped ? `<div style="color:#64748b;font-size:12px">👥 ${activity.people_helped} people helped</div>` : ''}
              <div style="color:#94a3b8;font-size:11px;margin-top:4px">${activity.date}</div>
            </div>
          `, { className: 'custom-leaflet-popup' })
        marker.on('click', () => setSelectedActivity(activity))
      })

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loading, activities, isDark])

  const totalPeople = activities.reduce((sum, a) => sum + (a.people_helped || 0), 0)

  return (
    <section id="impact-map" className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6"
          >
            <FiMapPin className="w-4 h-4" />
            {t('map.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-dark dark:text-white mb-4"
          >
            {t('map.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              {t('map.title2')}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            {t('map.subtitle')}
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Cities Covered', value: new Set(activities.map(a => a.city)).size },
            { label: 'Total Activities', value: activities.length },
            { label: t('map.people'), value: totalPeople.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center border border-emerald-100 dark:border-emerald-800/30">
              <div className="font-display font-bold text-2xl text-emerald-700 dark:text-emerald-400">{value}</div>
              <div className="text-sm text-muted">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700"
          style={{ height: '500px' }}
        >
          {loading && (
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted">{t('map.loading')}</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </motion.div>

        <p className="text-center text-muted text-sm mt-4">
          🗺️ Map data © OpenStreetMap contributors · Click any pin for activity details
        </p>
      </div>
    </section>
  )
}
