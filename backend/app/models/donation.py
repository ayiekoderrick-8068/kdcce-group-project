from .user import utcnow
from ..extensions import db

FREQUENCIES = ("one-time", "monthly")


class Donation(db.Model):
    __tablename__ = "donations"

    id = db.Column(db.Integer, primary_key=True)
    donor_name = db.Column(db.String(200), nullable=False)
    donor_email = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    frequency = db.Column(db.String(20), nullable=False, default="one-time")
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)

    __table_args__ = (
        db.CheckConstraint(frequency.in_(FREQUENCIES), name="ck_donations_frequency_valid"),
        db.CheckConstraint("amount > 0", name="ck_donations_amount_positive"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "donor_name": self.donor_name,
            "donor_email": self.donor_email,
            "amount": float(self.amount) if self.amount is not None else None,
            "frequency": self.frequency,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
