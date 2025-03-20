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

export function fetchDepartmentSpaces(id) {
    return $.ajax({
        url: `/api/department/${id}/spaces`,
        type: "GET"
    })
}

export function fetchDepartment(id) {
    return $.ajax({
        url: `/api/department/${id}`,
        type: "GET"
    })
}

export function fetchUsers() {
    return $.ajax({
        url: `/api/users`,
        type: "GET"
    })
}
