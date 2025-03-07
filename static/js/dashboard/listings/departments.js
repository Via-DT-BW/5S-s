let cachedDepartments = [];
let cachedAuditTypes = [];

function loadDepartments() {
    $("#departments-table tbody").html(`
        <tr>
            <td colspan="5" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> Carregando...
            </td>
        </tr>
    `);

    fetchDepartments()
        .then(departments => {
            cachedDepartments = departments;
            updateDepartmentsTable(departments);
            updateSpaceDepartmentsSelect(departments);
        })
        .catch(() => {
            toastr.error("Erro ao carregar os departamentos.");
        });
}

function updateDepartmentsTable(departments) {
    let tbody = $("#departments-table tbody");
    tbody.empty();

    if (departments.length === 0) {
        tbody.append(`<tr><td colspan="5">Não há departamentos inseridos.</td></tr>`);
        return;
    }

    departments.forEach(dep => {
        tbody.append(`
            <tr>
                <td>${dep.name}</td>
                <td>${dep.audit_type}</td>
                <td>${dep.spaces_count}</td>
                <td><i class="fa-solid fa-user"></i> ${dep.users_count}</td>
                <td class="table-options">
                    <button class="btn btn-secondary edit-department-btn" 
                        data-id="${dep.id}" 
                        data-name="${dep.name}" 
                        data-audit-type-id="${dep.audit_type}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editDepartmentModal">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-danger delete-department-btn" 
                        data-id="${dep.id}" 
                        data-name="${dep.name}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteDepartmentModal">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}

function updateSpaceDepartmentsSelect(departments) {
    let select = $("#spaceDepartmentField");
    select.empty();

    select.append(`<option class="text-muted" disabled selected>-- Selecione um Departamento --</option>`);

    if (departments.length === 0) {
        select.append(`<option disabled>Não há departamentos disponíveis.</option>`);
        return;
    }

    departments.forEach(dep => {
        select.append(`<option value="${dep.id}">${dep.name}</option>`);
    });
}

function loadDepartmentAuditTypes() {
    let select = $("#auditTypeField");
    select.html(`<option disabled selected>A carregar...</option>`);

    fetchAuditTypes()
        .then(auditTypes => {
            cachedAuditTypes = auditTypes;

            select.empty();
            if (auditTypes.length === 0) {
                select.append(`<option disabled>Não há tipos de auditoria disponíveis.</option>`);
                return;
            }

            select.append(`<option class="text-muted" disabled selected>-- Selecione o Tipo de Auditoria --</option>`);
            auditTypes.forEach(type => {
                select.append(`<option value="${type.id}">${type.name}</option>`);
            });
        })
        .catch(() => {
            toastr.error("Erro ao carregar os tipos de auditoria.");
        });
}

