from flask import jsonify, request
import pyodbc
from utils.call_conn import db_conn


def get_db_connection():
    """Create and return a new database connection and cursor."""
    conn = pyodbc.connect(db_conn)
    return conn, conn.cursor()


def fetch_one(query, params=()):
    """Helper function to execute a query and fetch one result."""
    conn, cursor = get_db_connection()
    try:
        cursor.execute(query, params)
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()


def fetch_all(query, params=()):
    """Helper function to execute a query and fetch all results."""
    conn, cursor = get_db_connection()
    try:
        cursor.execute(query, params)
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()


def execute_query(query, params=()):
    """Helper function to execute insert, update, or delete queries."""
    conn, cursor = get_db_connection()
    try:
        cursor.execute(query, params)
        conn.commit()
    finally:
        cursor.close()
        conn.close()


def validate_json_fields(required_fields):
    """Validate incoming JSON request data against required fields and types."""
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid or missing JSON body."}), 400

    missing_fields = {
        field: expected_type.__name__
        for field, expected_type in required_fields.items()
        if field not in data
    }

    if missing_fields:
        return jsonify(
            {"error": "There are missing fields.", "required_fields": missing_fields}
        ), 400

    return None
