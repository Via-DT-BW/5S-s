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
        let badgeScore = getBadgeScore(audit.overall_score);
        let badgeClass = getBadgeClass(audit.overall_score);

        tbody.append(`
            <tr data-id=${audit.id}>
                <td class="d-flex flex-column">
                    <span><b>${audit.space}</b></span>
                    <small class="text-muted"><i>${audit.department}</i></small>
                </td>
                <td>
                    <div class="position-relative fs-6">
                        <span class="badge ${badgeClass} text-uppercase position-relative">
                            ${badgeScore}
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                                ${audit.overall_score}
                            </span>
                        </span>
                    </div>
                </td>
                <td>${audit.signed}</td>
                <td>${audit.created_at}</td>
            </tr>
        `);
    });
}

function getBadgeScore(score) {
    switch (true) {
        case (score >= 0 && score <= 50):
            return "Péssimo";
        case (score >= 51 && score <= 70):
            return "Mau";
        case (score >= 71 && score <= 80):
            return "Razoável";
        case (score >= 81 && score <= 90):
            return "Bom";
        case (score >= 91 && score <= 100):
            return "Excelente";
        default:
            return "N/A";
    }
}

function getBadgeClass(score) {
    switch (true) {
        case (score >= 0 && score <= 50):
            return "bg-danger";
        case (score >= 51 && score <= 70):
            return "bg-danger-subtle";
        case (score >= 71 && score <= 80):
            return "bg-warning";
        case (score >= 81 && score <= 90):
            return "bg-success-subtle";
        case (score >= 91 && score <= 100):
            return "bg-success";
        default:
            return "bg-secondary";
    }
}
