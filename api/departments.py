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

        check_name = "SELECT 1 FROM departments WHERE name=?"
        cursor.execute(check_name, department)
        if cursor.fetchone():
            return jsonify({"error": f"Departamento {department} já existe."}), 409

        check_audit_type = "SELECT COUNT(id) FROM audit_types WHERE id=?"
        cursor.execute(check_audit_type, audit_type)
        if cursor.fetchone()[0] == 0:
            return jsonify({"error": "Tipo de Auditoria inválido"}), 400

        insert_query = "INSERT INTO departments (name, audit_type) VALUES (?, ?)"
        cursor.execute(insert_query, department, audit_type)
        conn.commit()

        return jsonify({"department": {"name": department, "audit_type": audit_type}})

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and cursor:
            cursor.close()
        if "conn" in locals() and conn:
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

        return jsonify(
            {"message": f"Departamento #{id} apagado com sucesso com sucesso."}
        ), 200

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
            ), 399

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
