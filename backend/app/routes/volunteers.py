from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError

from ..extensions import db
from ..models.volunteer import VolunteerProfile
from ..schemas.volunteer_schema import (
    VolunteerProfileSchema,
    VolunteerProfileUpdateSchema,
    VolunteerStatusUpdateSchema,
)
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("volunteers", __name__, url_prefix="/api/volunteers")

update_schema = VolunteerProfileUpdateSchema()
status_schema = VolunteerStatusUpdateSchema()


@bp.get("")
@roles_required("admin", "staff")
def list_volunteers():
    page, per_page = parse_pagination(request.args)
    query = VolunteerProfile.query.order_by(VolunteerProfile.created_at.desc())
    status = request.args.get("status")
    if status:
        query = query.filter_by(status=status)
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        volunteers=[v.to_dict() for v in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/me")
@jwt_required()
def my_profile():
    user_id = int(get_jwt_identity())
    profile = VolunteerProfile.query.filter_by(user_id=user_id).first_or_404()
    return jsonify(volunteer=profile.to_dict()), 200


@bp.patch("/me")
@jwt_required()
def update_my_profile():
    user_id = int(get_jwt_identity())
    profile = VolunteerProfile.query.filter_by(user_id=user_id).first_or_404()
    payload = request.get_json(silent=True) or {}
    try:
        data = update_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    for key, value in data.items():
        setattr(profile, key, value)
    db.session.commit()
    return jsonify(volunteer=profile.to_dict()), 200


@bp.patch("/<int:volunteer_id>/status")
@roles_required("admin", "staff")
def update_status(volunteer_id):
    profile = VolunteerProfile.query.get_or_404(volunteer_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = status_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    profile.status = data["status"]
    db.session.commit()
    return jsonify(volunteer=profile.to_dict()), 200
