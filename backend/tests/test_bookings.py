from .conftest import auth_header


def _create_event(client, token, capacity=1):
    r = client.post(
        "/api/events",
        json={"title": "Small Workshop", "start_at": "2027-02-01T09:00:00+00:00", "capacity": capacity},
        headers=auth_header(token),
    )
    return r.get_json()["event"]["id"]


def test_public_can_book_an_event(client, make_staff):
    _, staff_token = make_staff()
    event_id = _create_event(client, staff_token, capacity=5)

    r = client.post(
        "/api/bookings",
        json={"event_id": event_id, "full_name": "Sam", "email": "sam@example.com", "number_of_seats": 2},
    )
    assert r.status_code == 201
    assert r.get_json()["booking"]["status"] == "Pending"


def test_booking_over_capacity_rejected(client, make_staff):
    _, staff_token = make_staff()
    event_id = _create_event(client, staff_token, capacity=1)

    client.post(
        "/api/bookings",
        json={"event_id": event_id, "full_name": "Sam", "email": "sam@example.com", "number_of_seats": 1},
    )
    r = client.post(
        "/api/bookings",
        json={"event_id": event_id, "full_name": "Alex", "email": "alex@example.com", "number_of_seats": 1},
    )
    assert r.status_code == 409


def test_staff_can_confirm_booking(client, make_staff):
    _, staff_token = make_staff()
    event_id = _create_event(client, staff_token, capacity=5)
    r = client.post(
        "/api/bookings",
        json={"event_id": event_id, "full_name": "Sam", "email": "sam@example.com"},
    )
    booking_id = r.get_json()["booking"]["id"]

    r = client.patch(
        f"/api/bookings/{booking_id}/status", json={"status": "Confirmed"}, headers=auth_header(staff_token)
    )
    assert r.status_code == 200
    assert r.get_json()["booking"]["status"] == "Confirmed"
