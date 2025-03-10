from flask import Blueprint, redirect, render_template, url_for, session

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@bp.route("/")
def home():
    if session["admin"] is True:
        return redirect(url_for("web.dashboard.listings"))

    return redirect(url_for("web.dashboard.audits"))


@bp.route("/listings/")
def listings():
    if session["admin"] is False:
        return redirect(url_for("web.dashboard.audits"))

    return render_template("dashboard/listings.html", active_page="listings")


@bp.route("/audits/")
def audits():
    return render_template("dashboard/audits/audits.html", activate_page="audits")
