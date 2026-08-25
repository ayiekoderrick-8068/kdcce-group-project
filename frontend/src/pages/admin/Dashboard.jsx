import { useFetch } from '../../hooks/useFetch'
import { listPrograms } from '../../services/programService'
import { listEvents } from '../../services/eventService'
import { donationTotals } from '../../services/donationService'
import { listBookings } from '../../services/bookingService'
import StatCard from '../../components/cards/StatCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import { formatCurrency } from '../../utils/formatters'

export default function AdminDashboard() {
  const { data: programs, loading: l1, error: e1 } = useFetch(() => listPrograms({ per_page: 1 }), [])
  const { data: events, loading: l2, error: e2 } = useFetch(() => listEvents({ per_page: 1 }), [])
  const { data: totals, loading: l3, error: e3 } = useFetch(() => donationTotals(), [])
  const { data: bookings, loading: l4, error: e4 } = useFetch(() => listBookings({ per_page: 1 }), [])

  const loading = l1 || l2 || l3 || l4
  const error = e1 || e2 || e3 || e4

  return (
    <div>
      <h2>Overview</h2>
      {loading && <Loader />}
      {error && <Alert variant="error">Some dashboard statistics could not be loaded.</Alert>}
      {!loading && (
        <div className="stat-grid">
          <StatCard label="Programs" value={programs?.pagination?.total ?? 0} />
          <StatCard label="Events" value={events?.pagination?.total ?? 0} />
          <StatCard label="Total donations" value={formatCurrency(totals?.total_amount ?? 0)} />
          <StatCard label="Bookings" value={bookings?.pagination?.total ?? 0} />
        </div>
      )}
    </div>
  )
}
