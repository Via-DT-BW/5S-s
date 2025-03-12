$(document).ready(function() {
    loadAudits();
});

function fetchAudits() {
    return $.ajax({
        url: "/api/audits",
        type: "GET"
    });
}


function loadAudits() {
    $("#audits-table tbody").html(`
        <tr>
            <td colspan="4" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> Carregando...
            </td>
        </tr>
    `);

    fetchAudits().then(audits => {
        cachedAudits = audits;
        updateAuditsTable(audits);
    });
}

function updateAuditsTable(audits) {
    let tbody = $("#audits-table tbody");
    tbody.empty();

    if (audits.length === 0) {
        tbody.append(`<tr><td colspan="4">Não há auditorias inseridas.</td></tr>`);
        return;
    }

    audits.forEach(audit => {
        console.log(audit);
        tbody.append(`
            <tr>
                <td>${audit.name}</td>
                <td>${audit.audit_type}</td>
                <td>${audit.spaces_count}</td>
                <td>${audit.users_count}</td>
                <td class="table-options">
                    <button class="btn btn-secondary edit-audit-btn" 
                        data-id="${audit.id}" 
                        data-name="${audit.name}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editAuditModal">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger delete-audit-btn" 
                        data-id="${dep.id}" 
                        data-name="${dep.name}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteAuditModal">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}

