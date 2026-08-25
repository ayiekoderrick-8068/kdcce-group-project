import { useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { listUsers, updateUserRole, deactivateUser } from '../../services/userService'
import UserForm from '../../components/forms/UserForm'
import Loader from '../../components/common/Loader'
import Alert from '../../components/common/Alert'
import EmptyState from '../../components/common/EmptyState'

export default function AdminUsers() {
  const { data, loading, error, refetch } = useFetch(() => listUsers({ per_page: 100 }), [])
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function handleChangeRole(id, role) {
    setBusyId(id)
    setActionError(null)
    try {
      await updateUserRole(id, role)
      await refetch()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Could not update role')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDeactivate(id) {
    setBusyId(id)
    setActionError(null)
    try {
      await deactivateUser(id)
      await refetch()
    } catch (err) {
      setActionError(err?.response?.data?.error || 'Could not deactivate user')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h2>Users</h2>
      <Alert variant="error">{actionError}</Alert>
      {loading && <Loader />}
      {error && <Alert variant="error">Could not load users right now.</Alert>}
      {!loading && !error && (data?.users?.length ?? 0) === 0 && <EmptyState title="No users found" />}
      {!loading && !error && (data?.users?.length ?? 0) > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role / status</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <UserForm
                      user={user}
                      updating={busyId === user.id}
                      onChangeRole={handleChangeRole}
                      onDeactivate={handleDeactivate}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
