import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { sendContactMessage } from '../../services/contactService'
import Button from '../common/Button'
import Alert from '../common/Alert'

export default function ContactForm() {
  const [sent, setSent] = useState(false)
  const { values, errors, handleChange, handleSubmit, submitting, submitError } = useForm(
    { name: '', email: '', subject: '', message: '' },
    {
      onSubmit: async (vals) => {
        await sendContactMessage(vals)
        setSent(true)
      },
    },
  )

  if (sent) {
    return <Alert variant="success">Thanks — your message has been sent. We'll get back to you soon.</Alert>
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Name
        <input name="name" value={values.name} onChange={handleChange} required />
        {errors.name && <span className="field-error">{errors.name.join(', ')}</span>}
      </label>
      <label>
        Email
        <input type="email" name="email" value={values.email} onChange={handleChange} required />
        {errors.email && <span className="field-error">{errors.email.join(', ')}</span>}
      </label>
      <label>
        Subject
        <input name="subject" value={values.subject} onChange={handleChange} />
      </label>
      <label>
        Message
        <textarea name="message" value={values.message} onChange={handleChange} required rows={5} />
        {errors.message && <span className="field-error">{errors.message.join(', ')}</span>}
      </label>
      <Button type="submit" loading={submitting}>
        Send message
      </Button>
    </form>
  )
}
