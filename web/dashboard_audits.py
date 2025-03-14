from flask import Blueprint, redirect, render_template, session, url_for

from api.auth import logout


bp = Blueprint("audits", __name__, url_prefix="/audits")


@bp.route("/")
def home():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    return render_template("dashboard/audits/audits.html")


@bp.route("/new")
def create():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    return render_template("dashboard/audits/create_audit.html")
