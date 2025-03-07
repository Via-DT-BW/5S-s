from flask import Blueprint, render_template

bp = Blueprint("auth", __name__)


@bp.route("/auth")
def home():
    return render_template("auth/auth.html")
