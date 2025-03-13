from flask import Blueprint, redirect, render_template, url_for, session

from web.auth import logout

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@bp.route("/")
def index():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))

    return redirect(url_for("web.dashboard.home"))


@bp.route("/home")
def home():
    if "id" not in session:
        logout()

    return render_template("dashboard/home/home.html")


@bp.route("/listings/")
def listings():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))

    if "admin" not in session or session["admin"] is False:
        return redirect(url_for("web.dashboard.audits"))

    return render_template("dashboard/listings.html")


@bp.route("/audits/")
def audits():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))

    return render_template("dashboard/audits/audits.html")
