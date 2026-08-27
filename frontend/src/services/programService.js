import api from './api'

export async function listPrograms(params = {}) {
  const { data } = await api.get('/api/programs', { params })
  return data
}

export async function getProgram(id) {
  const { data } = await api.get(`/api/programs/${id}`)
  return data.program
}

export async function createProgram(payload) {
  const { data } = await api.post('/api/programs', payload)
  return data.program
}

export async function updateProgram(id, payload) {
  const { data } = await api.patch(`/api/programs/${id}`, payload)
  return data.program
}

export async function deleteProgram(id) {
  await api.delete(`/api/programs/${id}`)
}
