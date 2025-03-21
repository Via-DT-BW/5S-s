function fetchData(endpoint, id = null) {
    const url = id ? `/api/${endpoint}/${id}` : `/api/${endpoint}`;
    return $.ajax({ url, type: "GET" });
}

export const fetchDepartments = () => fetchData("departments");
export const fetchAuditTypes = () => fetchData("audit_types");
export const fetchSpaces = () => fetchData("spaces");
export const fetchSession = () => fetchData("session");
export const fetchAudits = () => fetchData("audits");
export const fetchUsers = () => fetchData("users");
export const fetchDepartment = (id) => fetchData("department", id);
export const fetchDepartmentSpaces = (id) => fetchData(`department/${id}/spaces`);
export const fetchDepartmentsSpaces = () => fetchData("departments/spaces");
