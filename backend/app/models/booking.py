from .user import utcnow
from ..extensions import db

BOOKING_STATUSES = ("Pending", "Confirmed", "Cancelled")


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    full_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50))
    number_of_seats = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.String(20), nullable=False, default="Pending")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    event = db.relationship("Event", back_populates="bookings")
    user = db.relationship("User")

    __table_args__ = (
        db.CheckConstraint(status.in_(BOOKING_STATUSES), name="ck_bookings_status_valid"),
        db.CheckConstraint("number_of_seats > 0", name="ck_bookings_seats_positive"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "event_id": self.event_id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "number_of_seats": self.number_of_seats,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
