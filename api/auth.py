from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from .utils import execute_query, fetch_one, validate_json_fields

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["GET"])
def login():
    err = validate_json_fields({"email": str, "password": str})
    if err:
        return err

    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = fetch_one(
        "SELECT id, password, is_admin FROM users WHERE email=? AND enabled=1",
        (email,),
    )

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    user_id, stored_hashed_password, admin = user

    if not check_password_hash(stored_hashed_password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Store user session
    session["id"] = user_id
    session["email"] = email
    session["admin"] = admin

    return jsonify({"message": "Login successful"}), 200


@bp.route("/register", methods=["POST"])
def register():
    err = validate_json_fields({"username": str, "email": str, "password": str})
    if err:
        return err

    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]

    hashed_password = generate_password_hash(password)

    if register_invalid(username, email):
        return jsonify({"error": "Este utilizador já existe."}), 400

    execute_query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        (username, email, hashed_password),
    )

    return jsonify(
        {
            "message": f"Utilizador {username} criado com sucesso.",
        }
    ), 201


@bp.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return jsonify({"message": "Logout successful"}), 200


# ----------------
# Helper functions
# ----------------


def register_invalid(username, email):
    user = fetch_one(
        "SELECT 1 FROM users WHERE username=? AND email=?", (username, email)
    )

    if user:
        return True

    return False


def login_valid(email, password):
    user = fetch_one(
        "SELECT password FROM users WHERE email=? and password=?", (email, password)
    )
    if not user:
        return False

    return True
