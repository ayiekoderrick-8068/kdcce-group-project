const ROLES = ['admin', 'staff', 'volunteer']

/** Admin-only inline control for changing a user's role. Deliberately NOT a
 * generic create/edit form: users are created only via registration, and the
 * server never trusts a client-supplied role at that point (see backend
 * AuthService.register_user) — this form only exercises the dedicated,
 * admin-guarded role-change endpoint. */
export default function UserForm({ user, onChangeRole, onDeactivate, updating }) {
  return (
    <div className="user-form">
      <label>
        Role
        <select value={user.role} disabled={updating} onChange={(event) => onChangeRole(user.id, event.target.value)}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
      {user.is_active ? (
        <button type="button" className="btn btn-danger" disabled={updating} onClick={() => onDeactivate(user.id)}>
          Deactivate
        </button>
      ) : (
        <span className="badge badge-muted">Deactivated</span>
      )}
    </div>
  )
}
