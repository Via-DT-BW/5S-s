from flask import Blueprint, jsonify

from .utils import fetch_all, fetch_one

bp = Blueprint("users", __name__)


@bp.route("/users", methods=["GET"])
def get_spaces():
    query = """
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.is_admin, 
            d.name AS department, 
            COUNT(a.id) AS audit_count
        FROM users u
        LEFT JOIN departments d ON u.department = d.id
        LEFT JOIN audits a ON u.id = a.signed
        WHERE u.enabled = 1
        GROUP BY u.id, u.username, u.email, u.is_admin, d.name
    """

    users = fetch_all(query)

    return jsonify(
        [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_admin,
                "department": user.department,
                "audit_count": user.audit_count,
            }
            for user in users
        ]
    )


@bp.route("/user/<int:id>", methods=["GET"])
def get_user(id):
    query = """
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.is_admin, 
            d.name AS department, 
            COUNT(a.id) AS audit_count
        FROM users u
        LEFT JOIN departments d ON u.department = d.id
        LEFT JOIN audits a ON u.id = a.signed
        WHERE u.enabled = 1 and u.id=?
        GROUP BY u.id, u.username, u.email, u.is_admin, d.name
    """

    user = fetch_one(query, id)
    if not user:
        return jsonify({"error": f"Utilizador #{id} não encontrado."})

    return jsonify(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "department": user.department,
            "audit_count": user.audit_count,
        }
    )
