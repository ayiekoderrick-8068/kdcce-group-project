from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from ..extensions import db
from ..models.contact_message import ContactMessage
from ..schemas.contact_message_schema import ContactMessageSchema, ContactMessageUpdateSchema
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("contact", __name__, url_prefix="/api/contact-messages")

message_schema = ContactMessageSchema()
update_schema = ContactMessageUpdateSchema()


@bp.post("")
def create_message():
    payload = request.get_json(silent=True) or {}
    try:
        data = message_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    message = ContactMessage(**data)
    db.session.add(message)
    db.session.commit()
    return jsonify(message=message.to_dict()), 201


@bp.get("")
@roles_required("admin", "staff")
def list_messages():
    page, per_page = parse_pagination(request.args)
    query = ContactMessage.query.order_by(ContactMessage.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        messages=[m.to_dict() for m in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.patch("/<int:message_id>")
@roles_required("admin", "staff")
def update_message(message_id):
    message = ContactMessage.query.get_or_404(message_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = update_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    message.is_read = data["is_read"]
    db.session.commit()
    return jsonify(message=message.to_dict()), 200
