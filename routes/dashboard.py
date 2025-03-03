import pyodbc
from flask import Blueprint, jsonify, render_template

from utils.call_conn import db_conn

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard/statistics")
def statistics():
    return render_template("dashboard/statistics.html", active_page="statistics")


@bp.route("/dashboard/listings/")
def index():
    departments = get_departments()
    spaces = get_spaces(departments)
    sheets = get_sheets(spaces)
    return render_template(
        "dashboard/listings.html",
        active_page="listings",
        departments=departments,
        spaces=spaces,
        sheets=sheets,
    )


@bp.route("/api/departments", methods=["GET"])
def get_departments():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM departments")

        departments = [{"id": dep.id, "name": dep.name} for dep in cursor.fetchall()]
        return departments

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/api/spaces", methods=["GET"])
def get_spaces(departments):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        dep_dict = {dep["id"]: dep["name"] for dep in departments}

        # Fetch spaces
        cursor.execute("SELECT id, name, department FROM spaces")
        spaces = [
            {
                "id": space.id,
                "name": space.name,
                "department": dep_dict.get(space.department, "Unknown"),
            }
            for space in cursor.fetchall()
        ]

        return spaces

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()


@bp.route("/api/sheets/", methods=["GET"])
def get_sheets(spaces):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        space_dict = {space["id"]: space["name"] for space in spaces}

        cursor.execute("SELECT id, space, createdAt, signedBy, nextDate from sheets")
        sheets = [
            {
                "id": sheet.id,
                "space": space_dict.get(sheet.space, "Unknown"),
                "created_at": sheet.createdAt,
                "signed_by": sheet.signedBy,
                "next_date": sheet.nextDate,
            }
            for sheet in cursor.fetchall()
        ]
        return sheets

    except Exception as e:
        print(e)
        return jsonify({"error", f"Ocorreu um erro: {str(e)}"}), 500
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()
