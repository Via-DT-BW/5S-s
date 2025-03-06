from flask import Blueprint, redirect, render_template, url_for

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@bp.route("/")
def home():
    return redirect(url_for("web.dashboard.listings"))


@bp.route("/listings/")
def listings():
    return render_template("dashboard/listings.html", active_page="listings")


@bp.route("/audits/")
def audits():
    return render_template("dashboard/audits/audits.html", activate_page="audits")
