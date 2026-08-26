import { useFetch } from '../../hooks/useFetch'
import { myVolunteerProfile } from '../../services/volunteerService'
import { myBookings } from '../../services/bookingService'
import StatCard from '../../components/cards/StatCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'

export default function VolunteerDashboard() {
  const { data: profile, loading: l1, error: e1 } = useFetch(() => myVolunteerProfile(), [])
  const { data: bookings, loading: l2, error: e2 } = useFetch(() => myBookings(), [])

  const loading = l1 || l2

  return (
    <div>
      <h2>Welcome back</h2>
      {loading && <Loader />}
      {e1 && <Alert variant="info">You don't have a volunteer profile yet — visit "My Profile" to create one.</Alert>}
      {e2 && <Alert variant="error">Could not load your bookings.</Alert>}
      {!loading && (
        <div className="stat-grid">
          <StatCard label="Application status" value={profile?.status || 'Not started'} />
          <StatCard label="My bookings" value={bookings?.length ?? 0} />
        </div>
      )}
    </div>
  )
}
