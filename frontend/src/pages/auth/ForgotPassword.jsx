import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { forgotPassword } from '../../services/authService'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const { values, handleChange, handleSubmit, submitting, submitError } = useForm(
    { email: '' },
    {
      onSubmit: async (vals) => {
        await forgotPassword(vals.email)
        setSent(true)
      },
    },
  )

  return (
    <div className="auth-page">
      <h1>Forgot password</h1>
      {sent ? (
        <Alert variant="success">
          If an account exists for that email, password reset instructions have been sent.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <Alert variant="error">{submitError}</Alert>
          <p>Enter your account email and we'll send you instructions to reset your password.</p>
          <label>
            Email
            <input type="email" name="email" value={values.email} onChange={handleChange} required />
          </label>
          <Button type="submit" loading={submitting}>
            Send reset instructions
          </Button>
        </form>
      )}
      <p className="auth-links">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  )
}
