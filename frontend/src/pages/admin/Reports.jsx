import { useFetch } from '../../hooks/useFetch'
import { donationTotals } from '../../services/donationService'
import { listPrograms } from '../../services/programService'
import { listEvents } from '../../services/eventService'
import { listBookings } from '../../services/bookingService'
import { listVolunteers } from '../../services/volunteerService'
import StatCard from '../../components/cards/StatCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import { formatCurrency } from '../../utils/formatters'

export default function AdminReports() {
  const { data: totals, loading: l1, error: e1 } = useFetch(() => donationTotals(), [])
  const { data: programs, loading: l2, error: e2 } = useFetch(() => listPrograms({ per_page: 1 }), [])
  const { data: events, loading: l3, error: e3 } = useFetch(() => listEvents({ per_page: 1 }), [])
  const { data: bookings, loading: l4, error: e4 } = useFetch(() => listBookings({ per_page: 1 }), [])
  const { data: volunteers, loading: l5, error: e5 } = useFetch(() => listVolunteers({ per_page: 1 }), [])

  const loading = l1 || l2 || l3 || l4 || l5
  const error = e1 || e2 || e3 || e4 || e5

  return (
    <div>
      <h2>Reports</h2>
      <p>A snapshot of activity across the organisation.</p>
      {loading && <Loader />}
      {error && <Alert variant="error">Some report data could not be loaded.</Alert>}
      {!loading && (
        <div className="stat-grid">
          <StatCard label="Total donations raised" value={formatCurrency(totals?.total_amount ?? 0)} />
          <StatCard label="Number of donations" value={totals?.count ?? 0} />
          <StatCard label="Published programs" value={programs?.pagination?.total ?? 0} />
          <StatCard label="Scheduled events" value={events?.pagination?.total ?? 0} />
          <StatCard label="Total bookings" value={bookings?.pagination?.total ?? 0} />
          <StatCard label="Volunteer profiles" value={volunteers?.pagination?.total ?? 0} />
        </div>
      )}
    </div>
  )
}
