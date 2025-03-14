import { fetchDepartments, fetchSession } from "../api.js";

let cachedDepartments = [];
let cachedUser = {};

$(document).ready(function() {
    loadUserProfile();

    $("#user-password-form").on("submit", function(e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());

        let currentPwd = data.currentPwd.trim()
        let newPwd = data.newPwd.trim()
        let confirmNewPwd = data.confirmNewPwd.trim()

        if (newPwd !== confirmNewPwd) {
            let err = "Passwords não coincidem";
            toastr.error(err);
            $("#newPwdFieldError").text(err);
            $("#newPwdField").addClass("is-invalid");
            $("#confirmNewPwdField").addClass("is-invalid");
            return;
        }

        let payload = {
            current: currentPwd,
            new: newPwd
        }

        $.ajax({
            url: "/api/password",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                let success = "A sua password foi atualizada com sucesso."
                toastr.success(success);
                $("#newPwdFieldError").empty();
                $("#currentPwdFieldError").empty();
                $("#currentPwdField").removeClass("is-invalid");
                $("#newPwdField").removeClass("is-invalid");
                $("#confirmNewPwdField").removeClass("is-invalid");
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error)
                $("#currentPwdFieldError").text(xhr.responseJSON?.error);
                $("#currentPwdField").addClass("is-invalid");
            }
        })
    })

    $("#user-profile-form").on("submit", function(e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());

        if (!data.username.trim() || !data.email.trim() || !data.department) {
            let err = "Preencha todos os campos"
            toastr.error(err);
            $("#usernameFieldError").text(err);
            $("#usernameField").addClass("is-invalid");
            $("#emailField").addClass("is-invalid");
            $("#userDepartmentField").addClass("is-invalid");
            return;
        }

        let payload = {
            username: data.username,
            email: data.email,
            department: data.department
        }

        $.ajax({
            url: "/api/session",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                toastr.success("O seu perfil foi atualizado com sucesso.");
                $("#sidebar-username").text(data.username)
                $("#usernameFieldError").empty();
                $("#usernameField").removeClass("is-invalid");
                $("#emailField").removeClass("is-invalid");
                $("#userDepartmentField").removeClass("is-invalid");
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error || "Erro ao atualizar o seu perfil.")
            }
        })
    });
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
            <input type="text" class="form-control" name="username" value="${user.username}" id="usernameField" aria-describedby="usernameHelp" placeholder="Insira o seu nome..">
            <div id="usernameFieldError" class="text-danger"></div>
        </div>

        <div class="form-group">
            <label for="emailField" class="mb-1">E-mail <span class="text-danger">*</span></label>
            <input type="email" class="form-control" name="email" value="${user.email}" id="emailField" aria-describedby="emailHelp" placeholder="Insira o seu e-mail..">
            <div id="emailFieldError" class="text-danger"></div>
        </div>

        <div class="form-group">
            <label for="userDepartmentField" class="mb-1">Departamento <span class="text-danger">*</span></label>
            <select class="form-control" name="department" id="userDepartmentField">
                <option disabled>-- Escolha um Departamento --</option>
            </select>
        </div>

        <button id="updateProfileBtn" type="submit" class="btn btn-primary d-flex align-items-center">
            <i class="fa-solid fa-rotate-right"></i>
            <span>Atualizar</span>
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
