from marshmallow import Schema, fields, validate

from ..models.volunteer import VOLUNTEER_STATUSES


class VolunteerProfileSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    skills = fields.String(allow_none=True, validate=validate.Length(max=500))
    availability = fields.String(allow_none=True, validate=validate.Length(max=255))
    status = fields.String(dump_only=True)
    created_at = fields.String(dump_only=True)


class VolunteerProfileUpdateSchema(Schema):
    skills = fields.String(allow_none=True, validate=validate.Length(max=500))
    availability = fields.String(allow_none=True, validate=validate.Length(max=255))


class VolunteerStatusUpdateSchema(Schema):
    status = fields.String(required=True, validate=validate.OneOf(VOLUNTEER_STATUSES))
