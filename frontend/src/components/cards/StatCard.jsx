export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </div>
  )
}
