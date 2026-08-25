import { NavLink } from 'react-router-dom'

const NAV_BY_ROLE = {
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/programs', label: 'Programs' },
    { to: '/admin/events', label: 'Events' },
    { to: '/admin/donations', label: 'Donations' },
    { to: '/admin/bookings', label: 'Bookings' },
    { to: '/admin/messages', label: 'Messages' },
    { to: '/admin/volunteers', label: 'Volunteers' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/settings', label: 'Settings' },
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', end: true },
    { to: '/staff/programs', label: 'Programs' },
    { to: '/staff/events', label: 'Events' },
    { to: '/staff/bookings', label: 'Bookings' },
    { to: '/staff/messages', label: 'Messages' },
  ],
  volunteer: [
    { to: '/volunteer', label: 'Dashboard', end: true },
    { to: '/volunteer/opportunities', label: 'Opportunities' },
    { to: '/volunteer/profile', label: 'My Profile' },
  ],
}

export default function Sidebar({ role }) {
  const items = NAV_BY_ROLE[role] || []
  return (
    <aside className="sidebar">
      <nav>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
