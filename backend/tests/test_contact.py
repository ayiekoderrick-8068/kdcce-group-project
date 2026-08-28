from .conftest import auth_header


def test_public_can_send_contact_message(client):
    r = client.post(
        "/api/contact-messages",
        json={"name": "Jo", "email": "jo@example.com", "message": "Hello there"},
    )
    assert r.status_code == 201
    assert r.get_json()["message"]["is_read"] is False


def test_listing_messages_requires_staff_or_admin(client):
    r = client.get("/api/contact-messages")
    assert r.status_code == 401


def test_staff_can_mark_message_read(client, make_staff):
    client.post("/api/contact-messages", json={"name": "Jo", "email": "jo@example.com", "message": "Hi"})
    _, token = make_staff()

    r = client.get("/api/contact-messages", headers=auth_header(token))
    message_id = r.get_json()["messages"][0]["id"]

    r = client.patch(
        f"/api/contact-messages/{message_id}", json={"is_read": True}, headers=auth_header(token)
    )
    assert r.status_code == 200
    assert r.get_json()["message"]["is_read"] is True
