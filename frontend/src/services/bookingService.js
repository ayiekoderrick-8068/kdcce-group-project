import api from './api'

export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload)
  return data.booking
}

export async function listBookings(params = {}) {
  const { data } = await api.get('/api/bookings', { params })
  return data
}

export async function myBookings() {
  const { data } = await api.get('/api/bookings/mine')
  return data.bookings
}

export async function updateBookingStatus(id, status) {
  const { data } = await api.patch(`/api/bookings/${id}/status`, { status })
  return data.booking
}
