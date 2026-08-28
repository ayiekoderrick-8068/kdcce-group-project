from marshmallow import Schema, fields, validate

from ..models.user import ROLES


class RegisterSchema(Schema):
    class Meta:
        # Silently drop anything else the client sends (e.g. "role") rather
        # than either honoring it or hard-rejecting the whole request — a
        # client can never influence its own role through this endpoint.
        unknown = "exclude"

    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True, validate=validate.Length(min=8))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)


class ForgotPasswordSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    token = fields.String(required=True)
    new_password = fields.String(required=True, load_only=True, validate=validate.Length(min=8))


class UserUpdateRoleSchema(Schema):
    role = fields.String(required=True, validate=validate.OneOf(ROLES))


class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=120))
    email = fields.Email(required=True)
    role = fields.String(dump_only=True)
    is_active = fields.Boolean(dump_only=True)
    created_at = fields.String(dump_only=True)
