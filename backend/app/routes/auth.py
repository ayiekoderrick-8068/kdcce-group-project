from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from marshmallow import ValidationError

from ..extensions import db
from ..models.user import User
from ..models.token_blocklist import TokenBlocklist
from ..models.password_reset_token import PasswordResetToken
from ..schemas.user_schema import (
    ForgotPasswordSchema,
    LoginSchema,
    RegisterSchema,
    ResetPasswordSchema,
)
from ..services.auth_service import AuthError, authenticate, issue_tokens, register_user
from ..services.notification_service import notify
from ..utils.response_helpers import validation_error_response

bp = Blueprint("auth", __name__, url_prefix="/api/auth")

register_schema = RegisterSchema()
login_schema = LoginSchema()
forgot_password_schema = ForgotPasswordSchema()
reset_password_schema = ResetPasswordSchema()


@bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    try:
        data = register_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    try:
        user = register_user(data["name"], data["email"], data["password"])
    except AuthError as err:
        return jsonify(error=err.message), err.status_code

    access_token, refresh_token = issue_tokens(user)
    return jsonify(user=user.to_dict(), access_token=access_token, refresh_token=refresh_token), 201


@bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    try:
        data = login_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    try:
        user = authenticate(data["email"], data["password"])
    except AuthError as err:
        return jsonify(error=err.message), err.status_code

    access_token, refresh_token = issue_tokens(user)
    return jsonify(user=user.to_dict(), access_token=access_token, refresh_token=refresh_token), 200


@bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    role = get_jwt().get("role")
    from flask_jwt_extended import create_access_token

    access_token = create_access_token(identity=identity, additional_claims={"role": role})
    return jsonify(access_token=access_token), 200


@bp.post("/logout")
@jwt_required(verify_type=False)
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify(message="Logged out"), 200


@bp.post("/forgot-password")
def forgot_password():
    """Always returns 200 whether or not the email exists — that's
    deliberate, so this endpoint can't be used to discover which emails
    have accounts."""
    payload = request.get_json(silent=True) or {}
    try:
        data = forgot_password_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    user = User.query.filter_by(email=data["email"]).first()
    if user is not None:
        record, raw_token = PasswordResetToken.generate(user.id)
        db.session.add(record)
        db.session.commit()
        # No real email transport configured — logged via notify() instead,
        # same seam a real provider (SES, SendGrid, ...) would plug into.
        notify(f"Password reset requested for {user.email}: token={raw_token}", category="password_reset")

    return jsonify(message="If that email exists, a reset link has been sent"), 200


@bp.post("/reset-password")
def reset_password():
    payload = request.get_json(silent=True) or {}
    try:
        data = reset_password_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    token_hash = PasswordResetToken.hash_token(data["token"])
    record = PasswordResetToken.query.filter_by(token_hash=token_hash).first()
    if record is None or not record.is_valid():
        return jsonify(error="Invalid or expired reset token"), 400

    user = User.query.get_or_404(record.user_id)
    user.set_password(data["new_password"])
    record.used = True
    db.session.commit()
    return jsonify(message="Password has been reset"), 200


@bp.get("/me")
@jwt_required()
def me():
    user = User.query.get_or_404(int(get_jwt_identity()))
    return jsonify(user=user.to_dict()), 200
