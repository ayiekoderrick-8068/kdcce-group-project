
import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listPrograms } from '../../services/programService'
import ProgramCard from '../../components/cards/ProgramCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

export default function Programs() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(() => listPrograms({ page, per_page: 9 }), [page])

  return (
    <div className="page">
      <h1>Our Programs</h1>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load programs right now.</Alert>}
      {!loading && !error && (
        (data?.programs?.length ?? 0) === 0 ? (
          <EmptyState title="No programs published yet" />
        ) : (
          <>
            <div className="card-grid">
              {data.programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
            <div className="pagination">
              <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← Previous
              </button>
              <span>Page {page}</span>
              <button
                className="btn btn-ghost"
                disabled={data.programs.length < 9}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          </>
        )
      )}
    </div>
  )
}