from flask import Blueprint, redirect, render_template, session, url_for

from api.auth import logout


bp = Blueprint("profile", __name__, url_prefix="/profile")


@bp.route("/")
def home():
    if ("id" in session) is False:
        logout()
        return redirect(url_for("web.home.home"))

    return render_template("dashboard/profile/profile.html")
