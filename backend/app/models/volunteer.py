from .user import utcnow
from ..extensions import db

VOLUNTEER_STATUSES = ("Pending", "Approved", "Rejected")


class VolunteerProfile(db.Model):
    __tablename__ = "volunteer_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    skills = db.Column(db.String(500))
    availability = db.Column(db.String(255))
    status = db.Column(db.String(20), nullable=False, default="Pending")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    user = db.relationship("User", back_populates="volunteer_profile")

    __table_args__ = (
        db.CheckConstraint(status.in_(VOLUNTEER_STATUSES), name="ck_volunteer_status_valid"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "skills": self.skills,
            "availability": self.availability,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
