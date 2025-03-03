import json
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
    print(f"Departments: {departments}")
    return render_template(
        "dashboard/listings.html", active_page="listings", departments=departments
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
