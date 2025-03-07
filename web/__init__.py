from flask import Blueprint, redirect, url_for

from .home import bp as home_bp
from .dashboard import bp as dashboard_bp

web_bp = Blueprint("web", __name__)

web_bp.register_blueprint(home_bp)
web_bp.register_blueprint(dashboard_bp)


@web_bp.route("/")
def index():
    return redirect(url_for("web.home.home"))
