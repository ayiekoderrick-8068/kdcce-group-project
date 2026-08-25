import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listPrograms, createProgram, updateProgram, deleteProgram } from '../../services/programService'
import ProgramForm from '../../components/forms/ProgramForm'
import Modal from '../../components/common/Modal'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

export default function AdminPrograms() {
  const { data, loading, error, refetch } = useFetch(() => listPrograms({ per_page: 100 }), [])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  async function handleCreate(values) {
    await createProgram(values)
    setCreating(false)
    await refetch()
  }

  async function handleUpdate(values) {
    await updateProgram(editing.id, values)
    setEditing(null)
    await refetch()
  }

  async function handleDelete() {
    setDeleting(true)
    setActionError(null)
    try {
      await deleteProgram(toDelete.id)
      setToDelete(null)
      await refetch()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Could not delete program')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>Programs</h2>
        <Button onClick={() => setCreating(true)}>New program</Button>
      </div>
      <Alert variant="error">{actionError}</Alert>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load programs right now.</Alert>}
      {!loading && !error && (data?.programs?.length ?? 0) === 0 && <EmptyState title="No programs yet" />}
      {!loading && !error && (data?.programs?.length ?? 0) > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.title}</td>
                  <td>{program.slug}</td>
                  <td>{program.is_published ? 'Yes' : 'No'}</td>
                  <td>
                    <Button variant="ghost" onClick={() => setEditing(program)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => setToDelete(program)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={creating} title="New program" onClose={() => setCreating(false)}>
        <ProgramForm onSubmit={handleCreate} submitLabel="Create program" />
      </Modal>

      <Modal open={!!editing} title="Edit program" onClose={() => setEditing(null)}>
        {editing && <ProgramForm initialValues={editing} onSubmit={handleUpdate} submitLabel="Save changes" />}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete program?"
        description={toDelete ? `This will permanently delete "${toDelete.title}".` : ''}
        confirming={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
