import { useState } from 'react'

/** Small controlled-form helper: tracks values + per-field errors, and
 * wraps a submit handler with loading state + error capture so every form
 * in the app doesn't reimplement the same boilerplate. */
export function useForm(initialValues, { onSubmit } = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function setFieldValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    if (event?.preventDefault) event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setErrors({})
    try {
      await onSubmit?.(values)
    } catch (err) {
      const backendDetails = err?.response?.data?.details
      if (backendDetails && typeof backendDetails === 'object') {
        setErrors(backendDetails)
      }
      setSubmitError(err?.response?.data?.error || err.message || 'Something went wrong')
      // Deliberately not re-thrown: this is normally wired up as a <form onSubmit>
      // handler, which nothing awaits, so a re-thrown rejection here would surface
      // only as an unhandled promise rejection rather than anything the caller can
      // act on. The failure is already fully captured in submitError/errors above.
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors, submitting, submitError, handleChange, setFieldValue, handleSubmit, setValues }
}
