from marshmallow import Schema, fields, validate


class EventSchema(Schema):
    id = fields.Integer(dump_only=True)
    program_id = fields.Integer(allow_none=True)
    title = fields.String(required=True, validate=validate.Length(min=1, max=200))
    description = fields.String(allow_none=True)
    location = fields.String(allow_none=True, validate=validate.Length(max=255))
    start_at = fields.DateTime(required=True)
    end_at = fields.DateTime(allow_none=True)
    capacity = fields.Integer(allow_none=True, validate=validate.Range(min=1))
    created_at = fields.String(dump_only=True)


class EventUpdateSchema(EventSchema):
    title = fields.String(validate=validate.Length(min=1, max=200))
    start_at = fields.DateTime()
