import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
import { DASHBOARD_PATH_BY_ROLE } from '../../utils/constants'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleSuccess(user) {
    const from = location.state?.from?.pathname
    navigate(from || DASHBOARD_PATH_BY_ROLE[user.role] || '/', { replace: true })
  }

  return (
    <div className="auth-page">
      <h1>Log in</h1>
      <LoginForm onSuccess={handleSuccess} />
      <p className="auth-links">
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
      <p className="auth-links">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
