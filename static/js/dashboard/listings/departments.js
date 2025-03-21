import { fetchAuditTypes, fetchDepartments } from "../api.js";
import { renderAvatar } from "../utils.js";

export let cachedDepartments = [];
export let cachedAuditTypes = [];

export function loadDepartments() {
    $("#departments-table tbody").html(`
        <tr>
            <td colspan="5" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> A carregar...
            </td>
        </tr>
    `);

    fetchDepartments()
        .then((departments) => {
            cachedDepartments = departments;
            updateDepartmentsTable(departments);
            updateSpaceDepartmentsSelect(departments);
        })
        .catch(() => {
            toastr.error("Erro ao carregar os departamentos.");
        });
}

export function updateDepartmentsTable(departments) {
    const tbody = $("#departments-table tbody");
    tbody.empty();

    if (departments.length === 0) {
        tbody.append(
            `<tr><td colspan="5">Não há departamentos inseridos.</td></tr>`,
        );
        return;
    }

    departments.forEach((dep) => {
        tbody.append(`
            <tr class="cursor-pointer" data-id="${dep.id}" data-bs-toggle="modal" data-bs-target="#editDepartmentModal">
                <td>
                    <div class="d-flex flex-column">
                        <b data-name="${dep.name}">${dep.name}</b>
                        <small data-audit_type="${dep.audit_type}"><i>${dep.audit_type}</i></small>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center avatar-snake">
                        ${
            dep.responsibles.map((responsible) =>
                renderAvatar(responsible.name)
            ).join("")
        }
                    </div>
                </td>
                <td data-spaces_count="${dep.spaces_count}">${dep.spaces_count}</td>
                <td><i class="fa-solid fa-angle-right"></i></td>
            </tr>
        `);
    });
}

export function updateSpaceDepartmentsSelect(departments) {
    const select = $("#spaceDepartmentField");
    select.empty();

    select.append(
        `<option class="text-muted" disabled selected>-- Selecione um Departamento --</option>`,
    );

    if (departments.length === 0) {
        select.append(
            `<option disabled>Não há departamentos disponíveis.</option>`,
        );
        return;
    }

    departments.forEach((dep) => {
        select.append(`<option value="${dep.id}">${dep.name}</option>`);
    });
}

export function loadDepartmentAuditTypes() {
    const select = $("#auditTypeField");
    select.html(`<option disabled selected>A carregar...</option>`);

    fetchAuditTypes()
        .then((auditTypes) => {
            cachedAuditTypes = auditTypes;

            select.empty();
            if (auditTypes.length === 0) {
                select.append(
                    `<option disabled>Não há tipos de auditoria disponíveis.</option>`,
                );
                return;
            }

            select.append(
                `<option class="text-muted" disabled selected>-- Selecione o Tipo de Auditoria --</option>`,
            );
            auditTypes.forEach((type) => {
                select.append(
                    `<option value="${type.id}">${type.name}</option>`,
                );
            });
        })
        .catch(() => {
            toastr.error("Erro ao carregar os tipos de auditoria.");
        });
}
