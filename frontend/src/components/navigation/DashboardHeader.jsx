import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

export default function DashboardHeader({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <div className="dashboard-header-user">
        <span>
          {user?.name} <em>({user?.role})</em>
        </span>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  )
}
