import { useForm } from '../../hooks/useForm'
import Button from '../common/Button'
import Alert from '../common/Alert'

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProgramForm({ initialValues, onSubmit, submitLabel = 'Save program' }) {
  const { values, errors, handleChange, handleSubmit, submitting, submitError, setFieldValue } = useForm(
    initialValues || { title: '', slug: '', summary: '', description: '', image_url: '', is_published: true },
    { onSubmit },
  )

  function handleTitleChange(event) {
    handleChange(event)
    if (!values.slug) {
      setFieldValue('slug', slugify(event.target.value))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <label>
        Title
        <input name="title" value={values.title} onChange={handleTitleChange} required />
        {errors.title && <span className="field-error">{errors.title.join(', ')}</span>}
      </label>
      <label>
        Slug
        <input name="slug" value={values.slug} onChange={handleChange} required />
        {errors.slug && <span className="field-error">{errors.slug.join(', ')}</span>}
      </label>
      <label>
        Summary
        <input name="summary" value={values.summary} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea name="description" value={values.description} onChange={handleChange} rows={5} />
      </label>
      <label>
        Image URL
        <input name="image_url" value={values.image_url} onChange={handleChange} />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="is_published" checked={values.is_published} onChange={handleChange} />
        Published
      </label>
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  )
}
