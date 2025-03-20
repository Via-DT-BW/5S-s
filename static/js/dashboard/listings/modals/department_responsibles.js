import { fetchUsers, fetchSession } from "../../api.js";
import { renderAvatar } from "../../utils.js";

$(document).ready(function() {
    let responsiblesModal = $("#depResponsiblesModal");
    let listGroup = $("#depResponsiblesModal .list-group");
    let loading = $("<div class='spinner'></div>").text("A carregar...");
    let paginationContainer = $("#pagination");
    let usersPerPageSelect = $("#usersPerPage");

    let selectedUsers = new Set();

    let cachedUsers = null;
    let cachedSessionUser = null;
    let currentPage = 1;
    let usersPerPage = parseInt(usersPerPageSelect.val()) || 5;

    responsiblesModal.on("show.bs.modal", function() {
        listGroup.html(loading);

        if (cachedUsers && cachedSessionUser) {
            renderUsers(cachedUsers, cachedSessionUser, currentPage);
        } else {
            $.when(fetchSession(), fetchUsers()).done((sessionUser, users) => {
                cachedUsers = users[0];
                cachedSessionUser = sessionUser[0];
                renderUsers(cachedUsers, cachedSessionUser, currentPage);
            }).catch(error => {
                toastr.error(error);
                listGroup.html("<p class='text-danger'>Erro ao carregar os utilizadores.</p>");
            });
        }
    });

    function renderUsers(users, sessionUser, page) {
        listGroup.empty();
        paginationContainer.empty();

        let startIndex = (page - 1) * usersPerPage;
        let endIndex = startIndex + usersPerPage;
        let paginatedUsers = users.slice(startIndex, endIndex);

        paginatedUsers.forEach(user => {
            let isCurrentUser = sessionUser && user.id === sessionUser.id;
            let isChecked = selectedUsers.has(user.id);
            let hiddenClass = isChecked ? "d-none" : ""; // Hide instead of removing

            let listItem = $(`
                <li class="list-group-item d-flex align-items-center gap-3 ${hiddenClass}" data-user-id="${user.id}">
                    <input type="checkbox" class="form-check-input option-checkbox" value="${user.id}" ${isChecked ? "checked" : ""}>
                    ${renderAvatar(user.username)}
                    <div class="d-flex flex-column">
                        <strong>
                            ${user.username}
                            ${isCurrentUser ? "<span class='badge bg-secondary ms-auto'>Eu</span>" : ""}
                        </strong>
                        <small class="text-muted">${user.department || "N/A"}</small>
                    </div>
                </li>
            `);

            listItem.find(".option-checkbox").on("change", function() {
                let userId = parseInt($(this).val());
                if (this.checked) {
                    selectedUsers.add(userId);
                    listItem.addClass("d-none"); // Hide when selected
                    addUserBadge(user);
                } else {
                    selectedUsers.delete(userId);
                    listItem.removeClass("d-none");
                    removeUserBadge(userId);
                }
            });

            listGroup.append(listItem);
        });

        renderPagination(users.length);
    }

    function addUserBadge(user) {
        let badge = $(`
            <span class="badge bg-primary d-flex align-items-center gap-2 p-2" data-user-id="${user.id}">
                ${user.username}
                <button type="button" class="btn-close btn-close-white" aria-label="Remove"></button>
            </span>
        `);

        badge.find(".btn-close").on("click", function() {
            selectedUsers.delete(user.id);
            $(`li[data-user-id="${user.id}"]`).removeClass("d-none").find(".option-checkbox").prop("checked", false);
            badge.remove();
        });

        $("#selectedUsersList").append(badge);
    }

    function removeUserBadge(userId) {
        $(`#selectedUsersList span[data-user-id="${userId}"]`).remove();
    }

    $("#saveDepartmentResponsiblesBtn").on("click", function() {
        let selectedContainer = $("#selectedDepartmentResponsibles");
        selectedContainer.empty(); // Clear previous selections

        $("#selectedUsersList span").each(function() {
            let userId = $(this).data("user-id");
            let username = $(this).text().trim(); // Get username

            let badge = $(`
            <span class="badge bg-primary d-flex align-items-center gap-2 p-2" data-user-id="${userId}">
                ${username}
                <button type="button" class="btn-close btn-close-white" aria-label="Remove"></button>
            </span>
        `);

            badge.find(".btn-close").on("click", function() {
                selectedUsers.delete(userId);
                $(`#selectedUsersList span[data-user-id="${userId}"]`).remove();
                $(`li[data-user-id="${userId}"]`).removeClass("d-none").find(".option-checkbox").prop("checked", false);
                badge.remove();
            });

            selectedContainer.append(badge);
        });
    });

    function renderPagination(totalUsers) {
        paginationContainer.empty();
        let totalPages = Math.ceil(totalUsers / usersPerPage);

        if (totalPages <= 1) return;

        let prevButton = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link rounded-3" href="#"><i class="fa-solid fa-angle-left"></i></a>
        </li>`);
        prevButton.click(function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderUsers(cachedUsers, cachedSessionUser, currentPage);
            }
        });

        paginationContainer.append(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            let pageItem = $(`<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link rounded-3" href="#">${i}</a>
            </li>`);
            pageItem.click(function(e) {
                e.preventDefault();
                currentPage = i;
                renderUsers(cachedUsers, cachedSessionUser, currentPage);
            });

            paginationContainer.append(pageItem);
        }

        let nextButton = $(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link rounded-3" href="#"><i class="fa-solid fa-angle-right"></i></a>
        </li>`);
        nextButton.click(function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderUsers(cachedUsers, cachedSessionUser, currentPage);
            }
        });

        paginationContainer.append(nextButton);
    }

    $("#searchInput").on("keyup", function() {
        let searchTerm = $(this).val().toLowerCase().trim();
        let filteredUsers = cachedUsers.filter(user =>
            user.username.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderUsers(filteredUsers, cachedSessionUser, currentPage);
    });

    usersPerPageSelect.on("change", function() {
        usersPerPage = parseInt($(this).val());
        currentPage = 1;
        renderUsers(cachedUsers, cachedSessionUser, currentPage);
    });
});

