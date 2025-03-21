import { cachedAuditTypes, loadDepartments } from "../departments.js";

$(document).ready(function() {
    // Delete Department
    $(document).on("click", ".delete-department-btn", function() {
        let id = $("#editDepartmentModal").data("id");
        let name = $("#editDepartmentModal").data("name");
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
    $(document).on("click", "#departments-table tbody tr", function() {
        let id = $(this).data("id");
        let name = $(this).find('[data-name]').html();
        let auditType = $(this).find('[data-audit_type] > i').html();
        let responsibles = $(this).find('.user-avatar').map(function() {
            return $(this).attr("data-bs-content");
        }).get();

        $("#editDepartmentModal #editDepartmentField").val(name);

        let optionsHtml = "";
        $.each(cachedAuditTypes, function(_, auditTypeData) {
            optionsHtml += `<option value="${auditTypeData.id}" ${auditTypeData.name == auditType ? 'selected' : ''}>${auditTypeData.name}</option>`;
        });

        let modal = $("#editDepartmentModal")
        $("#editDepartmentModal #editAuditTypeField").html(optionsHtml);
        modal.data("id", id);
        modal.data("name", name);
        modal.data("responsibles", responsibles)
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
            departmentField.addClass("is-invalid");
            auditTypeField.addClass("is-invalid");
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
            success: function(response) {
                let newDepId = response.department.id;
                let selectedResponsibles = getSelectedResponsibles()

                payload = {
                    responsibles: selectedResponsibles
                }
                $.ajax({
                    url: `/api/department/${newDepId}/responsibles`,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    success: function() {
                        departmentField.val('');
                        auditTypeField.val('');

                        departmentField.removeClass("is-invalid");
                        auditTypeField.removeClass("is-invalid");
                        departmentErrorField.text("");
                        $("#selectedResponsiblesNewDepartment").empty();

                        loadDepartments();
                        toastr.success(`Departamento ${departmentName} criado com sucesso.`);
                    }
                })

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


function getSelectedResponsibles() {
    return $("#selectedResponsiblesNewDepartment")
        .children().map(function() {
            return $(this).data("user-id");
        }).get();
}
