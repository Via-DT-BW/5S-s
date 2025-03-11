from flask import Blueprint, request, jsonify

from .utils import execute_query, fetch_all, fetch_one, validate_json_fields

bp = Blueprint("spaces", __name__)


@bp.route("/spaces", methods=["GET"])
def get_spaces():
    query = """
        SELECT
            s.id, s.name, departments.name AS department_name
        FROM spaces s
        JOIN departments ON s.department = departments.id
    """

    spaces = fetch_all(query)

    return jsonify(
        [
            {
                "id": space.id,
                "name": space.name,
                "department": space.department_name,
            }
            for space in spaces
        ]
    )


@bp.route("/space/<int:id>", methods=["GET"])
def get_space(id):
    query = """
        SELECT
            s.id, s.name, departments.name AS department_name
        FROM spaces s
        JOIN departments ON s.department = departments.id
        WHERE s.id = ?
    """

    space = fetch_one(query, id)
    if not space:
        return jsonify({"error": f"Espaço #{id} não encontrado."})

    return jsonify(
        {
            "id": space.id,
            "name": space.name,
            "department": space.department_name,
        }
    )


@bp.route("/space", methods=["POST"])
def create_space():
    data = request.get_json()
    err = validate_json_fields(data, {"name": str, "department": int})
    if err:
        return err

    name = data["name"]
    department = data["department"]

    if space_exists(name):
        return jsonify({"error": f"Espaço {name} já existe."})

    if fetch_one("SELECT 1 FROM departments WHERE id=?", (department)) is None:
        return jsonify({"error": f"Departamento #{department} inválido."})

    execute_query(
        "INSERT INTO spaces (name, department) VALUES (?, ?)",
        (name, department),
    )

    return jsonify({"space": {"name": name, "department": department}})


@bp.route("/space/<int:id>", methods=["PUT"])
def update_space(id):
    data = request.get_json()

    err = validate_json_fields(data, {"name": str, "department": int})
    if err:
        return err

    name = data["name"]
    department = data["department"]

    if fetch_one("SELECT 1 FROM spaces WHERE id = ?", (id)) is None:
        return jsonify({"error": f"Espaço #{id} não encontrado."}), 404

    if fetch_one("SELECT 1 FROM departments WHERE id=?", (department)) is None:
        return jsonify({"error": f"Departamento #{department} inválido."})

    if fetch_one("SELECT 1 FROM spaces WHERE name=? and id !=?", (name, id)):
        return jsonify({"error": f"O espaço {name} já existe."})

    execute_query(
        "UPDATE spaces SET name=?, department=? WHERE id=?",
        (name, department, id),
    )

    return jsonify(
        {
            "message": "Espaço atualizado com sucesso.",
            f"{id}": {
                "name": name,
                "department": department,
            },
        }
    ), 200


@bp.route("/space/<int:id>", methods=["DELETE"])
def delete_space(id):
    if not fetch_one("SELECT id FROM spaces WHERE id=?", (id,)):
        return jsonify({"error": f"Espaço #{id} não encontrado."}), 404

    execute_query("DELETE FROM spaces WHERE id=?", (id))
    return jsonify({"message": f"Espaço #{id} apagado com sucesso"})


# ----------------
# Helper Functions
# ----------------


def space_exists(name):
    return fetch_one("SELECT 1 FROM spaces WHERE name=?", (name))
