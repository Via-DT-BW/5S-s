import pyodbc
from flask import Blueprint, jsonify, render_template

from utils.call_conn import db_conn

bp = Blueprint("listings", __name__)


@bp.route("/dashboard/listings/")
def index():
    departments = get_departments()
    spaces = get_spaces()
    return render_template(
        "dashboard/listings.html",
        active_page="listings",
        departments=departments,
        spaces=spaces,
    )


# API
@bp.route("/api/departments", methods=["GET"])
def get_departments():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("""SELECT 
            d.id, 
            d.name AS name, 
            a.name AS audit_type
        FROM 
            departments d
        JOIN 
            audit_types a ON d.audit_type = a.id
        """)

        departments = [
            {"id": dep.id, "name": dep.name, "audit_type": dep.audit_type}
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
