from marshmallow import Schema, fields, validate

from ..models.donation import FREQUENCIES


class DonationSchema(Schema):
    id = fields.Integer(dump_only=True)
    donor_name = fields.String(required=True, validate=validate.Length(min=1, max=200))
    donor_email = fields.Email(required=True)
    amount = fields.Decimal(required=True, as_string=False, validate=validate.Range(min=0.01))
    frequency = fields.String(load_default="one-time", validate=validate.OneOf(FREQUENCIES))
    message = fields.String(allow_none=True)
    created_at = fields.String(dump_only=True)
