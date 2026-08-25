import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService'
import EventForm from '../../components/forms/EventForm'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'
import { formatDateTime } from '../../utils/formatters'

export default function AdminEvents() {
  const { data, loading, error, refetch } = useFetch(() => listEvents({ per_page: 100 }), [])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  async function handleCreate(values) {
    await createEvent(values)
    setCreating(false)
    await refetch()
  }

  async function handleUpdate(values) {
    await updateEvent(editing.id, values)
    setEditing(null)
    await refetch()
  }

  async function handleDelete() {
    setDeleting(true)
    setActionError(null)
    try {
      await deleteEvent(toDelete.id)
      setToDelete(null)
      await refetch()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Could not delete event')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Events</h2>
        <Button onClick={() => setCreating(true)}>New event</Button>
      </div>
      <Alert variant="error">{actionError}</Alert>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load events right now.</Alert>}
      {!loading && !error && (data?.events?.length ?? 0) === 0 && <EmptyState title="No events yet" />}
      {!loading && !error && (data?.events?.length ?? 0) > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Starts</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.events.map((event) => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{formatDateTime(event.start_at)}</td>
                  <td>{event.location}</td>
                  <td>{event.capacity ?? '—'}</td>
                  <td>
                    <Button variant="ghost" onClick={() => setEditing(event)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setToDelete(event)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={creating} title="New event" onClose={() => setCreating(false)}>
        <EventForm onSubmit={handleCreate} submitLabel="Create event" />
      </Modal>

      <Modal open={!!editing} title="Edit event" onClose={() => setEditing(null)}>
        {editing && <EventForm initialValues={editing} onSubmit={handleUpdate} submitLabel="Save changes" />}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete event?"
        description={toDelete ? `This will permanently delete "${toDelete.title}".` : ''}
        confirming={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
