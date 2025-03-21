from flask import Blueprint, jsonify, request

from api.utils import execute_bulk_insert, fetch_one

bp = Blueprint("audit_checklist", __name__)


@bp.route("/audits/<int:audit_id>/checklist", methods=["POST"])
def create_audit_checklist(audit_id):
    data = request.get_json()

    if not isinstance(data, list) or len(data) == 0:
        return jsonify(
            {"error": "Invalid input. Expecting a list of checklist items."}
        ), 400

    existing_count = fetch_one(
        "SELECT COUNT(*) FROM audit_checklist WHERE audit = ?", (audit_id,)
    )

    if existing_count[0] > 0:
        return jsonify(
            {"error": f"Audit #{audit_id} already has checklist items."}
        ), 400

    audit_type = fetch_one(
        """
        SELECT d.audit_type 
        FROM audits a
        JOIN spaces s ON a.space = s.id
        JOIN departments d ON s.department = d.id
        WHERE a.id = ?
        """,
        (audit_id,),
    )

    if audit_type is None:
        return jsonify({"error": f"Audit #{audit_id} not found."}), 404

    audit_type = audit_type[0]

    expected_checklist_count = fetch_one(
        "SELECT COUNT(*) FROM checklists c JOIN categories cat ON c.category = cat.id WHERE cat.audit_type = ? ",
        (audit_type,),
    )[0]

    if len(data) != expected_checklist_count:
        return jsonify(
            {
                "error": f"Invalid checklist submission. Expected {expected_checklist_count} items, but received {len(data)}."
            }
        ), 400

    checklist_items = []
    for item in data:
        if (
            not isinstance(item, dict)
            or "checklist" not in item
            or "score" not in item
            or "noks" not in item
        ):
            return jsonify(
                {
                    "error": "Each checklist item must have 'checklist' and 'score' fields."
                }
            ), 400

        checklist_id = item["checklist"]
        score = item["score"]
        noks = item["noks"]

        if not isinstance(checklist_id, int) or not isinstance(score, int):
            return jsonify(
                {
                    "error": "Invalid data types. 'checklist' and 'score' must be integers."
                }
            ), 400

        if score < 0 or score > 4:
            return jsonify(
                {"error": f"Invalid score {score}. It must be between 0 and 4."}
            ), 400

        checklist_items.append((audit_id, checklist_id, score, noks))

    execute_bulk_insert(
        "INSERT INTO audit_checklist (audit, checklist, score, noks) VALUES (?, ?, ?, ?)",
        checklist_items,
    )

    return jsonify(
        {
            "message": "Checklist items added successfully.",
            "audit_id": audit_id,
            "items": data,
        }
    ), 201
