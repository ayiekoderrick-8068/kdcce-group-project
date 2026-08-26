export const ROLES = Object.freeze({
  ADMIN: 'admin',
  STAFF: 'staff',
  VOLUNTEER: 'volunteer',
})

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Cancelled']
export const VOLUNTEER_STATUSES = ['Pending', 'Approved', 'Rejected']

export const DASHBOARD_PATH_BY_ROLE = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.STAFF]: '/staff',
  [ROLES.VOLUNTEER]: '/volunteer',
}
