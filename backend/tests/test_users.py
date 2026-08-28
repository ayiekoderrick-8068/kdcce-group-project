from .conftest import auth_header


def test_list_users_requires_admin(client, make_user):
    _, token = make_user()
    r = client.get("/api/users", headers=auth_header(token))
    assert r.status_code == 403


def test_admin_can_list_users(client, make_admin):
    _, token = make_admin()
    r = client.get("/api/users", headers=auth_header(token))
    assert r.status_code == 200
    assert r.get_json()["pagination"]["total"] >= 1


def test_admin_can_promote_user_role(client, make_admin, make_user):
    _, admin_token = make_admin()
    user, _ = make_user(email="promote-me@example.com")

    r = client.patch(
        f"/api/users/{user['id']}/role", json={"role": "staff"}, headers=auth_header(admin_token)
    )
    assert r.status_code == 200
    assert r.get_json()["user"]["role"] == "staff"


def test_staff_cannot_promote_user_role(client, make_staff, make_user):
    _, staff_token = make_staff()
    user, _ = make_user(email="target@example.com")

    r = client.patch(
        f"/api/users/{user['id']}/role", json={"role": "admin"}, headers=auth_header(staff_token)
    )
    assert r.status_code == 403
