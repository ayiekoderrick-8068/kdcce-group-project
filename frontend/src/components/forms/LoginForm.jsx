import { useForm } from '../../hooks/useForm'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'
import Alert from '../common/Alert'

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth()
  const { values, handleChange, handleSubmit, submitting, submitError } = useForm(
    { email: '', password: '' },
    {
      onSubmit: async (vals) => {
        const user = await login(vals)
        onSuccess?.(user)
      },
    },
  )

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Email
        <input type="email" name="email" value={values.email} onChange={handleChange} required />
      </label>
      <label>
        Password
        <input type="password" name="password" value={values.password} onChange={handleChange} required />
      </label>
      <Button type="submit" loading={submitting}>
        Log in
      </Button>
    </form>
  )
}
