import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listPrograms, createProgram, updateProgram } from '../../services/programService'
import ProgramForm from '../../components/forms/ProgramForm'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

/** Staff can create and edit programs, but — unlike admins — cannot delete
 * them; the backend enforces that (`delete_program` is admin-only), so this
 * screen simply doesn't offer a delete action rather than showing one that
 * would always fail. */
export default function StaffPrograms() {
  const { data, loading, error, refetch } = useFetch(() => listPrograms({ per_page: 100 }), [])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

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

  return (
    <div>
      <div className="section-header">
        <h2>Programs</h2>
        <Button onClick={() => setCreating(true)}>New program</Button>
      </div>
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
    </div>
  )
}
