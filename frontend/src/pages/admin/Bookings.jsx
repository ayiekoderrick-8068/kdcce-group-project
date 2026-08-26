import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listBookings, updateBookingStatus } from '../../services/bookingService'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import { BOOKING_STATUSES } from '../../utils/constants'
import { formatDate } from '../../utils/formatters'

export default function AdminBookings() {
  const { data, loading, error, refetch } = useFetch(() => listBookings({ per_page: 100 }), [])
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function handleStatusChange(id, status) {
    setBusyId(id)
    setActionError(null)
    try {
      await updateBookingStatus(id, status)
      await refetch()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Could not update booking')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h2>Bookings</h2>
      <Alert variant="error">{actionError}</Alert>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load bookings right now.</Alert>}
      {!loading && !error && (data?.bookings?.length ?? 0) === 0 && <EmptyState title="No bookings yet" />}
      {!loading && !error && (data?.bookings?.length ?? 0) > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Event ID</th>
                <th>Seats</th>
                <th>Booked on</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.full_name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.event_id}</td>
                  <td>{booking.number_of_seats}</td>
                  <td>{formatDate(booking.created_at)}</td>
                  <td>
                    <select
                      value={booking.status}
                      disabled={busyId === booking.id}
                      onChange={(event) => handleStatusChange(booking.id, event.target.value)}
                    >
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
