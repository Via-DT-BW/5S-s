import { fetchDepartments, fetchSession } from "../api.js";

let cachedDepartments = [];
let cachedUser = {};

$(document).ready(function() {
    loadUserProfile();

    $(".input-group .fa-lock").click(function() {
        let pwdField = $(this).closest(".input-group").find("input");
        let type = pwdField.attr("type") === "password" ? "text" : "password";
        pwdField.attr("type", type);
        $(this).toggleClass("fa-lock fa-unlock");
    });


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
                $("#currentPwdField").removeClass("is-invalid");
                $("#newPwdField").removeClass("is-invalid");
                $("#confirmNewPwdField").removeClass("is-invalid");
            },
            error: function(xhr) {
                toastr.error(xhr.responseJSON?.error)
                $("#currentPwdField").addClass("is-invalid");
                $("#newPwdField").addClass("is-invalid");
                $("#confirmNewPwdField").addClass("is-invalid");
            }
        })
    })

    $("#user-profile-form").on("submit", function(e) {
        e.preventDefault();

        let formData = new FormData(this);
        let data = Object.fromEntries(formData.entries());

        if (!data.email.trim() || !data.department) {
            let err = "Preencha todos os campos"
            toastr.error(err);
            $("#emailField").addClass("is-invalid");
            $("#userDepartmentField").addClass("is-invalid");
            return;
        }

        let username = data.email.split('@')[0];

        let payload = {
            username: username,
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
                $("#sidebar-username").text(username)
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
    $.when(fetchSession(), fetchDepartments()).done((userData, deptData) => {
        cachedUser = userData[0];
        cachedDepartments = deptData[0];

        $("#emailField").val(cachedUser.email)
        populateDepartmentsDropdown(cachedDepartments, cachedUser.department);
    }).fail((_, textStatus, errorThrown) => {
        console.error("Error fetching data:", textStatus, errorThrown);
    });
}

function populateDepartmentsDropdown(departments, departmentId) {
    let select = $("#userDepartmentField");

    departments.forEach(dep => {
        let selected = (dep.id == departmentId) ? "selected" : "";
        select.append(`<option value="${dep.id}" ${selected}>${dep.name}</option>`);
    });
}
