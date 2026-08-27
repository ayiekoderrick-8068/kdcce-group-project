import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listEvents } from '../../services/eventService'
import EventCard from '../../components/cards/EventCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

export default function Events() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => listEvents({ page, per_page: 9 }), [page])

  return (
    <div className="page">
      <h1>Upcoming Events</h1>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load events right now.</Alert>}
      {!loading && !error && (
        (data?.events?.length ?? 0) === 0 ? (
          <EmptyState title="No events scheduled yet" />
        ) : (
          <>
            <div className="card-grid">
              {data.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="pagination">
              <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← Previous
              </button>
              <span>Page {page}</span>
              <button className="btn btn-ghost" disabled={data.events.length < 9} onClick={() => setPage((p) => p + 1)}>
                Next →
              </button>
            </div>
          </>
        )
      )}
    </div>
  )
}
