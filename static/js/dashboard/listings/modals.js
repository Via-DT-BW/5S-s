$(document).ready(function() {
    $(document).on("click", ".delete-department-btn", function() {
        $("#deleteDepartmentModal").data("id", $(this).data("id"));
        $("#deleteDepartmentModal").data("name", $(this).data("name"));
    })

    $("#deleteDepartmentBtn").click(function(e) {
        e.preventDefault();

        let id = $("#deleteDepartmentModal").data("id");
        let name = $("#deleteDepartmentModal").data("name");

        $.ajax({
            url: `/api/department/${id}`,
            type: "DELETE",
            contentType: "application/json",
            success: function() {
                toastr.success(`Departamento ${name} apagado com sucesso.`);
                $("#deleteDepartmentModal").modal("hide");
                loadDepartments();
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error || "Erro ao apagar o departamento.");
            }
        });
    })

    // Edit Department
    $(document).on("click", ".edit-department-btn", function() {
        let id = $(this).data("id");
        let name = $(this).data("name");
        let auditType = $(this).data("audit-type-id");

        $("#editDepartmentModal #editDepartmentField").val(name);

        let optionsHtml = "";
        $.each(cachedAuditTypes, function(_, auditTypeData) {
            optionsHtml += `<option value="${auditTypeData.id}" ${auditTypeData.name == auditType ? 'selected' : ''}>${auditTypeData.name}</option>`;
        });

        $("#editDepartmentModal #editAuditTypeField").html(optionsHtml);
        $("#editDepartmentModal").data("department-id", id);
    });


    $("#saveDepartmentBtn").click(function(e) {
        e.preventDefault();

        let id = $("#editDepartmentModal").data("department-id");
        let newName = $("#editDepartmentModal #editDepartmentField").val();
        let newAuditTypeId = $("#editDepartmentModal #editAuditTypeField").val();

        if (!newName || !newAuditTypeId) {
            toastr.error("Preencha todos os campos.");
            return;
        }

        let payload = {
            department: newName,
            audit_type: newAuditTypeId
        };

        $.ajax({
            url: `/api/department/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                toastr.success(`Departamento atualizado com sucesso.`);
                $("#editDepartmentModal").modal("hide");
                loadDepartments();
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error || "Erro ao atualizar departamento.");
            }
        });
    });

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
    });

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

