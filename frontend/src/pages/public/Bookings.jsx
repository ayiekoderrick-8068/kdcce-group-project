import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../hooks/useAuth'
import { myBookings } from '../../services/bookingService'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import Table from '../../components/common/Table'
import { formatDate } from '../../utils/formatters'

const COLUMNS = [
  { key: 'event_id', label: 'Event ID' },
  { key: 'number_of_seats', label: 'Seats' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Booked on', render: (row) => formatDate(row.created_at) },
]

export default function Bookings() {
  const { user } = useAuth()
  const { data, loading, error } = useFetch(() => myBookings(), [])

  if (!user) {
    return (
      <div className="page">
        <h1>My Bookings</h1>
        <Alert variant="info">Log in to see the bookings linked to your account.</Alert>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>My Bookings</h1>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load your bookings right now.</Alert>}
      {!loading && !error && (data?.length ?? 0) === 0 && <EmptyState title="You have no bookings yet" />}
      {!loading && !error && (data?.length ?? 0) > 0 && <Table columns={COLUMNS} rows={data} />}
    </div>
  )
}
