from flask import Blueprint, redirect, render_template, session, url_for

bp = Blueprint("auth", __name__)


@bp.route("/auth")
def home():
    if "id" in session:
        return redirect(url_for("web.dashboard.home"))

    return render_template("auth/auth.html")


@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("web.home.home"))
