$(document).ready(function() {
    // Delete Department
    $(document).on("click", ".delete-department-btn", function() {
        let id = $(this).data("id");
        let name = $(this).data("name");
        $("#deleteDepartmentModal").data("id", id);
        $("#deleteDepartmentModal").data("name", name);

        $("#deleteDepartmentModal .modal-title").text(`Confirmação`)
        $("#deleteDepartmentModal .modal-body").text(`Tem a certeza que deseja apagar o departamento ${name}?`)
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
                loadDepartments();
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error || "Existem espaços associados a este departamento.");
            }
        });
        $("#deleteDepartmentModal").modal("hide");
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

    // Create Department
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

