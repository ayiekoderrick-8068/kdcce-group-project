// SHARED / INTEGRATION FILE — do not edit without coordination.
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api
