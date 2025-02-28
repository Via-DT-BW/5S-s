from flask import Blueprint, render_template

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard/statistics")
def statistics():
    return render_template("dashboard/statistics.html", active_page="statistics")


@bp.route("/dashboard/listings/")
def index():
    return render_template("dashboard/list_all.html", active_page="list_all")
