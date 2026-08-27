import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listContactMessages, markMessageRead } from '../../services/contactService'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { formatDate } from '../../utils/formatters'

export default function AdminMessages() {
  const { data, loading, error, refetch } = useFetch(() => listContactMessages({ per_page: 100 }), [])
  const [busyId, setBusyId] = useState(null)

  async function toggleRead(message) {
    setBusyId(message.id)
    try {
      await markMessageRead(message.id, !message.is_read)
      await refetch()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h2>Contact Messages</h2>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load messages right now.</Alert>}
      {!loading && !error && (data?.messages?.length ?? 0) === 0 && <EmptyState title="No messages yet" />}
      {!loading &&
        !error &&
        data?.messages?.map((message) => (
          <div key={message.id} className={`message-item ${message.is_read ? '' : 'message-item-unread'}`}>
            <div className="message-item-header">
              <strong>{message.subject || '(no subject)'}</strong>
              <span>{formatDate(message.created_at)}</span>
            </div>
            <p>
              From {message.name} ({message.email})
            </p>
            <p>{message.message}</p>
            <Button variant="ghost" loading={busyId === message.id} onClick={() => toggleRead(message)}>
              Mark as {message.is_read ? 'unread' : 'read'}
            </Button>
          </div>
        ))}
    </div>
  )
}
