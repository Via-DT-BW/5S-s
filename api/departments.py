from flask import Blueprint, jsonify, request
import pyodbc

from utils.call_conn import db_conn

bp = Blueprint("departments", __name__)


@bp.route("/departments", methods=["GET"])
def get_departments():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                d.id, 
                d.name AS department_name, 
                a.name AS audit_type,
                COUNT(u.id) AS user_count,
                COUNT(s.id) AS space_count
            FROM 
                departments d
            JOIN 
                audit_types a ON d.audit_type = a.id
            LEFT JOIN 
                users u ON d.id = u.department
            LEFT JOIN
                spaces s ON d.id = s.department
            GROUP BY 
                d.id, d.name, a.name;
        """)

        departments = [
            {
                "id": dep.id,
                "name": dep.department_name,
                "audit_type": dep.audit_type,
                "users_count": dep.user_count,
                "spaces_count": dep.space_count,
            }
            for dep in cursor.fetchall()
        ]
        return departments

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/department", methods=["POST"])
def create_department():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        data = request.get_json()
        if not data or "department" not in data or "audit_type" not in data:
            return jsonify(
                {"error": "Missing required fields: 'department' and 'audit_type'"}
            ), 400

        department = data["department"]
        audit_type = data["audit_type"]

        check_query = "SELECT COUNT(name) FROM departments WHERE name=?"
        cursor.execute(check_query, department)
        if cursor.fetchone()[0] > 0:
            return jsonify({"error": f"Departmento {department} já existe."}), 409

        # TODO: Check if audit type exists

        insert_query = "INSERT INTO departments (name, audit_type) VALUES (?, ?)"
        cursor.execute(insert_query, department, audit_type)
        cursor.commit()

        return jsonify({"department": {"name": department, "audit_type": audit_type}})

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/department/<int:id>", methods=["GET"])
def get_department_by_id(id):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT 
                d.id, 
                d.name AS department_name, 
                a.name AS audit_type,
                COUNT(u.id) AS user_count,
                COUNT(s.id) AS space_count
            FROM 
                departments d
            JOIN 
                audit_types a ON d.audit_type = a.id
            LEFT JOIN 
                users u ON d.id = u.department
            LEFT JOIN
                spaces s ON d.id = s.department
            WHERE d.id = ?
            GROUP BY 
                d.id, d.name, a.name;
        """,
            id,
        )

        dep = cursor.fetchone()
        if not dep:
            return jsonify({"error": "Departamento não encontrado."}), 404

        department = {
            "id": dep.id,
            "name": dep.department_name,
            "audit_type": dep.audit_type,
            "users_count": dep.user_count,
            "spaces_count": dep.space_count,
        }

        return department

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/department/<int:id>", methods=["DELETE"])
def delete_department(id):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM departments WHERE id = ?", id)
        if not cursor.fetchone():
            return jsonify({"error": "Departamento não encontrado."}), 404

        cursor.execute("DELETE FROM departments WHERE id = ?", id)
        cursor.commit()

        return jsonify({"message": f"Departamento {id} deletado com sucesso."}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/department/<int:id>", methods=["PUT"])
def update_department(id):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        data = request.get_json()
        if not data or "department" not in data or "audit_type" not in data:
            return jsonify(
                {"error": "Missing required fields: 'department' and 'audit_type'"}
            ), 400

        new_name = data["department"]
        new_audit_type = data["audit_type"]

        cursor.execute("SELECT id FROM departments WHERE id = ?", id)
        if not cursor.fetchone():
            return jsonify({"error": "Departamento não encontrado."}), 404

        cursor.execute(
            """
            UPDATE departments
            SET name = ?, audit_type = ?
            WHERE id = ?
        """,
            new_name,
            new_audit_type,
            id,
        )
        cursor.commit()

        return jsonify({"message": f"Departamento {id} atualizado com sucesso."}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()
