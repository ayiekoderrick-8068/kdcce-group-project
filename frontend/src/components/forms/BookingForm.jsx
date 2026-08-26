import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { createBooking } from '../../services/bookingService'
import Button from '../common/Button'
import Alert from '../common/Alert'

export default function BookingForm({ eventId }) {
  const [done, setDone] = useState(false)
  const { values, errors, handleChange, handleSubmit, submitting, submitError } = useForm(
    { full_name: '', email: '', phone: '', number_of_seats: 1 },
    {
      onSubmit: async (vals) => {
        await createBooking({ ...vals, event_id: eventId, number_of_seats: Number(vals.number_of_seats) })
        setDone(true)
      },
    },
  )

  if (done) {
    return <Alert variant="success">Your booking has been submitted and is pending confirmation.</Alert>
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Full name
        <input name="full_name" value={values.full_name} onChange={handleChange} required />
        {errors.full_name && <span className="field-error">{errors.full_name.join(', ')}</span>}
      </label>
      <label>
        Email
        <input type="email" name="email" value={values.email} onChange={handleChange} required />
        {errors.email && <span className="field-error">{errors.email.join(', ')}</span>}
      </label>
      <label>
        Phone (optional)
        <input name="phone" value={values.phone} onChange={handleChange} />
      </label>
      <label>
        Number of seats
        <input type="number" min="1" name="number_of_seats" value={values.number_of_seats} onChange={handleChange} required />
      </label>
      <Button type="submit" loading={submitting}>
        Book now
      </Button>
    </form>
  )
}
