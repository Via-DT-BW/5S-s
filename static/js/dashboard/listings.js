let cachedDepartments = [];

$(document).ready(function() {
    loadDepartments();
    loadDepartmentAuditTypes();
    loadSpaces();

    $("#create_space_btn").click(function(e) {
        e.preventDefault();

        let spaceField = $("#spaceField");
        let spaceFieldError = $("#spaceFieldError");
        let spaceDepartmentField = $("#spaceDepartmentField");

        let name = spaceField.val().trim();
        let department = spaceDepartmentField.val();

        if (!name || !department) {
            toastr.error("Preencha todos os campos.");
            spaceField.addClass("invalidField");
            spaceFieldError.text("Preencha todos os campos.");
            return;
        }

        let payload = {
            name: name,
            department: department
        }

        $.ajax({
            url: "/api/space",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                spaceField.val('');
                spaceDepartmentField.val('');

                spaceField.removeClass("invalidField");
                spaceFieldError.text("");

                loadSpaces();
                loadDepartments();
                toastr.success(`Espaço ${name} criado com sucesso.`);
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao criar o departamento.";
                toastr.error(errorMsg);
                spaceField.addClass("invalidField");
                spaceFieldError.text(errorMsg);
            }
        })
    })

    $("#create_department_btn").click(function(e) {
        e.preventDefault();

        let departmentField = $("#departmentField");
        let auditTypeField = $("#auditTypeField");
        let departmentErrorField = $("#departmentErrorField");

        let departmentName = departmentField.val().trim();
        let auditTypeId = auditTypeField.val();

        if (!departmentName || !auditTypeId) {
            toastr.error("Preencha todos os campos.");
            departmentField.addClass("invalidField");
            departmentErrorField.text("Preencha todos os campos.");
            return;
        }

        let payload = {
            department: departmentName,
            audit_type: auditTypeId
        };

        $.ajax({
            url: "/api/department",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                departmentField.val('');
                auditTypeField.val('');

                departmentField.removeClass("invalidField");
                departmentErrorField.text("");

                loadDepartments();

                toastr.success(`Departamento ${departmentName} criado com sucesso.`);
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao criar o departamento.";
                toastr.error(errorMsg);
                departmentField.addClass("invalidField");
                departmentErrorField.text(errorMsg);
            }
        });
    });
});

function fetchDepartments() {
    return $.ajax({
        url: "/api/departments",
        type: "GET"
    });
}

function fetchAuditTypes() {
    return $.ajax({
        url: "/api/audit_types",
        type: "GET"
    });
}

function fetchSpaces() {
    return $.ajax({
        url: "/api/spaces",
        type: "GET"
    });
}

// UI updating functions
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
        tbody.append(`<tr><td colspan="4">Não há departamentos inseridos.</td></tr>`);
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
                    <a href="#" class="btn btn-info"><i class="fa-solid fa-eye"></i></a>
                    <a href="#" class="btn btn-secondary"><i class="fa-solid fa-pencil"></i></a>
                    <a href="#" class="btn btn-danger"><i class="fa-solid fa-trash"></i></a>
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

function loadSpaces() {
    $("#spaces-table tbody").html(`
        <tr>
            <td colspan="3" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> A carregar...
            </td>
        </tr>
    `);

    fetchSpaces()
        .then(spaces => {
            let tbody = $("#spaces-table tbody");
            tbody.empty();

            if (spaces.length === 0) {
                tbody.append(`<tr><td colspan="3">Não há espaços inseridos.</td></tr>`);
                return;
            }

            spaces.forEach(space => {
                tbody.append(`
                    <tr>
                        <td>${space.name}</td>
                        <td>${space.department}</td>
                        <td class="table-options">
                            <a href="#" class="btn btn-info"><i class="fa-solid fa-eye"></i></a>
                            <a href="#" class="btn btn-secondary"><i class="fa-solid fa-pencil"></i></a>
                            <a href="#" class="btn btn-danger"><i class="fa-solid fa-trash"></i></a>
                        </td>
                    </tr>
                `);
            });
        })
        .catch(() => {
            toastr.error("Erro ao carregar os espaços.");
        });
}
