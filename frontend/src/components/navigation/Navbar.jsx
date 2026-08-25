import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/events', label: 'Events' },
  { to: '/donate', label: 'Donate' },
  { to: '/contact', label: 'Contact' },
  { to: '/volunteer-opportunities', label: 'Volunteer' },
]

const DASHBOARD_PATH = { admin: '/admin', staff: '/staff', volunteer: '/volunteer' }

export default function Navbar() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          KDCEE
        </Link>

        <button className="navbar-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle navigation">
          ☰
        </button>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <Link to={DASHBOARD_PATH[user.role] || '/'} className="navbar-cta">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="navbar-cta">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
