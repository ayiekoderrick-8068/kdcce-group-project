import { useFetch } from '../../hooks/useFetch'
import { listPrograms } from '../../services/programService'
import { listEvents } from '../../services/eventService'
import { listBookings } from '../../services/bookingService'
import StatCard from '../../components/cards/StatCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'

export default function StaffDashboard() {
  const { data: programs, loading: l1, error: e1 } = useFetch(() => listPrograms({ per_page: 1 }), [])
  const { data: events, loading: l2, error: e2 } = useFetch(() => listEvents({ per_page: 1 }), [])
  const { data: bookings, loading: l3, error: e3 } = useFetch(() => listBookings({ per_page: 1 }), [])

  const loading = l1 || l2 || l3
  const error = e1 || e2 || e3

  return (
    <div>
      <h2>Overview</h2>
      {loading && <Loader />}
      {error && <Alert variant="error">Some dashboard statistics could not be loaded.</Alert>}
      {!loading && (
        <div className="stat-grid">
          <StatCard label="Programs" value={programs?.pagination?.total ?? 0} />
          <StatCard label="Events" value={events?.pagination?.total ?? 0} />
          <StatCard label="Bookings" value={bookings?.pagination?.total ?? 0} />
        </div>
      )}
    </div>
  )
}
