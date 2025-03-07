$(document).ready(function() {
    loadDepartments();
    loadDepartmentAuditTypes();
    loadSpaces();
    loadAuditTypes();

    $("#refresh-departments-btn").click(loadDepartments);
    $("#refresh-spaces-btn").click(loadSpaces);
});
