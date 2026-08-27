import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  const date = event.start_at ? new Date(event.start_at).toLocaleString() : ''
  return (
    <article className="card event-card">
      <h3>{event.title}</h3>
      <p className="event-card-meta">
        {date} {event.location ? `· ${event.location}` : ''}
      </p>
      {event.capacity && (
        <p className="event-card-capacity">
          {event.seats_booked ?? 0} / {event.capacity} seats booked
        </p>
      )}
      <Link to={`/events/${event.id}`}>View details →</Link>
    </article>
  )
}
