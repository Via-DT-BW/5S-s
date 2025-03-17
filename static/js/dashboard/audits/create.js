import { fetchDepartmentSpaces, fetchSession, fetchDepartment, fetchAuditTypes } from "../api.js";

$(document).ready(function() {
    fetchSession().then(user => {
        fetchDepartment(user.department).then(dep => {
            user["department_name"] = dep["name"];

            fetchAndPopulateSpaces(user.department);
            $("#departmentField").val(user.department_name);

            fetchAndPopulateAuditTable(dep)
        });
    });
});

function populateAuditTable(auditType) {
    let audit = auditType[0];
    let counter = 1;
    let tableRows = "";

    Object.values(audit.categories).forEach(category => {
        category.checklists.forEach((checklist, index) => {
            tableRows += `
                <tr>
                    ${index === 0 ? `<td rowspan="${category.checklists.length}" class="vertical-text">${category.name}</td>` : ""}
                    <td class="text-center"><b>${counter}</b></td>
                    <td>${checklist.factor}</td>
                    <td>${checklist.criteria}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            `;
            counter++;
        });
    });
    $("#audit-table tbody").html(tableRows)
}

function fetchAndPopulateAuditTable(dep) {
    fetchAuditTypes().then(auditTypes => {
        const auditType = auditTypes.filter(auditType => auditType.name !== dep.audit_type);

        populateAuditTable(auditType)
    });
}

function fetchAndPopulateSpaces(departmentId) {
    let spaceField = $("#spaceField");
    let loading = $("<div class='spinner'></div>").text("A carregar...");

    spaceField.after(loading);

    fetchDepartmentSpaces(departmentId).then(spaces => {
        spaceField.empty();
        spaces.forEach(space => {
            spaceField.append(new Option(space.name, space.id));
        });
    }).always(() => {
        loading.remove();
    });
}

