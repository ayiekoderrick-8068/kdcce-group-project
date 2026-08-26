import { useForm } from '../../hooks/useForm'
import Button from '../common/Button'
import Alert from '../common/Alert'

function toLocalInputValue(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function EventForm({ initialValues, onSubmit, submitLabel = 'Save event' }) {
  const { values, errors, handleChange, handleSubmit, submitting, submitError } = useForm(
    initialValues || {
      title: '',
      description: '',
      location: '',
      start_at: '',
      end_at: '',
      capacity: '',
    },
    {
      onSubmit: (vals) =>
        onSubmit({
          ...vals,
          capacity: vals.capacity ? Number(vals.capacity) : null,
          start_at: vals.start_at ? new Date(vals.start_at).toISOString() : null,
          end_at: vals.end_at ? new Date(vals.end_at).toISOString() : null,
        }),
    },
  )

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Title
        <input name="title" value={values.title} onChange={handleChange} required />
        {errors.title && <span className="field-error">{errors.title.join(', ')}</span>}
      </label>
      <label>
        Description
        <textarea name="description" value={values.description} onChange={handleChange} rows={4} />
      </label>
      <label>
        Location
        <input name="location" value={values.location} onChange={handleChange} />
      </label>
      <label>
        Starts at
        <input
          type="datetime-local"
          name="start_at"
          value={values.start_at?.includes('T') && values.start_at.length === 16 ? values.start_at : toLocalInputValue(values.start_at)}
          onChange={handleChange}
          required
        />
        {errors.start_at && <span className="field-error">{errors.start_at.join(', ')}</span>}
      </label>
      <label>
        Ends at
        <input
          type="datetime-local"
          name="end_at"
          value={values.end_at?.includes('T') && values.end_at.length === 16 ? values.end_at : toLocalInputValue(values.end_at)}
          onChange={handleChange}
        />
      </label>
      <label>
        Capacity
        <input type="number" min="1" name="capacity" value={values.capacity ?? ''} onChange={handleChange} />
        {errors.capacity && <span className="field-error">{errors.capacity.join(', ')}</span>}
      </label>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
