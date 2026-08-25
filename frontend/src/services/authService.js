import api, { clearTokens, setTokens } from './api'

export async function register({ name, email, password }) {
  const { data } = await api.post('/api/auth/register', { name, email, password })
  setTokens(data)
  return data.user
}

export async function login({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password })
  setTokens(data)
  return data.user
}

export async function logout() {
  try {
    await api.post('/api/auth/logout')
  } finally {
    clearTokens()
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/api/auth/me')
  return data.user
}

export async function forgotPassword(email) {
  const { data } = await api.post('/api/auth/forgot-password', { email })
  return data
}

export async function resetPassword({ token, new_password }) {
  const { data } = await api.post('/api/auth/reset-password', { token, new_password })
  return data
}
