from .conftest import auth_header


def _event_payload(start_at="2027-01-01T10:00:00+00:00", capacity=None):
    payload = {"title": "Community Cleanup", "start_at": start_at, "location": "Kisumu"}
    if capacity is not None:
        payload["capacity"] = capacity
    return payload


def test_public_can_list_and_get_event(client, make_staff):
    _, token = make_staff()
    r = client.post("/api/events", json=_event_payload(), headers=auth_header(token))
    assert r.status_code == 201
    event_id = r.get_json()["event"]["id"]

    r = client.get("/api/events")
    assert r.status_code == 200
    assert len(r.get_json()["events"]) == 1

    r = client.get(f"/api/events/{event_id}")
    assert r.status_code == 200


def test_creating_event_requires_staff_or_admin(client, make_user):
    _, token = make_user()
    r = client.post("/api/events", json=_event_payload(), headers=auth_header(token))
    assert r.status_code == 403


def test_update_event_partial(client, make_staff):
    _, token = make_staff()
    r = client.post("/api/events", json=_event_payload(), headers=auth_header(token))
    event_id = r.get_json()["event"]["id"]

    r = client.patch(f"/api/events/{event_id}", json={"location": "Nairobi"}, headers=auth_header(token))
    assert r.status_code == 200
    assert r.get_json()["event"]["location"] == "Nairobi"
