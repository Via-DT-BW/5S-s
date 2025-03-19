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
                <tr class="cursor-pointer"
                    data-id=${space.id} data-name="${space.name}" data-department=${space.department}
                    data-bs-toggle="modal" data-bs-target="#editSpaceModal">
                    <td class="d-flex flex-column">
                        <b>${space.name}</b>
                        <small><i>${space.department}</i></small>
                    </td>
                    <td><i class="fa-solid fa-angle-right" aria-hidden="true"</i></td>
                </tr>
            `);
        });
    }).catch(() => {
        toastr.error("Erro ao carregar os espaços.");
    });
}

