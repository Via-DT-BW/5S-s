from flask import Blueprint

from .departments import bp as departments_bp
from .spaces import bp as spaces_bp
from .audit_types import bp as audit_types_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")

api_bp.register_blueprint(departments_bp)
api_bp.register_blueprint(spaces_bp)
api_bp.register_blueprint(audit_types_bp)
