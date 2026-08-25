import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Programs from '../pages/public/Programs'
import ProgramDetails from '../pages/public/ProgramDetails'
import Events from '../pages/public/Events'
import EventDetails from '../pages/public/EventDetails'
import Donate from '../pages/public/Donate'
import Contact from '../pages/public/Contact'
import Bookings from '../pages/public/Bookings'
import NotFound from '../pages/public/NotFound'

import Login from '../pages/auth/Login'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'

import AdminDashboard from '../pages/admin/Dashboard'
import AdminUsers from '../pages/admin/Users'
import AdminPrograms from '../pages/admin/Programs'
import AdminEvents from '../pages/admin/Events'
import AdminDonations from '../pages/admin/Donations'
import AdminBookings from '../pages/admin/Bookings'
import AdminMessages from '../pages/admin/Messages'
import AdminReports from '../pages/admin/Reports'
import AdminSettings from '../pages/admin/Settings'

import StaffDashboard from '../pages/staff/Dashboard'
import StaffPrograms from '../pages/staff/Programs'
import StaffEvents from '../pages/staff/Events'
import StaffBookings from '../pages/staff/Bookings'
import StaffMessages from '../pages/staff/Messages'

import VolunteerDashboard from '../pages/volunteer/Dashboard'
import VolunteerOpportunities from '../pages/volunteer/Opportunities'
import VolunteerSchedule from '../pages/volunteer/Schedule'
import VolunteerProfile from '../pages/volunteer/Profile'

// SHARED / INTEGRATION FILE — do not edit without coordination.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="/staff" element={<DashboardLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="programs" element={<StaffPrograms />} />
          <Route path="events" element={<StaffEvents />} />
          <Route path="bookings" element={<StaffBookings />} />
          <Route path="messages" element={<StaffMessages />} />
        </Route>

        <Route path="/volunteer" element={<DashboardLayout />}>
          <Route index element={<VolunteerDashboard />} />
          <Route path="opportunities" element={<VolunteerOpportunities />} />
          <Route path="schedule" element={<VolunteerSchedule />} />
          <Route path="profile" element={<VolunteerProfile />} />
        </Route>
      </Route>
    </Routes>
  )
}
