import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { listPrograms } from '../../services/programService'
import { listEvents } from '../../services/eventService'
import ProgramCard from '../../components/cards/ProgramCard'
import EventCard from '../../components/cards/EventCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

export default function Home() {
  const { data: programsData, loading: programsLoading, error: programsError } = useFetch(
    () => listPrograms({ per_page: 3 }),
    [],
  )
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useFetch(() => listEvents({ per_page: 3 }), [])

  return (
    <div className="page home-page">
      <section className="hero">
        <h1>Kisumu Day Care Centre for the Elderly</h1>
        <p>Supporting the dignity, health and wellbeing of the elderly in our community through care, compassion and connection.</p>
        <div className="hero-actions">
          <Link to="/donate" className="btn btn-primary">
            Donate now
          </Link>
          <Link to="/volunteer-opportunities" className="btn btn-secondary">
            Volunteer with us
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Our programs</h2>
          <Link to="/programs">View all →</Link>
        </div>
        {programsLoading && <Loader />}
        {programsError && <Alert variant="error">Could not load programs right now.</Alert>}
        {!programsLoading && !programsError && (
          (programsData?.programs?.length ?? 0) === 0 ? (
            <EmptyState title="No programs published yet" />
          ) : (
            <div className="card-grid">
              {programsData.programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Upcoming events</h2>
          <Link to="/events">View all →</Link>
        </div>
        {eventsLoading && <Loader />}
        {eventsError && <Alert variant="error">Could not load events right now.</Alert>}
        {!eventsLoading && !eventsError && (
          (eventsData?.events?.length ?? 0) === 0 ? (
            <EmptyState title="No upcoming events" />
          ) : (
            <div className="card-grid">
              {eventsData.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )
        )}
      </section>
    </div>
  )
}
