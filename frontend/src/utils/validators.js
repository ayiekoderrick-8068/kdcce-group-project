const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || '').trim())
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0
}

export function minLength(value, length) {
  return String(value || '').length >= length
}

export function passwordsMatch(a, b) {
  return a === b && isRequired(a)
}
