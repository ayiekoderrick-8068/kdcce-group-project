import { useFetch } from '../../hooks/useFetch'
import { listDonations, donationTotals } from '../../services/donationService'
import Table from '../../components/common/Table'
import StatCard from '../../components/cards/StatCard'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import { formatCurrency, formatDate } from '../../utils/formatters'

const COLUMNS = [
  { key: 'donor_name', label: 'Donor' },
  { key: 'donor_email', label: 'Email' },
  { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
  { key: 'frequency', label: 'Frequency' },
  { key: 'created_at', label: 'Date', render: (row) => formatDate(row.created_at) },
]

export default function AdminDonations() {
  const { data, loading, error } = useFetch(() => listDonations({ per_page: 100 }), [])
  const { data: totals } = useFetch(() => donationTotals(), [])

  return (
    <div>
      <h2>Donations</h2>
      <div className="stat-grid">
        <StatCard label="Total raised" value={formatCurrency(totals?.total_amount ?? 0)} />
        <StatCard label="Number of donations" value={totals?.count ?? 0} />
      </div>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load donations right now.</Alert>}
      {!loading && !error && <Table columns={COLUMNS} rows={data?.donations} emptyMessage="No donations recorded yet" />}
    </div>
  )
}
