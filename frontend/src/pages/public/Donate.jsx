import DonationForm from '../../components/forms/DonationForm'

export default function Donate() {
  return (
    <div className="page donate-page">
      <h1>Support Our Work</h1>
      <p>
        Every donation helps us provide meals, health checks, and social activities for the elderly in our care.
        Choose a one-time or monthly gift below.
      </p>
      <DonationForm />
    </div>
  )
}
