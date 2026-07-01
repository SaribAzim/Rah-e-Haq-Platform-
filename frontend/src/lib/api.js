const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// ─── Newsletter ────────────────────────────────────────────
export const subscribeNewsletter = (email) =>
  fetchAPI('/api/newsletter/', { method: 'POST', body: JSON.stringify({ email }) })

// ─── Contact ───────────────────────────────────────────────
export const submitContact = (data) =>
  fetchAPI('/api/contact/', { method: 'POST', body: JSON.stringify(data) })

// ─── Volunteer ─────────────────────────────────────────────
export const applyVolunteer = (data) =>
  fetchAPI('/api/volunteer/', { method: 'POST', body: JSON.stringify(data) })

// ─── Donations ─────────────────────────────────────────────
export const createDonation = (data) =>
  fetchAPI('/api/donations/', { method: 'POST', body: JSON.stringify(data) })

// ─── Stories ───────────────────────────────────────────────
export const getStories = () => fetchAPI('/api/stories/')
export const getAllStories = (token) =>
  fetchAPI('/api/stories/all', { headers: { Authorization: `Bearer ${token}` } })

// ─── Activities ────────────────────────────────────────────
export const getActivities = () => fetchAPI('/api/activities/')
export const getMapActivities = () => fetchAPI('/api/activities/map')

// ─── Campaigns ─────────────────────────────────────────────
export const getCampaigns = () => fetchAPI('/api/campaigns/')
export const getAllCampaigns = (token) =>
  fetchAPI('/api/campaigns/all', { headers: { Authorization: `Bearer ${token}` } })
export const getCampaign = (id) => fetchAPI(`/api/campaigns/${id}`)
export const createCampaign = (data, token) =>
  fetchAPI('/api/campaigns/', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
export const updateCampaign = (id, data, token) =>
  fetchAPI(`/api/campaigns/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
export const deleteCampaign = (id, token) =>
  fetchAPI(`/api/campaigns/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
export const toggleCampaign = (id, token) =>
  fetchAPI(`/api/campaigns/${id}/toggle`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })

// ─── Events ────────────────────────────────────────────────
export const getUpcomingEvents = () => fetchAPI('/api/events/upcoming')
export const getAllEvents = (token) =>
  fetchAPI('/api/events/', { headers: { Authorization: `Bearer ${token}` } })
export const createEvent = (data, token) =>
  fetchAPI('/api/events/', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
export const updateEvent = (id, data, token) =>
  fetchAPI(`/api/events/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
export const deleteEvent = (id, token) =>
  fetchAPI(`/api/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
export const joinEvent = (id) =>
  fetchAPI(`/api/events/${id}/join`, { method: 'PUT' })

// ─── Leaderboard ───────────────────────────────────────────
export const getLeaderboard = () => fetchAPI('/api/leaderboard/')

// ─── Analytics ─────────────────────────────────────────────
export const getAnalyticsOverview = (token) =>
  fetchAPI('/api/analytics/overview', { headers: { Authorization: `Bearer ${token}` } })
export const getDonationsTimeline = (token) =>
  fetchAPI('/api/analytics/donations-timeline', { headers: { Authorization: `Bearer ${token}` } })
export const getVolunteersTimeline = (token) =>
  fetchAPI('/api/analytics/volunteers-timeline', { headers: { Authorization: `Bearer ${token}` } })

// ─── Notifications ─────────────────────────────────────────
export const getNotifications = (token) =>
  fetchAPI('/api/notifications/', { headers: { Authorization: `Bearer ${token}` } })
export const getUnreadCount = (token) =>
  fetchAPI('/api/notifications/unread-count', { headers: { Authorization: `Bearer ${token}` } })
export const markAllNotificationsRead = (token) =>
  fetchAPI('/api/notifications/mark-all-read', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
export const markNotificationRead = (id, token) =>
  fetchAPI(`/api/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })

// ─── Auth ──────────────────────────────────────────────────
export const login = (email, password) =>
  fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const getCurrentUser = (token) =>
  fetchAPI('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })

// ─── Admin endpoints ───────────────────────────────────────
export const getContacts = (token) =>
  fetchAPI('/api/contact/', { headers: { Authorization: `Bearer ${token}` } })

export const getVolunteers = (token) =>
  fetchAPI('/api/volunteer/', { headers: { Authorization: `Bearer ${token}` } })

export const getPendingVolunteers = (token) =>
  fetchAPI('/api/volunteer/pending', { headers: { Authorization: `Bearer ${token}` } })

export const approveVolunteer = (id, token) =>
  fetchAPI(`/api/volunteer/${id}/approve`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })

export const deleteVolunteer = (id, token) =>
  fetchAPI(`/api/volunteer/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })

export const getDonationStats = (token) =>
  fetchAPI('/api/donations/stats', { headers: { Authorization: `Bearer ${token}` } })

export const getAllDonations = (token) =>
  fetchAPI('/api/donations/', { headers: { Authorization: `Bearer ${token}` } })

export const deleteDonation = (id, token) =>
  fetchAPI(`/api/donations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })

export const verifyDonation = (id, token) =>
  fetchAPI(`/api/donations/${id}/complete`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })

export const getSubscribers = (token) =>
  fetchAPI('/api/newsletter/', { headers: { Authorization: `Bearer ${token}` } })

export const getSubscriberCount = () =>
  fetchAPI('/api/newsletter/stats/count')

// ─── Chatbot ───────────────────────────────────────────────
export const sendChatMessage = (message, history = [], language = 'en') =>
  fetchAPI('/api/chat/', { method: 'POST', body: JSON.stringify({ message, history, language }) })
