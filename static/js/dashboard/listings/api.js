function fetchDepartments() {
    return $.ajax({
        url: "/api/departments",
        type: "GET"
    });
}

function fetchAuditTypes() {
    return $.ajax({
        url: "/api/audit_types",
        type: "GET"
    });
}

function fetchSpaces() {
    return $.ajax({
        url: "/api/spaces",
        type: "GET"
    });
}
