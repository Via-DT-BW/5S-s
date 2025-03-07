from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from .utils import fetch_one

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["GET"])
def login():
    data = request.get_json()
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Required fields: 'email' and 'password'"}), 400

    email = data["email"]
    password = data["password"]

    user = fetch_one("SELECT id, password FROM users WHERE email=?", (email,))

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    stored_hashed_password = user["password"]

    if not check_password_hash(stored_hashed_password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Store user session
    session["user_id"] = user["id"]
    session["email"] = email

    return jsonify({"message": "Login successful"}), 200


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if (
        not data
        or "username" not in data
        or "email" not in data
        or "password" not in data
    ):
        return jsonify(
            {"error": "Required fields: 'username' and 'email' and 'password'."}
        ), 400

    username = data["username"]
    email = data["email"]
    password = data["password"]

    hashed_password = generate_password_hash(password)

    fetch_one(
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


def login_valid(email, password):
    user = fetch_one(
        "SELECT password FROM users WHERE email=? and password=?", (email, password)
    )
    if not user:
        return False

    return True
