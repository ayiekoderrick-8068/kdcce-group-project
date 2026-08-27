import api from './api'

export async function listEvents(params = {}) {
  const { data } = await api.get('/api/events', { params })
  return data
}

export async function getEvent(id) {
  const { data } = await api.get(`/api/events/${id}`)
  return data.event
}

export async function createEvent(payload) {
  const { data } = await api.post('/api/events', payload)
  return data.event
}

export async function updateEvent(id, payload) {
  const { data } = await api.patch(`/api/events/${id}`, payload)
  return data.event
}

export async function deleteEvent(id) {
  await api.delete(`/api/events/${id}`)
}
