import { fetchSpaces } from "../api.js";

export function loadSpaces() {
    $("#spaces-table tbody").html(`
        <tr>
            <td colspan="3" class="text-center">
                <i class="fa fa-spinner fa-spin"></i> A carregar...
            </td>
        </tr>
    `);

    fetchSpaces().then(spaces => {
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
                        <td class="d-flex flex-wrap gap-3">
                            <button class="btn btn-secondary edit-space-btn" 
                                data-id="${space.id}" 
                                data-name="${space.name}" 
                                data-department="${space.department}" 
                                data-bs-toggle="modal" 
                                data-bs-target="#editSpaceModal">
                                <i class="fa-solid fa-pencil"></i>
                            </button>
                            <button class="btn btn-danger delete-space-btn"
                                data-id="${space.id}" 
                                data-name="${space.name}" 
                                data-bs-toggle="modal" 
                                data-bs-target="#deleteSpaceModal">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
        });
    }).catch(() => {
        toastr.error("Erro ao carregar os espaços.");
    });
}

