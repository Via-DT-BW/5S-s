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
