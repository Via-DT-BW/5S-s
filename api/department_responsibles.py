from flask import Blueprint, jsonify, request

from api.utils import execute_bulk_insert, fetch_all, fetch_one


bp = Blueprint("department_responsibles", __name__)


@bp.route("/department/<int:department>/responsibles", methods=["POST"])
def create_department_responsibles(department):
    if fetch_one("SELECT 1 FROM departments WHERE id=?", (department,)) is None:
        return jsonify({"error": "Departamento inválido."}), 400

    data = request.get_json()

    if (
        not isinstance(data, dict)
        or "responsibles" not in data
        or not isinstance(data["responsibles"], list)
    ):
        return jsonify(
            {
                "error": "Invalid input. Expecting a JSON object with a 'responsibles' list."
            }
        ), 400

    responsibles = data["responsibles"]

    if not all(isinstance(user_id, int) for user_id in responsibles):
        return jsonify(
            {"error": "Todos os IDs dos responsáveis têm de ser inteiros."}
        ), 400

    if len(responsibles) == 0:
        return jsonify({"error": "A lista 'responsibles' não pode estar vazia."}), 400

    placeholders = ",".join("?" * len(responsibles))
    existing_users = fetch_all(
        f"SELECT id FROM users WHERE id IN ({placeholders})", tuple(responsibles)
    )
    existing_user_ids = {user[0] for user in existing_users}

    invalid_users = [
        user_id for user_id in responsibles if user_id not in existing_user_ids
    ]
    if invalid_users:
        return jsonify(
            {"error": "Utilizadores inválidos.", "invalid_users": invalid_users}
        ), 400

    existing_pairs = fetch_all(
        f"SELECT responsible FROM department_responsibles WHERE department = ? AND responsible IN ({placeholders})",
        (department, *existing_user_ids),
    )
    existing_responsibles = {row[0] for row in existing_pairs}

    new_responsibles = existing_user_ids - existing_responsibles

    if not new_responsibles:
        return jsonify(
            {
                "message": "Todos os responsáveis já estão encarregados de algum departamento."
            }
        ), 200

    values = [(department, user_id) for user_id in existing_user_ids]
    execute_bulk_insert(
        "INSERT INTO department_responsibles (department, responsible) VALUES (?, ?)",
        values,
    )

    return jsonify(
        {
            "success": f"Responsáveis do Departamento #{department} inseridos com sucesso.",
            "responsibles": list(existing_user_ids),
        }
    ), 201
