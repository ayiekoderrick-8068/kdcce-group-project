const VARIANTS = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  danger: 'btn btn-danger',
  ghost: 'btn btn-ghost',
}

export default function Button({ variant = 'primary', loading = false, children, ...rest }) {
  return (
    <button className={VARIANTS[variant] || VARIANTS.primary} disabled={loading || rest.disabled} {...rest}>
      {loading ? 'Please wait…' : children}
    </button>
  )
}
