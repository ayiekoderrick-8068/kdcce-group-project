from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from ..extensions import db
from ..models.event import Event
from ..schemas.event_schema import EventSchema, EventUpdateSchema
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("events", __name__, url_prefix="/api/events")

event_schema = EventSchema()
event_update_schema = EventUpdateSchema(partial=True)


@bp.get("")
def list_events():
    page, per_page = parse_pagination(request.args)
    query = Event.query.order_by(Event.start_at.asc())
    program_id = request.args.get("program_id", type=int)
    if program_id:
        query = query.filter_by(program_id=program_id)
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        events=[e.to_dict() for e in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/<int:event_id>")
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event=event.to_dict()), 200


@bp.post("")
@roles_required("admin", "staff")
def create_event():
    payload = request.get_json(silent=True) or {}
    try:
        data = event_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    event = Event(**data)
    db.session.add(event)
    db.session.commit()
    return jsonify(event=event.to_dict()), 201


@bp.patch("/<int:event_id>")
@roles_required("admin", "staff")
def update_event(event_id):
    event = Event.query.get_or_404(event_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = event_update_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    for key, value in data.items():
        setattr(event, key, value)
    db.session.commit()
    return jsonify(event=event.to_dict()), 200


@bp.delete("/<int:event_id>")
@roles_required("admin")
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return "", 204
