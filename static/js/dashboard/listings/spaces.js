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

