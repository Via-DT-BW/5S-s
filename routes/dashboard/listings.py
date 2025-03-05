import pyodbc
from flask import Blueprint, jsonify, render_template, request

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


@bp.route("/api/audit_types")
def get_audit_types():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 
                a.id AS audit_type_id,
                a.name AS audit_type_name,
                c.id AS category_id,
                c.name AS category_name,
                ch.id AS checklist_id,
                ch.factor,
                ch.criteria
            FROM 
                audit_types a
            LEFT JOIN 
                categories c ON a.id = c.audit_type
            LEFT JOIN 
                checklists ch ON c.id = ch.category
            ORDER BY 
                a.id, c.id, ch.id;
        """)

        results = cursor.fetchall()

        audit_types_dict = {}

        for row in results:
            audit_id = row.audit_type_id
            cat_id = row.category_id
            chk_id = row.checklist_id

            if audit_id not in audit_types_dict:
                audit_types_dict[audit_id] = {
                    "id": audit_id,
                    "name": row.audit_type_name,
                    "categories": {},
                }

            audit = audit_types_dict[audit_id]

            if cat_id and cat_id not in audit["categories"]:
                audit["categories"][cat_id] = {
                    "id": cat_id,
                    "name": row.category_name,
                    "checklists": [],
                }

            category = audit["categories"][cat_id]

            if chk_id:
                category["checklists"].append(
                    {"id": chk_id, "factor": row.factor, "criteria": row.criteria}
                )

        response_data = list(audit_types_dict.values())

        return response_data

    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()


@bp.route("/api/department", methods=["POST"])
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
            return jsonify({"error": f"Department {department} already exists."}), 409

        insert_query = "INSERT INTO departments (name, audit_type) VALUES (?, ?)"
        cursor.execute(insert_query, department, audit_type)
        cursor.commit()

        return jsonify({"department": {"name": department, "audit_type": audit_type}})

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()
