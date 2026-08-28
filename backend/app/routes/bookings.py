from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, verify_jwt_in_request
from marshmallow import ValidationError

from ..extensions import db
from ..models.booking import Booking
from ..models.event import Event
from ..schemas.booking_schema import BookingSchema, BookingStatusUpdateSchema
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")

booking_schema = BookingSchema()
status_schema = BookingStatusUpdateSchema()


@bp.post("")
def create_booking():
    """Public — a visitor can book an event slot without an account. If
    they happen to be logged in, the booking is linked to their user id."""
    payload = request.get_json(silent=True) or {}
    try:
        data = booking_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    event = Event.query.get_or_404(data["event_id"])
    already_booked = sum(b.number_of_seats for b in event.bookings if b.status != "Cancelled")
    if event.capacity is not None and already_booked + data["number_of_seats"] > event.capacity:
        return jsonify(error="Not enough seats available for this event"), 409

    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        user_id = int(identity) if identity else None
    except Exception:
        user_id = None

    booking = Booking(**data, user_id=user_id, status="Pending")
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking=booking.to_dict()), 201


@bp.get("")
@roles_required("admin", "staff")
def list_bookings():
    page, per_page = parse_pagination(request.args)
    query = Booking.query.order_by(Booking.created_at.desc())
    event_id = request.args.get("event_id", type=int)
    if event_id:
        query = query.filter_by(event_id=event_id)
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        bookings=[b.to_dict() for b in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/mine")
@jwt_required()
def my_bookings():
    user_id = int(get_jwt_identity())
    items = Booking.query.filter_by(user_id=user_id).order_by(Booking.created_at.desc()).all()
    return jsonify(bookings=[b.to_dict() for b in items]), 200


@bp.patch("/<int:booking_id>/status")
@roles_required("admin", "staff")
def update_booking_status(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = status_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    booking.status = data["status"]
    db.session.commit()
    return jsonify(booking=booking.to_dict()), 200
