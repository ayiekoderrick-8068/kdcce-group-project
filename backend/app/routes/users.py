from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from ..extensions import db
from ..models.user import User
from ..schemas.user_schema import UserUpdateRoleSchema
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("users", __name__, url_prefix="/api/users")

role_schema = UserUpdateRoleSchema()


@bp.get("")
@roles_required("admin")
def list_users():
    page, per_page = parse_pagination(request.args)
    query = User.query.order_by(User.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        users=[u.to_dict() for u in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/<int:user_id>")
@roles_required("admin")
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user=user.to_dict()), 200


@bp.patch("/<int:user_id>/role")
@roles_required("admin")
def update_role(user_id):
    user = User.query.get_or_404(user_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = role_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    user.role = data["role"]
    db.session.commit()
    return jsonify(user=user.to_dict()), 200


@bp.patch("/<int:user_id>/deactivate")
@roles_required("admin")
def deactivate_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_active = False
    db.session.commit()
    return jsonify(user=user.to_dict()), 200
