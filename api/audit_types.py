from flask import Blueprint

from .utils import fetch_all

bp = Blueprint("audit_types", __name__)


@bp.route("/audit_types")
def get_audit_types():
    query = """
        SELECT 
            a.id AS audit_type_id,
            a.name AS audit_type_name,
            c.id AS category_id,
            c.name AS category_name,
            ch.id AS checklist_id,
            ch.factor,
            ch.criteria
        FROM audit_types a
        LEFT JOIN categories c ON a.id = c.audit_type
        LEFT JOIN checklists ch ON c.id = ch.category
        ORDER BY a.id, c.id, ch.id
    """

    results = fetch_all(query)

    audit_types_dict = {}

    for row in results:
        audit_id = row.audit_type_id
        cat_id = row.category_id
        chk_id = row.checklist_id

        if audit_id not in audit_types_dict:
            audit_types_dict[audit_id] = {
                "id": audit_id,
                "name": row.audit_type_name,
                "categories": {},
            }

        audit = audit_types_dict[audit_id]

        if cat_id and cat_id not in audit["categories"]:
            audit["categories"][cat_id] = {
                "id": cat_id,
                "name": row.category_name,
                "checklists": [],
            }

        category = audit["categories"][cat_id]

        if chk_id:
            category["checklists"].append(
                {"id": chk_id, "factor": row.factor, "criteria": row.criteria}
            )

    response_data = list(audit_types_dict.values())

    return response_data
