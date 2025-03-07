from flask import Blueprint, jsonify, request

from .utils import fetch_all, fetch_one, execute_query

bp = Blueprint("departments", __name__)


@bp.route("/departments", methods=["GET"])
def get_departments():
    query = """
        SELECT 
            d.id, d.name AS department_name, a.name AS audit_type,
            COUNT(u.id) AS user_count, COUNT(s.id) AS space_count
        FROM departments d
        JOIN audit_types a ON d.audit_type = a.id
        LEFT JOIN users u ON d.id = u.department
        LEFT JOIN spaces s ON d.id = s.department
        GROUP BY d.id, d.name, a.name
    """
    departments = fetch_all(query)

    return jsonify(
        [
            {
                "id": dep.id,
                "name": dep.department_name,
                "audit_type": dep.audit_type,
                "users_count": dep.user_count,
                "spaces_count": dep.space_count,
            }
            for dep in departments
        ]
    )


@bp.route("/department", methods=["POST"])
def create_department():
    data = request.get_json()
    if not data or "department" not in data or "audit_type" not in data:
        return jsonify(
            {"error": "Missing required fields: 'department' and 'audit_type'"}
        ), 400

    department = data["department"]
    audit_type = data["audit_type"]

    if department_exists(department):
        return jsonify({"error": f"Departamento {department} já existe."}), 409

    if not audit_type_exists(audit_type):
        return jsonify({"error": "Tipo de Auditoria inválido"}), 400

    execute_query(
        "INSERT INTO departments (name, audit_type) VALUES (?, ?)",
        (department, audit_type),
    )

    return jsonify({"department": {"name": department, "audit_type": audit_type}}), 201


@bp.route("/department/<int:id>", methods=["GET"])
def get_department_by_id(id):
    query = """
        SELECT 
            d.id, d.name AS department_name, a.name AS audit_type,
            COUNT(u.id) AS user_count, COUNT(s.id) AS space_count
        FROM departments d
        JOIN audit_types a ON d.audit_type = a.id
        LEFT JOIN users u ON d.id = u.department
        LEFT JOIN spaces s ON d.id = s.department
        WHERE d.id = ?
        GROUP BY d.id, d.name, a.name
    """
    dep = fetch_one(query, (id,))
    if not dep:
        return jsonify({"error": "Departamento não encontrado."}), 404

    return jsonify(
        {
            "id": dep.id,
            "name": dep.department_name,
            "audit_type": dep.audit_type,
            "users_count": dep.user_count,
            "spaces_count": dep.space_count,
        }
    )


@bp.route("/department/<int:id>", methods=["DELETE"])
def delete_department(id):
    if not fetch_one("SELECT id FROM departments WHERE id = ?", (id,)):
        return jsonify({"error": "Departamento não encontrado."}), 404

    execute_query("DELETE FROM departments WHERE id = ?", (id,))
    return jsonify({"message": f"Departamento #{id} apagado com sucesso."}), 200


@bp.route("/department/<int:id>", methods=["PUT"])
def update_department(id):
    data = request.get_json()
    if not data or "department" not in data or "audit_type" not in data:
        return jsonify(
            {"error": "Missing required fields: 'department' and 'audit_type'"}
        ), 400

    new_name = data["department"]
    new_audit_type = data["audit_type"]

    if not fetch_one("SELECT id FROM departments WHERE id = ?", (id,)):
        return jsonify({"error": "Departamento não encontrado."}), 404

    execute_query(
        "UPDATE departments SET name = ?, audit_type = ? WHERE id = ?",
        (new_name, new_audit_type, id),
    )

    return jsonify({"message": f"Departamento {id} atualizado com sucesso."}), 200


# ----------------
# Helper Functions
# ----------------


def department_exists(name):
    return fetch_one("SELECT 1 FROM departments WHERE name=?", (name,))


def audit_type_exists(audit_type_id):
    result = fetch_one("SELECT COUNT(id) FROM audit_types WHERE id=?", (audit_type_id,))
    return result and result[0] > 0
