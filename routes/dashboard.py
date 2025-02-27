from flask import Blueprint, render_template

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard/")
def index():
    return render_template("dashboard/example.html")
