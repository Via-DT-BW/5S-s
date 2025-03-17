from flask import Blueprint, jsonify, request

from api.utils import fetch_all, fetch_one, validate_json_fields, execute_query
from utils.utils import format_datetime


bp = Blueprint("audits", __name__)


@bp.route("/audits", methods=["GET"])
def get_audits():
    query = """
        SELECT
            a.id,
            u.username AS signed,
            s.name AS space,
            d.name AS department,
            a.next_date,
            a.created_at,
            a.overall_score,
            a.comments,
            a.completed
        FROM audits a
        LEFT JOIN users u ON a.signed = u.id
        JOIN spaces s ON a.space = s.id
        JOIN departments d ON s.department = d.id
    """

    audits = fetch_all(query)

    return jsonify(
        [
            {
                "id": audit.id,
                "signed": audit.signed,
                "space": audit.space,
                "department": audit.department,
                "next_date": format_datetime(audit.next_date),
                "created_at": format_datetime(audit.created_at),
                "overall_score": audit.overall_score,
                "comments": audit.comments,
                "completed": audit.completed,
            }
            for audit in audits
        ]
    )


@bp.route("/audit/<int:id>", methods=["GET"])
def get_audit(id):
    query = """
        SELECT
            a.id,
            u.username AS signed,
            s.name AS space,
            d.name AS department,
            a.next_date,
            a.created_at,
            a.overall_score,
            a.comments,
            a.completed
        FROM audits a
        LEFT JOIN users u ON a.signed = u.id
        JOIN spaces s ON a.space = s.id
        JOIN departments d ON s.department = d.id
        WHERE a.id = ?
    """

    audit = fetch_one(query, (id))

    if not audit:
        return jsonify({"error": f"Auditoria #{id} não encontrada."})

    return jsonify(
        {
            "id": audit.id,
            "signed": audit.signed,
            "space": audit.space,
            "department": audit.department,
            "next_date": format_datetime(audit.next_date),
            "created_at": format_datetime(audit.created_at),
            "overall_score": audit.overall_score,
            "comments": audit.comments,
            "completed": audit.completed,
        }
    )


@bp.route("/audit", methods=["POST"])
def create_audit():
    data = request.get_json()
    err = validate_json_fields(
        data, {"signed": int, "space": int, "overall_score": int}
    )
    if err:
        return err

    signed = data["signed"]
    space = data["space"]
    overall_score = data["overall_score"]

    if fetch_one("SELECT 1 FROM users WHERE id=?", (signed,)) is None:
        return jsonify({"error": f"Utilizador {signed} não existe."}), 404

    if fetch_one("SELECT 1 FROM spaces WHERE id=?", (space,)) is None:
        return jsonify({"error": f"Espaço {space} não existe."}), 404

    if overall_score < 0 or overall_score > 100:
        return jsonify({"error": f"Resultado final inválido {overall_score}."}), 400

    execute_query(
        "INSERT INTO audits (signed, space, overall_score) VALUES (?, ?, ?)",
        (signed, space, overall_score),
    )

    inserted = fetch_one(
        "SELECT id, signed, space, created_at, next_date, overall_score, comments, completed "
        "FROM audits WHERE signed=? AND space=? ORDER BY created_at DESC",
        (signed, space),
    )

    if inserted is None:
        return jsonify({"error": "Erro ao criar auditoria."}), 500

    audit_dict = {
        "id": inserted[0],
        "signed": inserted[1],
        "space": inserted[2],
        "created_at": inserted[3],
        "next_date": inserted[4],
        "overall_score": inserted[5],
        "comments": inserted[6],
        "completed": bool(inserted[7]),
    }

    return jsonify({"audit": audit_dict}), 201


@bp.route("/audit/<int:id>", methods=["PUT"])
def update_audit(id):
    return jsonify({"audit": {"id": id}})
