from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash, generate_password_hash

from .utils import execute_query, fetch_one, validate_json_fields

bp = Blueprint("auth", __name__)


@bp.route("/password", methods=["PUT"])
def update_password():
    data = request.get_json()
    err = validate_json_fields(data, {"current": str, "new": str})
    if err:
        return err

    curr = data["current"]
    new = data["new"]

    session_user = fetch_one(
        "SELECT password FROM users WHERE id=? and enabled=1", (session["id"])
    )
    if session_user is None:
        return jsonify({"error": "Sessão inválida"}), 401

    stored_hashed_password = session_user[0]

    if not check_password_hash(stored_hashed_password, curr):
        return jsonify({"error": "Esta não é a sua palavra-passe atual"}), 401

    try:
        execute_query(
            "UPDATE users SET password=? WHERE id=?",
            (generate_password_hash(new), session["id"]),
        )
    except Exception as e:
        return jsonify(
            {"error": "Erro ao atualizar a password.", "details": str(e)}
        ), 500

    return jsonify({"success": "A sua password foi atualizada com sucesso."})


@bp.route("/session", methods=["GET"])
def get_session():
    return jsonify(dict(session))


@bp.route("/session", methods=["PUT"])
def update_session():
    data = request.get_json()
    err = validate_json_fields(data, {"username": str, "email": str, "department": int})
    if err:
        return err

    id = session["id"]
    if not id:
        return jsonify({"error": f"Utilizador #{id} não autenticado."}), 401

    username = data["username"]
    email = data["email"]
    department = data["department"]

    if fetch_one("SELECT 1 FROM users WHERE username=? AND id<>?", (username, id)):
        return jsonify({"error": "Este utilizador já foi escolhido."}), 400

    if fetch_one("SELECT 1 FROM users WHERE email=? AND id<>?", (email, id)):
        return jsonify({"error": "Este e-mail já foi escolhido."}), 400

    if not fetch_one("SELECT 1 FROM departments WHERE id=?", (department,)):
        return jsonify({"error": "O departamento selecionado não é válido."}), 400

    try:
        execute_query(
            "UPDATE users SET username=?, email=?, department=? WHERE id=?",
            (username, email, department, id),
        )
    except Exception as e:
        return jsonify({"error": "Erro ao atualizar o perfil.", "details": str(e)}), 500

    session["username"] = username
    session["email"] = email
    session["department"] = department

    return jsonify(
        {
            "success": "O seu perfil foi atualizado com sucesso.",
            "session": {
                "id": id,
                "username": username,
                "email": email,
                "department": department,
            },
        }
    )


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    err = validate_json_fields(data, {"email": str, "password": str})
    if err:
        return err

    email = data["email"]
    password = data["password"]

    user = fetch_one(
        "SELECT id, username, password, is_admin, department FROM users WHERE email=? AND enabled=1",
        (email,),
    )

    if not user:
        return jsonify({"error": "Credenciais inválidas."}), 401

    id, username, stored_hashed_password, admin, department = user

    if not check_password_hash(stored_hashed_password, password):
        return jsonify({"error": "Credenciais inválidas"}), 401

    session["id"] = id
    session["username"] = username
    session["email"] = email
    session["admin"] = admin
    session["department"] = department

    return jsonify({"message": "Login successful"}), 200


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    err = validate_json_fields(data, {"username": str, "email": str, "password": str})
    if err:
        return err

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
    return jsonify({"message": "Sessão terminada com sucesso."}), 200


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
