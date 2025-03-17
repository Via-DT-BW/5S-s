from flask import Blueprint

from .departments import bp as departments_bp
from .spaces import bp as spaces_bp
from .audits import bp as audits_bp
from .audit_types import bp as audit_types_bp
from .users import bp as users_bp
from .auth import bp as auth_bp
from .audit_checklist import bp as audit_checklist_bp

api_bp = Blueprint("api", __name__, url_prefix="/api")

api_bp.register_blueprint(departments_bp)
api_bp.register_blueprint(spaces_bp)
api_bp.register_blueprint(audits_bp)
api_bp.register_blueprint(audit_types_bp)
api_bp.register_blueprint(auth_bp)
api_bp.register_blueprint(users_bp)
api_bp.register_blueprint(audit_checklist_bp)
