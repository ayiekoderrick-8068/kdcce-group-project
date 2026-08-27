from marshmallow import Schema, fields, validate


class ProgramSchema(Schema):
    id = fields.Integer(dump_only=True)
    title = fields.String(required=True, validate=validate.Length(min=1, max=200))
    slug = fields.String(required=True, validate=validate.Regexp(r"^[a-z0-9]+(?:-[a-z0-9]+)*$"))
    summary = fields.String(allow_none=True, validate=validate.Length(max=500))
    description = fields.String(allow_none=True)
    image_url = fields.String(allow_none=True, validate=validate.Length(max=500))
    is_published = fields.Boolean(load_default=True)
    created_at = fields.String(dump_only=True)


class ProgramUpdateSchema(ProgramSchema):
    title = fields.String(validate=validate.Length(min=1, max=200))
    slug = fields.String(validate=validate.Regexp(r"^[a-z0-9]+(?:-[a-z0-9]+)*$"))
