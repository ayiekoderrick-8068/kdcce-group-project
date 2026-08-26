from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from ..models.donation import Donation
from ..schemas.donation_schema import DonationSchema
from ..services.donation_service import donation_totals, record_donation
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("donations", __name__, url_prefix="/api/donations")

donation_schema = DonationSchema()


@bp.post("")
def create_donation():
    """Public — anyone can donate without an account."""
    payload = request.get_json(silent=True) or {}
    try:
        data = donation_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    donation = record_donation(data)
    return jsonify(donation=donation.to_dict()), 201


@bp.get("")
@roles_required("admin", "staff")
def list_donations():
    page, per_page = parse_pagination(request.args)
    query = Donation.query.order_by(Donation.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        donations=[d.to_dict() for d in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/totals")
@roles_required("admin", "staff")
def totals():
    return jsonify(**donation_totals()), 200
