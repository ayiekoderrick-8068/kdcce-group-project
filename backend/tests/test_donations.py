from .conftest import auth_header


def test_public_can_donate_without_account(client):
    r = client.post(
        "/api/donations",
        json={"donor_name": "Jane", "donor_email": "jane@example.com", "amount": 50},
    )
    assert r.status_code == 201
    assert r.get_json()["donation"]["frequency"] == "one-time"


def test_negative_amount_rejected(client):
    r = client.post(
        "/api/donations",
        json={"donor_name": "Jane", "donor_email": "jane@example.com", "amount": -5},
    )
    assert r.status_code == 400


def test_listing_donations_requires_staff_or_admin(client):
    r = client.get("/api/donations")
    assert r.status_code == 401


def test_staff_sees_totals(client, make_staff):
    client.post("/api/donations", json={"donor_name": "A", "donor_email": "a@example.com", "amount": 10})
    client.post("/api/donations", json={"donor_name": "B", "donor_email": "b@example.com", "amount": 15})

    _, token = make_staff()
    r = client.get("/api/donations/totals", headers=auth_header(token))
    assert r.status_code == 200
    assert r.get_json()["count"] == 2
    assert r.get_json()["total_amount"] == 25.0
