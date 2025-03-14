import { fetchAudits } from "../api.js";

let cachedAudits = [];

$(document).ready(function() {
    loadAudits();
});

function loadAudits() {
    $("#audits-table tbody").html(`
        <tr>
            <td colspan="4" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> A carregar...
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
        let badge = getBadge(audit.overall_score)

        tbody.append(`
            <tr data-id=${audit.id}>
                <td class="d-flex flex-column">
                    <span><b>${audit.space}</b></span>
                    <small class="text-muted"><i>${audit.department}</i></small>
                </td>
                <td>
                    <div class="position-relative fs-6">
                        <span class="badge ${badge.class} text-uppercase position-relative">
                            ${badge.score}
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

function getBadge(score) {
    return {
        score: score >= 0 && score <= 50 ? "Péssimo" :
            score >= 51 && score <= 70 ? "Mau" :
                score >= 71 && score <= 80 ? "Razoável" :
                    score >= 81 && score <= 90 ? "Bom" :
                        score >= 91 && score <= 100 ? "Excelente" : "N/A",

        class: score >= 0 && score <= 50 ? "bg-danger" :
            score >= 51 && score <= 70 ? "bg-danger-subtle" :
                score >= 71 && score <= 80 ? "bg-warning" :
                    score >= 81 && score <= 90 ? "bg-success-subtle" :
                        score >= 91 && score <= 100 ? "bg-success" : "bg-secondary"
    };
}
