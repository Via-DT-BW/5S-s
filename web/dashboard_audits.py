from flask import Blueprint, redirect, render_template, session, url_for


bp = Blueprint("audits", __name__, url_prefix="/audits")


@bp.route("/")
def home():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))

    return render_template("dashboard/audits/audits.html")


@bp.route("/new")
def create():
    if "id" not in session:
        return redirect(url_for("web.auth.logout"))

    return render_template("dashboard/audits/create_audit.html")
