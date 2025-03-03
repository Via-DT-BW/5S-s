import pyodbc
from flask import Blueprint, jsonify, redirect, render_template, url_for

from utils.call_conn import db_conn
from utils.utils import format_datetime

bp = Blueprint("audits", __name__)


@bp.route("/dashboard/audits/")
def index():
    audits = get_audits()
    return render_template(
        "dashboard/audits/audits.html",
        active_page="audits",
        audits=audits,
    )


@bp.route("/dashboard/audit/<int:id>")
def show_audit(id):
    audit = get_audit(id)
    if audit:
        print(audit)
        return render_template(
            "dashboard/audits/show_audit.html",
            active_page="audits",
            audit=audit,
        )
    else:
        return redirect_audit_to_audits()


@bp.route("/dashboard/audit/")
def redirect_audit_to_audits():
    return redirect(url_for("audits.index"))


@bp.route("/api/audits/", methods=["GET"])
def get_audits():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
            a.id,
            s.name,
            a.signedBy,
            a.nextDate,
            a.createdAt
        FROM 
            audits a
        JOIN 
            spaces s ON a.space = s.id;
        """)

        audits = [
            {
                "id": audit.id,
                "space": audit.name,
                "signed_by": audit.signedBy,
                "next_date": format_datetime(audit.nextDate),
                "created_at": format_datetime(audit.createdAt),
            }
            for audit in cursor.fetchall()
        ]
        return audits

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()


@bp.route("/api/audit/<int:id>", methods=["GET"])
def get_audit(id):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute(
            """
        SELECT
            a.id,
            s.name,
            a.signedBy,
            a.nextDate,
            a.createdAt
        FROM audits a
        JOIN spaces s ON a.space = s.id
        WHERE a.id = ?
        """,
            (id),
        )

        audit = cursor.fetchone()

        if audit:
            return {
                "id": audit.id,
                "space": audit.name,
                "signed_by": audit.signedBy,
                "next_date": format_datetime(audit.nextDate),  # Format datetime
                "created_at": format_datetime(audit.createdAt),  # Format datetime
            }
        else:
            return jsonify({"error": "Audit not found."})

    except Exception as e:
        print(e)
        return jsonify({"error": f"Ocorreu um erro: {str(e)}"}), 500

    finally:
        if "cursor" in locals() and "conn" in locals():
            cursor.close()
            conn.close()
