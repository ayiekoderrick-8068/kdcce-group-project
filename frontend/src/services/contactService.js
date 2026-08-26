import api from './api'

export async function sendContactMessage(payload) {
  const { data } = await api.post('/api/contact-messages', payload)
  return data.message
}

export async function listContactMessages(params = {}) {
  const { data } = await api.get('/api/contact-messages', { params })
  return data
}

export async function markMessageRead(id, isRead) {
  const { data } = await api.patch(`/api/contact-messages/${id}`, { is_read: isRead })
  return data.message
}
