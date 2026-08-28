from .conftest import auth_header


def test_register_creates_volunteer_role_regardless_of_client_input(client):
    r = client.post(
        "/api/auth/register",
        json={"name": "Grace", "email": "grace@example.com", "password": "password123", "role": "admin"},
    )
    assert r.status_code == 201
    assert r.get_json()["user"]["role"] == "volunteer"


def test_register_duplicate_email_rejected(client, make_user):
    make_user(email="dupe@example.com")
    r = client.post(
        "/api/auth/register",
        json={"name": "Other", "email": "dupe@example.com", "password": "password123"},
    )
    assert r.status_code == 409


def test_login_wrong_password_rejected(client, make_user):
    make_user(email="a@example.com", password="correct-password")
    r = client.post("/api/auth/login", json={"email": "a@example.com", "password": "wrong"})
    assert r.status_code == 401


def test_me_requires_token(client):
    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_me_returns_current_user(client, make_user):
    user, token = make_user()
    r = client.get("/api/auth/me", headers=auth_header(token))
    assert r.status_code == 200
    assert r.get_json()["user"]["email"] == user["email"]


def test_logout_revokes_token(client, make_user):
    _, token = make_user()
    r = client.post("/api/auth/logout", headers=auth_header(token))
    assert r.status_code == 200

    r = client.get("/api/auth/me", headers=auth_header(token))
    assert r.status_code == 401


def test_forgot_password_always_returns_200(client, make_user):
    make_user(email="known@example.com")
    r = client.post("/api/auth/forgot-password", json={"email": "known@example.com"})
    assert r.status_code == 200
    r = client.post("/api/auth/forgot-password", json={"email": "unknown@example.com"})
    assert r.status_code == 200


def test_reset_password_with_valid_token(client, make_user, db):
    from app.models.password_reset_token import PasswordResetToken

    user, _ = make_user(email="reset@example.com", password="old-password1")
    record, raw_token = PasswordResetToken.generate(user["id"])
    db.session.add(record)
    db.session.commit()

    r = client.post(
        "/api/auth/reset-password", json={"token": raw_token, "new_password": "new-password1"}
    )
    assert r.status_code == 200

    r = client.post("/api/auth/login", json={"email": "reset@example.com", "password": "new-password1"})
    assert r.status_code == 200

    r = client.post("/api/auth/reset-password", json={"token": raw_token, "new_password": "another1"})
    assert r.status_code == 400


def test_reset_password_with_invalid_token_rejected(client):
    r = client.post(
        "/api/auth/reset-password", json={"token": "not-a-real-token", "new_password": "whatever1"}
    )
    assert r.status_code == 400
