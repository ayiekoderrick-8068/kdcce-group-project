export default function DonationCard({ donation }) {
  return (
    <article className="card donation-card">
      <p className="donation-card-amount">${Number(donation.amount).toFixed(2)}</p>
      <p>{donation.donor_name}</p>
      <p className="donation-card-meta">{donation.frequency}</p>
    </article>
  )
}
