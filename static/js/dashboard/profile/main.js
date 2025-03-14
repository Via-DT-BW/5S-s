import { fetchDepartments, fetchSession } from "../listings/api.js";

let cachedDepartments = [];
let cachedUser = {};

$(document).ready(function() {
    loadUserProfile();
});

function loadUserProfile() {
    $("#user-profile-form").html(`
        <span><i class="fa fa-spinner fa-spin"></i> A carregar...</span>
    `);

    $.when(fetchSession(), fetchDepartments()).done((userData, deptData) => {
        cachedUser = userData[0];
        cachedDepartments = deptData[0];

        updateProfileForm(cachedUser);
        populateDepartmentsDropdown(cachedDepartments, cachedUser.department);
    }).fail((_, textStatus, errorThrown) => {
        console.error("Error fetching data:", textStatus, errorThrown);
    });
}

function updateProfileForm(user) {
    $("#user-profile-form").html(`
        <div class="form-group">
            <label for="usernameField" class="mb-1">Nome <span class="text-danger">*</span></label>
            <input type="text" class="form-control" name="username" value="${user.username}" id="usernameField" aria-describedby="usernameHelp" placeholder="Insira o seu nome.." required>
            <div id="usernameFieldError" class="text-danger"></div>
        </div>

        <div class="form-group">
            <label for="emailField" class="mb-1">E-mail <span class="text-danger">*</span></label>
            <input type="email" class="form-control" name="email" value="${user.email}" id="emailField" aria-describedby="emailHelp" placeholder="Insira o seu e-mail.." required>
            <div id="emailFieldError" class="text-danger"></div>
        </div>

        <div class="form-group">
            <label for="userDepartmentField" class="mb-1">Departamento <span class="text-danger">*</span></label>
            <select class="form-control" name="department" id="userDepartmentField" required>
                <option disabled>-- Escolha um Departamento --</option>
            </select>
        </div>

        <button id="create_user_btn" type="submit" class="btn btn-primary">
            <i class="fa-solid fa-rotate-right"></i>
            Atualizar
        </button>
    `)
}

function populateDepartmentsDropdown(departments, departmentId) {
    let select = $("#userDepartmentField");
    select.empty();

    select.append('<option disabled selected>-- Escolha um Departamento --</option>');
    departments.forEach(dep => {
        let selected = (dep.id == departmentId) ? "selected" : "";
        select.append(`<option value="${dep.id}" ${selected}>${dep.name}</option>`);
    });
}

