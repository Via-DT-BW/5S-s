import { loadDepartments, loadDepartmentAuditTypes } from "./departments.js";
import { loadAuditTypes } from "./auditTypes.js";
import { loadSpaces } from "./spaces.js";

$(document).ready(function() {
    loadDepartments();
    loadDepartmentAuditTypes();
    loadSpaces();
    loadAuditTypes();

    // $("#refresh-departments-btn").click(loadDepartments);
    // $("#refresh-spaces-btn").click(loadSpaces);
});
