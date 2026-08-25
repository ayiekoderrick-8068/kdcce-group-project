import { useAuth } from '../../hooks/useAuth'

export default function AdminSettings() {
  const { user } = useAuth()

  return (
    <div>
      <h2>Account Settings</h2>
      <div className="settings-card">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        <p className="muted">
          Password changes are handled through the "Forgot password" flow on the login page for security reasons.
          Organisation-wide settings (site branding, notification email, etc.) are managed via environment
          configuration on the backend.
        </p>
      </div>
    </div>
  )
}
