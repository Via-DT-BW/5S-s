from flask import Blueprint, redirect, render_template, url_for, session

from web.auth import logout
from .dashboard_audits import bp as dashboard_audits_bp
from .dashboard_user_settings import bp as dashboard_profile_bp

bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

bp.register_blueprint(dashboard_audits_bp)
bp.register_blueprint(dashboard_profile_bp)


@bp.route("/")
def index():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    return redirect(url_for("web.dashboard.home"))


@bp.route("/home")
def home():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    return render_template("dashboard/home/home.html")


@bp.route("/listings/")
def listings():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    if session["admin"] is False:
        return redirect(url_for("web.dashboard.audits"))

    return render_template("dashboard/listings.html")
