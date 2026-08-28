from flask_jwt_extended import create_access_token, create_refresh_token

from ..extensions import db
from ..models.user import User
from ..models.volunteer import VolunteerProfile


class AuthError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def register_user(name, email, password):
    """Public self-registration always creates a 'volunteer' — the role is
    never taken from client input here. Promoting someone to staff/admin is
    a separate admin-only action (see routes/users.py)."""
    if User.query.filter_by(email=email).first():
        raise AuthError("An account with this email already exists", 409)

    user = User(name=name, email=email, role="volunteer")
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    profile = VolunteerProfile(user_id=user.id, status="Pending")
    db.session.add(profile)
    db.session.commit()
    return user


def authenticate(email, password):
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        raise AuthError("Invalid email or password", 401)
    if not user.is_active:
        raise AuthError("This account has been deactivated", 403)
    return user


def issue_tokens(user):
    claims = {"role": user.role}
    access_token = create_access_token(identity=str(user.id), additional_claims=claims)
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims=claims)
    return access_token, refresh_token
