import { Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/navigation/Sidebar'
import DashboardHeader from '../components/navigation/DashboardHeader'

const TITLES = { admin: 'Admin Dashboard', staff: 'Staff Dashboard', volunteer: 'Volunteer Dashboard' }

export default function DashboardLayout() {
  const { user } = useAuth()

  return (
    <div className="dashboard-layout">
      <Sidebar role={user?.role} />
      <div className="dashboard-content">
        <DashboardHeader title={TITLES[user?.role] || 'Dashboard'} />
        <div className="dashboard-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
