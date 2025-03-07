from flask import Blueprint, request, jsonify
import pyodbc

from utils.call_conn import db_conn

bp = Blueprint("spaces", __name__)


@bp.route("/spaces", methods=["GET"])
def get_spaces():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute("""
        SELECT spaces.id, spaces.name, departments.name AS department_name
        FROM spaces
        JOIN departments ON spaces.department = departments.id
        """)

        spaces = [
            {
                "id": space.id,
                "name": space.name,
                "department": space.department_name,
            }
            for space in cursor.fetchall()
        ]

        return spaces

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()


@bp.route("/space", methods=["POST"])
def create_space():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        data = request.get_json()

        if not data or "name" not in data or "department" not in data:
            return jsonify(
                {"error": "Missing required fields: 'name' and 'department'"},
            ), 400

        name = data["name"]
        department = data["department"]

        check_query = "SELECT COUNT(name) FROM spaces WHERE name=?"
        cursor.execute(check_query, name)
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": f"Espaço {name} já existe."}), 409

        insert_query = "INSERT INTO spaces (name, department) VALUES (?, ?)"
        cursor.execute(insert_query, name, department)
        cursor.commit()

        return jsonify({"space": {"name": name, "department": department}})

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()
