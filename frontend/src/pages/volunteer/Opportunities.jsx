import { useFetch } from '../../hooks/useFetch'
import { listEvents } from '../../services/eventService'
import EventCard from '../../components/cards/EventCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

/** Volunteer-facing view of upcoming events they could help staff or attend.
 * Reuses the public events list endpoint since there is no volunteer-only
 * events API — the value-add here is presenting it inside the volunteer's
 * own dashboard rather than requiring them to leave it. */
export default function VolunteerOpportunitiesPage() {
  const { data, loading, error } = useFetch(() => listEvents({ per_page: 20 }), [])

  return (
    <div>
      <h2>Upcoming Opportunities</h2>
      <p>These are our upcoming events — reach out to a staff member if you'd like to help out at any of them.</p>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load opportunities right now.</Alert>}
      {!loading && !error && (data?.events?.length ?? 0) === 0 && <EmptyState title="No upcoming events" />}
      {!loading && !error && (data?.events?.length ?? 0) > 0 && (
        <div className="card-grid">
          {data.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
