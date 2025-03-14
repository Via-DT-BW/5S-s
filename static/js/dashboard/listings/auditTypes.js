import { fetchAuditTypes } from "../api.js";


let cachedAuditTypes = [];

export function loadAuditTypes() {
    $("#audit-types-listing").html(`<div><i class="fa fa-spinner fa-spin"></i> A carregar...</div>`)

    fetchAuditTypes()
        .then(auditTypes => {
            cachedAuditTypes = auditTypes;
            updateAuditTypesAccordion(auditTypes);
        })
        .catch(() => {
            toastr.error("Erro ao carregar os tipos de auditoria.");
        });
}

function updateAuditTypesAccordion(auditTypes) {
    let accordion = $("#audit-types-listing");
    accordion.empty();

    if (auditTypes.length === 0) {
        accordion.append(`<span>Não há tipos de auditoria inseridos</span>`);
        return;
    }

    auditTypes.forEach(auditType => {
        let counter = 1;
        let tableRows = "";

        Object.values(auditType.categories).forEach(category => {
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

        accordion.append(`
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse${auditType.id}"
                        aria-expanded="false"
                        aria-controls="collapse${auditType.id}">
                        ${auditType.name}
                    </button>
                </h2>
                <div id="collapse${auditType.id}" class="accordion-collapse collapse" data-bs-parent="#audit-types-listing">
                    <div class="accordion-body table-responsive">
                        <table class="table table-striped table-bordered table-hover audit-table">
                            <thead class="text-center">
                                <tr>
                                    <th colspan="10" class="text-center">
                                        <h4>Lista de Verificação dos 5S</h4>
                                    </th>
                                </tr>
                                <tr>
                                    <th rowspan="3">5S</th>
                                    <th rowspan="3">Nº</th>
                                    <th rowspan="3">Fator a verificar</th>
                                    <th rowspan="3">Critérios de avaliação</th>
                                    <th colspan="6">Avaliação</th>
                                </tr>
                                <tr>
                                    <th>Nº Não<br>Conformidades</th>
                                    <th>Péssimo</th>
                                    <th>Mau</th>
                                    <th>Razoável</th>
                                    <th>Bom</th>
                                    <th>Excelente</th>
                                </tr>
                                <tr>
                                    <th>5S NOK</th>
                                    <th>0</th>
                                    <th>1</th>
                                    <th>2</th>
                                    <th>3</th>
                                    <th>4</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `);
    });
}
