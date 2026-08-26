import api from './api'

export async function createDonation(payload) {
  const { data } = await api.post('/api/donations', payload)
  return data.donation
}

export async function listDonations(params = {}) {
  const { data } = await api.get('/api/donations', { params })
  return data
}

export async function donationTotals() {
  const { data } = await api.get('/api/donations/totals')
  return data
}
