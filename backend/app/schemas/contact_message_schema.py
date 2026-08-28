from marshmallow import Schema, fields, validate


class ContactMessageSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=200))
    email = fields.Email(required=True)
    subject = fields.String(allow_none=True, validate=validate.Length(max=255))
    message = fields.String(required=True, validate=validate.Length(min=1))
    is_read = fields.Boolean(dump_only=True)
    created_at = fields.String(dump_only=True)


class ContactMessageUpdateSchema(Schema):
    is_read = fields.Boolean(required=True)
