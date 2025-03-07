from flask import Blueprint, jsonify, request

from .utils import fetch_all, fetch_one, execute_query

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["GET"])
def login():
    return jsonify({"state": "in progress"})


@bp.route("/register", methods=["POST"])
def register():
    return jsonify({"state": "in progress"})
