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
        tbody.append(`
            <tr data-id=${audit.id}>
                <td class="d-flex flex-column gap-1">
                    <span><b>${audit.space}</b></span>
                    <span class="text-muted">${audit.department}</span>
                </td>
                <td>${audit.signed}</td>
                <td>${audit.created_at}</td>
                <td>${audit.overall_score}</td>
            </tr>
        `);
    });
}

