export function fetchDepartments() {
    return $.ajax({
        url: "/api/departments",
        type: "GET"
    });
}

export function fetchAuditTypes() {
    return $.ajax({
        url: "/api/audit_types",
        type: "GET"
    });
}

export function fetchSpaces() {
    return $.ajax({
        url: "/api/spaces",
        type: "GET"
    });
}

export function fetchSession() {
    return $.ajax({
        url: "/api/session",
        type: "GET"
    })
}

export function fetchAudits() {
    return $.ajax({
        url: "/api/audits",
        type: "GET"
    });
}
