from .conftest import auth_header


def _program_payload(slug="feeding-program"):
    return {"title": "Feeding Program", "slug": slug, "summary": "Meals for elders"}


def test_public_can_list_programs(client):
    r = client.get("/api/programs")
    assert r.status_code == 200
    assert r.get_json()["programs"] == []


def test_creating_program_requires_staff_or_admin(client, make_user):
    _, token = make_user()
    r = client.post("/api/programs", json=_program_payload(), headers=auth_header(token))
    assert r.status_code == 403


def test_staff_can_create_and_public_can_read_it(client, make_staff):
    _, token = make_staff()
    r = client.post("/api/programs", json=_program_payload(), headers=auth_header(token))
    assert r.status_code == 201
    program_id = r.get_json()["program"]["id"]

    r = client.get(f"/api/programs/{program_id}")
    assert r.status_code == 200
    assert r.get_json()["program"]["title"] == "Feeding Program"


def test_duplicate_slug_rejected(client, make_staff):
    _, token = make_staff()
    client.post("/api/programs", json=_program_payload("same-slug"), headers=auth_header(token))
    r = client.post("/api/programs", json=_program_payload("same-slug"), headers=auth_header(token))
    assert r.status_code == 409


def test_only_admin_can_delete_program(client, make_staff, make_admin):
    _, staff_token = make_staff()
    r = client.post("/api/programs", json=_program_payload(), headers=auth_header(staff_token))
    program_id = r.get_json()["program"]["id"]

    r = client.delete(f"/api/programs/{program_id}", headers=auth_header(staff_token))
    assert r.status_code == 403

    _, admin_token = make_admin()
    r = client.delete(f"/api/programs/{program_id}", headers=auth_header(admin_token))
    assert r.status_code == 204
