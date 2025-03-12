from flask import Blueprint, redirect, render_template, url_for, session

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@bp.route("/")
def home():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))
    if session["admin"] is True:
        return redirect(url_for("web.dashboard.listings"))

    return redirect(url_for("web.dashboard.audits"))


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
