from ..extensions import db
from ..models.donation import Donation
from .notification_service import notify


def record_donation(data):
    donation = Donation(**data)
    db.session.add(donation)
    db.session.commit()
    notify(
        f"New {donation.frequency} donation of {donation.amount} from {donation.donor_name}",
        category="donation",
    )
    return donation


def donation_totals():
    total = db.session.query(db.func.coalesce(db.func.sum(Donation.amount), 0)).scalar()
    count = db.session.query(db.func.count(Donation.id)).scalar()
    return {"total_amount": float(total), "count": count}
