$(document).ready(function() {
    $(document).on("click", ".edit-space-btn", function() {
        let id = $(this).data("id");
        let name = $(this).data("name");
        let department = $(this).data("department");

        $('#editSpaceForm #spaceField').val(name);

        let optionsHtml = "";
        $.each(cachedDepartments, function(_, cachedDepartment) {
            optionsHtml += `<option value="${cachedDepartment.id}" ${cachedDepartment.name == department ? 'selected' : ''}>${cachedDepartment.name}</option>`;
        });

        $('#editSpaceForm #departmentField').html(optionsHtml);

        $("#editSpaceForm").data("space-id", id);
    });

    $(document).on("click", "#editSpaceModalBtn", function(e) {
        e.preventDefault();

        let id = $("#editSpaceForm").data("space-id")
        let newName = $("#editSpaceForm #spaceField").val()
        let newDepartment = $("#editSpaceForm #departmentField").val()

        if (!newName || !newDepartment) {
            toastr.error("Preencha todos os campos.")
            return
        }

        let payload = {
            name: newName,
            department: newDepartment,
        }

        $.ajax({
            url: `/api/space/${id}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                toastr.success(`Espaço atualizado com sucesso.`)
                $("#editSpaceModal").modal("hide")
                loadSpaces();
            }
        })
    })

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
});
