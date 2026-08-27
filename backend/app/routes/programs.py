from flask import Blueprint, jsonify, request
from marshmallow import ValidationError

from ..extensions import db
from ..models.program import Program
from ..schemas.program_schema import ProgramSchema, ProgramUpdateSchema
from ..utils.decorators import roles_required
from ..utils.response_helpers import validation_error_response
from ..utils.validators import parse_pagination

bp = Blueprint("programs", __name__, url_prefix="/api/programs")

program_schema = ProgramSchema()
program_update_schema = ProgramUpdateSchema(partial=True)


@bp.get("")
def list_programs():
    page, per_page = parse_pagination(request.args)
    query = Program.query.filter_by(is_published=True).order_by(Program.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    return jsonify(
        programs=[p.to_dict() for p in items],
        pagination={"page": page, "per_page": per_page, "total": total},
    ), 200


@bp.get("/<int:program_id>")
def get_program(program_id):
    program = Program.query.get_or_404(program_id)
    return jsonify(program=program.to_dict()), 200


@bp.post("")
@roles_required("admin", "staff")
def create_program():
    payload = request.get_json(silent=True) or {}
    try:
        data = program_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    if Program.query.filter_by(slug=data["slug"]).first():
        return jsonify(error="A program with this slug already exists"), 409

    program = Program(**data)
    db.session.add(program)
    db.session.commit()
    return jsonify(program=program.to_dict()), 201


@bp.patch("/<int:program_id>")
@roles_required("admin", "staff")
def update_program(program_id):
    program = Program.query.get_or_404(program_id)
    payload = request.get_json(silent=True) or {}
    try:
        data = program_update_schema.load(payload)
    except ValidationError as err:
        return validation_error_response(err)

    for key, value in data.items():
        setattr(program, key, value)
    db.session.commit()
    return jsonify(program=program.to_dict()), 200


@bp.delete("/<int:program_id>")
@roles_required("admin")
def delete_program(program_id):
    program = Program.query.get_or_404(program_id)
    db.session.delete(program)
    db.session.commit()
    return "", 204
