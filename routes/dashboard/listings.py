import pyodbc
from flask import Blueprint, jsonify, render_template

from utils.call_conn import db_conn

bp = Blueprint("listings", __name__)


@bp.route("/dashboard/listings/")
def index():
    departments = get_departments()
    spaces = get_spaces()
    audit_types = get_audit_types()
    return render_template(
        "dashboard/listings.html",
        active_page="listings",
        departments=departments,
        spaces=spaces,
        audit_types=audit_types,
    )


# API
@bp.route("/api/departments", methods=["GET"])
def get_departments():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                d.id, 
                d.name AS department_name, 
                a.name AS audit_type,
                COUNT(u.id) AS user_count
            FROM 
                departments d
            JOIN 
                audit_types a ON d.audit_type = a.id
            LEFT JOIN 
                users u ON d.id = u.department
            GROUP BY 
                d.id, d.name, a.name;
        """)

        departments = [
            {
                "id": dep.id,
                "name": dep.department_name,
                "audit_type": dep.audit_type,
                "users_count": dep.user_count,
            }
            for dep in cursor.fetchall()
        ]
        return departments

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500
    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()


@bp.route("/api/spaces", methods=["GET"])
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


@bp.route("/api/audit_types", methods=["GET"])
def get_audit_types():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM audit_types")

        audit_types = [
            {
                "id": audit_type.id,
                "name": audit_type.name,
            }
            for audit_type in cursor.fetchall()
        ]

        return audit_types

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()
