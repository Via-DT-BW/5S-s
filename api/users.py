from flask import Blueprint, request, jsonify

from .utils import execute_query, fetch_all, fetch_one, validate_json_fields

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


#
#
# @bp.route("/space", methods=["POST"])
# def create_space():
#     data = request.get_json()
#     err = validate_json_fields(data, {"name": str, "department": int})
#     if err:
#         return err
#
#     name = data["name"]
#     department = data["department"]
#
#     if space_exists(name):
#         return jsonify({"error": f"Espaço {name} já existe."})
#
#     if fetch_one("SELECT 1 FROM departments WHERE id=?", (department)) is None:
#         return jsonify({"error": f"Departamento #{department} inválido."})
#
#     execute_query(
#         "INSERT INTO spaces (name, department) VALUES (?, ?)",
#         (name, department),
#     )
#
#     return jsonify({"space": {"name": name, "department": department}})
#
#
# @bp.route("/space/<int:id>", methods=["PUT"])
# def update_space(id):
#     data = request.get_json()
#
#     err = validate_json_fields(data, {"name": str, "department": int})
#     if err:
#         return err
#
#     name = data["name"]
#     department = data["department"]
#
#     if fetch_one("SELECT 1 FROM spaces WHERE id = ?", (id)) is None:
#         return jsonify({"error": f"Espaço #{id} não encontrado."}), 404
#
#     if fetch_one("SELECT 1 FROM departments WHERE id=?", (department)) is None:
#         return jsonify({"error": f"Departamento #{department} inválido."})
#
#     if fetch_one("SELECT 1 FROM spaces WHERE name=? and id !=?", (name, id)):
#         return jsonify({"error": f"O espaço {name} já existe."})
#
#     execute_query(
#         "UPDATE spaces SET name=?, department=? WHERE id=?",
#         (name, department, id),
#     )
#
#     return jsonify(
#         {
#             "message": "Espaço atualizado com sucesso.",
#             f"{id}": {
#                 "name": name,
#                 "department": department,
#             },
#         }
#     ), 200
#
#
# @bp.route("/space/<int:id>", methods=["DELETE"])
# def delete_space(id):
#     if not fetch_one("SELECT id FROM spaces WHERE id=?", (id,)):
#         return jsonify({"error": f"Espaço #{id} não encontrado."}), 404
#
#     execute_query("DELETE FROM spaces WHERE id=?", (id))
#     return jsonify({"message": f"Espaço #{id} apagado com sucesso"})
#
#
# # ----------------
# # Helper Functions
# # ----------------
#
#
# def space_exists(name):
#     return fetch_one("SELECT 1 FROM spaces WHERE name=?", (name))
#
