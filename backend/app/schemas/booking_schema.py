from marshmallow import Schema, fields, validate

from ..models.booking import BOOKING_STATUSES


class BookingSchema(Schema):
    id = fields.Integer(dump_only=True)
    event_id = fields.Integer(required=True)
    full_name = fields.String(required=True, validate=validate.Length(min=1, max=200))
    email = fields.Email(required=True)
    phone = fields.String(allow_none=True, validate=validate.Length(max=50))
    number_of_seats = fields.Integer(load_default=1, validate=validate.Range(min=1))
    status = fields.String(dump_only=True)
    created_at = fields.String(dump_only=True)


class BookingStatusUpdateSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(BOOKING_STATUSES))
