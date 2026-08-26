import { Link } from 'react-router-dom'

export default function ProgramCard({ program }) {
  return (
    <article className="card program-card">
      {program.image_url && <img src={program.image_url} alt="" />}
      <h3>{program.title}</h3>
      <p>{program.summary}</p>
      <Link to={`/programs/${program.id}`}>Learn more →</Link>
    </article>
  )
}
