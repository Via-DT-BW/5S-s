$(document).ready(function() {
    fetchDepartments();

    $("#create_department_btn").click(function(e) {
        e.preventDefault();

        let departmentName = $("#departmentField").val().trim();
        let auditTypeId = $("#auditTypeField").val();

        if (!departmentName || !auditTypeId) {
            alert("Por favor, preencha todos os campos.");
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
                $("#departmentField").val('');
                $("#auditTypeField").val('');

                fetchDepartments();

                toastr.success(`Departamento ${departmentName} criado com sucesso.`)
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao criar o departamento.";
                alert(errorMsg);
            }
        });
    });

    function fetchDepartments() {
        $.ajax({
            url: "/api/departments",
            type: "GET",
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
                                <td>${dep.users_count}</td>
                                <td class="table-options">
                                    <a href="#" class="btn btn-info"><i class="fa-solid fa-eye"></i> Ver</a>
                                    <a href="#" class="btn btn-secondary"><i class="fa-solid fa-pencil"></i> Editar</a>
                                    <a href="#" class="btn btn-danger"><i class="fa-solid fa-trash"></i> Eliminar</a>
                                </td>
                            </tr>
                        `);
                });
            },
            error: function() {
                alert("Erro ao carregar os departamentos.");
            }
        });
    }
});
