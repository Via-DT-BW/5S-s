$(function() {
    $("#signUp").on("click", function() {
        $("#container").addClass("right-panel-active");
    });

    $("#signIn").on("click", function() {
        $("#container").removeClass("right-panel-active");
    });

    $(".input-group .fa-lock").click(function() {
        let pwdField = $(this).closest(".input-group").find("input");
        let type = pwdField.attr("type") === "password" ? "text" : "password";
        pwdField.attr("type", type);
        $(this).toggleClass("fa-lock fa-unlock");
    });

    // Login Form Submission
    $("#login-form").on("submit", function(e) {
        e.preventDefault();

        const identifierField = $("#loginIdentifierField");
        const identifierErrorField = $("#loginIdentifierErrorField");

        const pwdField = $("#loginPwdField");
        const pwdErrorField = $("#loginPwdErrorField");

        let isValid = true;
        isValid &= isFieldValid(identifierField, identifierErrorField, "Introduza o seu nome/e-mail.")
        isValid &= isFieldValid(pwdField, pwdErrorField, "Introduza a sua palavra-passe.")

        if (!isValid) {
            return;
        }

        let payload = {
            identifier: identifierField.val(),
            password: pwdField.val(),
        }

        $.ajax({
            url: "/api/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                toastr.success("Login efetuado com sucesso!");
                window.location.href = "/dashboard/";
                return;
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Credenciais incorretas";
                toastr.error(errorMsg);
            }
        })
    });

    $("#register-form").on("submit", function(e) {
        e.preventDefault();

        const emailField = $("#registerEmailField");
        const emailErrorField = $("#registerEmailErrorField");

        const pwdField = $("#registerPwdField");
        const pwdErrorField = $("#registerPwdErrorField");
        const confirmPwdField = $("#registerConfirmPwdField");

        let isValid = true;
        isValid &= isFieldValid(emailField, emailErrorField, "Introduza o seu e-mail.")
        isValid &= isFieldValid(pwdField, pwdErrorField, "Introduza a sua palavra-passe.")
        isValid &= isFieldValid(confirmPwdField, pwdErrorField, "Introduza a sua palavra-passe.")
        isValid &= arePasswordsEqual(pwdField, pwdErrorField, confirmPwdField);
        isValid &= isPasswordStrong(pwdField, pwdErrorField);

        if (!isValid) {
            toastr.error("Formulário inválido.")
            return;
        }

        let payload = {
            email: emailField.val(),
            password: pwdField.val(),
        }

        $.ajax({
            url: "/api/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                payload = {
                    identifier: emailField.val(),
                    password: pwdField.val(),
                }

                $.ajax({
                    url: "/api/login",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload),
                    success: function() {
                        toastr.success("Conta criada com sucesso.");
                        window.location.href = "/dashboard/";
                        return;
                    },
                    error: function(xhr) {
                        let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao entrar a sua conta.";
                        toastr.error(errorMsg);
                    }
                })
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao criar a sua conta.";
                toastr.error(errorMsg);
            }
        })
    });
});

function isFieldValid(field, errorField, errorMsg) {
    if (!field.val().trim()) {
        field.addClass("is-invalid");
        errorField.text(errorMsg);
        return false;
    }

    field.removeClass("is-invalid");
    errorField.text("");

    return true;
}

function arePasswordsEqual(pwdField, pwdErrorField, confirmPwdField) {
    if (pwdField.val() !== confirmPwdField.val()) {
        pwdField.addClass("is-invalid");
        confirmPwdField.addClass("is-invalid");
        pwdErrorField.text("As passwords não coincidem.");
        return false;
    }

    pwdField.removeClass("is-invalid");
    confirmPwdField.removeClass("is-invalid");
    pwdErrorField.text("");

    return true;
}

function isPasswordStrong(pwdField, pwdErrorField) {
    const password = pwdField.val();

    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const specialValid = /[!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/]/.test(password);

    let valid = true;

    pwdErrorField.text("");

    if (!lengthValid || !uppercaseValid || !specialValid) {
        valid = false;
    }

    if (!lengthValid) {
        pwdErrorField.text("A palavra-passe deve ter pelo menos 8 caracteres.");
    }
    if (!uppercaseValid) {
        pwdErrorField.text("A palavra-passe deve conter pelo menos uma letra maiúscula.");
    }
    if (!specialValid) {
        pwdErrorField.text("A palavra-passe deve conter pelo menos dois caracteres especiais.");
    }

    if (!valid) {
        pwdField.addClass("is-invalid");
    } else {
        pwdField.removeClass("is-invalid");
    }

    return valid;
}
