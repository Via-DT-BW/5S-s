$(document).ready(function() {
    fetchDepartments();
    fetchAuditTypes();

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

                fetchDepartments();

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

    function fetchDepartments() {
        $.ajax({
            url: "/api/departments",
            type: "GET",
            beforeSend: function() {
                $("#departments-table tbody").html(`
                    <tr>
                        <td colspan="4" class="text-center">
                            <i class="fa fa-spinner fa-spin"></i> Carregando...
                        </td>
                    </tr>
                `);
            },
            success: function(departments) {
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
                            <td><i class="fa-solid fa-user"></i> ${dep.users_count}</td>
                            <td class="table-options">
                                <a href="#" class="btn btn-info"><i class="fa-solid fa-eye"></i></a>
                                <a href="#" class="btn btn-secondary"><i class="fa-solid fa-pencil"></i></a>
                                <a href="#" class="btn btn-danger"><i class="fa-solid fa-trash"></i></a>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function() {
                toastr.error("Erro ao carregar os departamentos.");
            }
        });
    }

    function fetchAuditTypes() {
        $.ajax({
            url: "/api/audit_types",
            type: "GET",
            beforeSend: function() {
                $("#auditTypeField").html(`
                <option disabled selected>Carregando...</option>
            `);
            },
            success: function(auditTypes) {
                let select = $("#auditTypeField");
                select.empty(); // Clear existing options

                if (auditTypes.length === 0) {
                    select.append(`<option disabled>Não há tipos de auditoria disponíveis.</option>`);
                    return;
                }

                select.append(`<option class="text-muted" disabled selected>-- Selecione o Tipo de Auditoria --</option>`);
                auditTypes.forEach(type => {
                    select.append(`<option value="${type.id}">${type.name}</option>`);
                });
            },
            error: function() {
                toastr.error("Erro ao carregar os tipos de auditoria.");
            }
        });
    }

});
