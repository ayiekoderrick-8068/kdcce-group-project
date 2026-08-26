import { useFetch } from '../../hooks/useFetch'
import { useForm } from '../../hooks/useForm'
import { myVolunteerProfile, updateMyVolunteerProfile } from '../../services/volunteerService'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import Loader from '../../components/common/Loader'

export default function VolunteerProfile() {
  const { data: profile, loading, error, refetch } = useFetch(() => myVolunteerProfile(), [])

  if (loading) return <Loader />

  return (
    <div>
      <h2>My Volunteer Profile</h2>
      {error && (
        <Alert variant="info">
          We don't have a volunteer profile on file for you yet. This is created automatically the first time an
          admin reviews your account — check back soon, or contact us if this seems wrong.
        </Alert>
      )}
      {!error && profile && <ProfileForm profile={profile} onSaved={refetch} />}
    </div>
  )
}

function ProfileForm({ profile, onSaved }) {
  const { values, handleChange, handleSubmit, submitting, submitError, setValues } = useForm(
    { skills: profile.skills || '', availability: profile.availability || '' },
    {
      onSubmit: async (vals) => {
        const updated = await updateMyVolunteerProfile(vals)
        setValues({ skills: updated.skills || '', availability: updated.availability || '' })
        await onSaved()
      },
    },
  )

  return (
    <form onSubmit={handleSubmit} className="form">
      <Alert variant="error">{submitError}</Alert>
      <p>
        Status: <strong>{profile.status}</strong>
      </p>
      <label>
        Skills
        <textarea name="skills" value={values.skills} onChange={handleChange} rows={3} placeholder="e.g. first aid, cooking, event planning" />
      </label>
      <label>
        Availability
        <input name="availability" value={values.availability} onChange={handleChange} placeholder="e.g. weekday mornings" />
      </label>
      <Button type="submit" loading={submitting}>
        Save profile
      </Button>
    </form>
  )
}
