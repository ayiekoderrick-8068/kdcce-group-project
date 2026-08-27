import api from './api'

export async function listUsers(params = {}) {
  const { data } = await api.get('/api/users', { params })
  return data
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/api/users/${id}/role`, { role })
  return data.user
}

export async function deactivateUser(id) {
  const { data } = await api.patch(`/api/users/${id}/deactivate`)
  return data.user
}
