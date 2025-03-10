from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from .utils import execute_query, fetch_one, validate_json_fields

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["POST"])
def login():
    err = validate_json_fields({"email": str, "password": str})
    if err:
        return err

    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = fetch_one(
        "SELECT id, username, password, is_admin FROM users WHERE email=? AND enabled=1",
        (email,),
    )

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    id, username, stored_hashed_password, admin = user

    if not check_password_hash(stored_hashed_password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Store user session
    session["id"] = id
    session["username"] = username
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

    conflict = users_exists(username, email)
    if conflict:
        return jsonify({"error": conflict}), 400

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


def users_exists(username, email):
    user = fetch_one(
        "SELECT username, email FROM users WHERE username = ? OR email = ?",
        (username, email),
    )

    if user:
        existing_username, existing_email = user
        if existing_username == username and existing_email == email:
            return "Esta conta já existe"
        elif existing_username == username:
            return "Este nome já está em uso"
        elif existing_email == email:
            return "Este e-mail já está em uso"

    return None


def login_valid(email, password):
    user = fetch_one(
        "SELECT password FROM users WHERE email=? and password=?", (email, password)
    )

    if not user:
        return False

    return True
