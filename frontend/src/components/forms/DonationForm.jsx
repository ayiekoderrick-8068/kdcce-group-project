import { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { createDonation } from '../../services/donationService'
import Button from '../common/Button'
import Alert from '../common/Alert'

export default function DonationForm() {
  const [done, setDone] = useState(false)
  const { values, errors, handleChange, handleSubmit, submitting, submitError } = useForm(
    { donor_name: '', donor_email: '', amount: '', frequency: 'one-time', message: '' },
    {
      onSubmit: async (vals) => {
        await createDonation({ ...vals, amount: Number(vals.amount) })
        setDone(true)
      },
    },
  )

  if (done) {
    return <Alert variant="success">Thank you for your generosity — your donation has been recorded.</Alert>
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Your name
        <input name="donor_name" value={values.donor_name} onChange={handleChange} required />
        {errors.donor_name && <span className="field-error">{errors.donor_name.join(', ')}</span>}
      </label>
      <label>
        Email
        <input type="email" name="donor_email" value={values.donor_email} onChange={handleChange} required />
        {errors.donor_email && <span className="field-error">{errors.donor_email.join(', ')}</span>}
      </label>
      <label>
        Amount (USD)
        <input type="number" min="1" step="0.01" name="amount" value={values.amount} onChange={handleChange} required />
        {errors.amount && <span className="field-error">{errors.amount.join(', ')}</span>}
      </label>
      <label>
        Frequency
        <select name="frequency" value={values.frequency} onChange={handleChange}>
          <option value="one-time">One-time</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>
      <label>
        Message (optional)
        <textarea name="message" value={values.message} onChange={handleChange} rows={3} />
      </label>
      <Button type="submit" loading={submitting}>
        Donate
      </Button>
    </form>
  )
}
