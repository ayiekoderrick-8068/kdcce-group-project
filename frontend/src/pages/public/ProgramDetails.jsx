import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { getProgram } from '../../services/programService'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'

export default function ProgramDetails() {
  const { id } = useParams()
  const { data: program, loading, error } = useFetch(() => getProgram(id), [id])

  if (loading) return <Loader />
  if (error) return <Alert variant="error">This program could not be found.</Alert>

  return (
    <article className="page program-details-page">
      {program.image_url && <img src={program.image_url} alt="" className="details-image" />}
      <h1>{program.title}</h1>
      {program.summary && <p className="lead">{program.summary}</p>}
      <p>{program.description}</p>
      <Link to="/programs">← Back to programs</Link>
    </article>
  )
}