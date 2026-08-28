from flask import jsonify


def validation_error_response(marshmallow_error):
    """Consistent 400 shape for every marshmallow ValidationError across
    every route — {"error": "...", "details": {field: [messages]}}."""
    return jsonify(error="Validation failed", details=marshmallow_error.messages), 400


def not_found(resource="Resource"):
    return jsonify(error=f"{resource} not found"), 404


def paginated(items, page, per_page, total, key):
    return {
        key: items,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page if per_page else 0,
        },
    }
