import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from '../../hooks/useForm'
import { resetPassword } from '../../services/authService'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const { values, handleChange, handleSubmit, submitting, submitError } = useForm(
    { new_password: '', confirm_password: '' },
    {
      onSubmit: async (vals) => {
        if (vals.new_password !== vals.confirm_password) {
          throw new Error('Passwords do not match')
        }
        await resetPassword({ token, new_password: vals.new_password })
        navigate('/login', { replace: true })
      },
    },
  )

  if (!token) {
    return (
      <div className="auth-page">
        <h1>Reset password</h1>
        <Alert variant="error">This reset link is missing its token. Please request a new one.</Alert>
        <p className="auth-links">
          <Link to="/forgot-password">Request a new link</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <h1>Reset password</h1>
      <form onSubmit={handleSubmit} className="form">
        <Alert variant="error">{submitError}</Alert>
        <label>
          New password
          <input
            type="password"
            name="new_password"
            value={values.new_password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </label>
        <Button type="submit" loading={submitting}>
          Reset password
        </Button>
      </form>
      <p className="auth-links">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  )
}
