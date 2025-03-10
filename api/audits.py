import pyodbc
from flask import Blueprint, jsonify

from utils.call_conn import db_conn
from utils.utils import format_datetime


bp = Blueprint("audits", __name__)


@bp.route("/audits", methods=["GET"])
def get_audits():
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()
        cursor.execute("""
        SELECT 
            a.id,
            s.name,
            a.signed,
            a.next_date,
            a.created_at
        FROM 
            audits a
        JOIN 
            spaces s ON a.space = s.id;
        """)

        audits = [
            {
                "id": audit.id,
                "space": audit.name,
                "signed": audit.signed,
                "next_date": format_datetime(audit.next_date),
                "created_at": format_datetime(audit.created_at),
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


@bp.route("/audit/<int:id>", methods=["GET"])
def get_audit(id):
    try:
        conn = pyodbc.connect(db_conn)
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                a.id,
                s.name,
                a.signed,
                a.next_date,
                a.created_at
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
                "signed": audit.signed,
                "next_date": format_datetime(audit.next_date),
                "created_at": format_datetime(audit.created_at),
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
