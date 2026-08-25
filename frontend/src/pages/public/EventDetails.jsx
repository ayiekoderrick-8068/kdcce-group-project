import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getEvent } from '../../services/eventService'
import BookingForm from '../../components/forms/BookingForm'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import { formatDateTime } from '../../utils/formatters'

export default function EventDetails() {
  const { id } = useParams()
  const { data: event, loading, error } = useFetch(() => getEvent(id), [id])

  if (loading) return <Loader />
  if (error) return <Alert variant="error">This event could not be found.</Alert>

  const full = event.capacity != null && (event.seats_booked ?? 0) >= event.capacity

  return (
    <article className="page event-details-page">
      <h1>{event.title}</h1>
      <p className="event-card-meta">
        {formatDateTime(event.start_at)} {event.location ? `· ${event.location}` : ''}
      </p>
      <p>{event.description}</p>

      <section className="booking-section">
        <h2>Book your seat</h2>
        {full ? <Alert variant="info">This event is fully booked.</Alert> : <BookingForm eventId={event.id} />}
      </section>

      <Link to="/events">← Back to events</Link>
    </article>
  )
}
