function validateField(field, errorField, errorMsg) {
    if (!field.val().trim()) {
        field.addClass("invalidField");
        errorField.text(errorMsg);
        return false;
    }

    field.removeClass("invalidField");
    errorField.text("");

    return true;
}

function validatePasswords(pwdField, pwdErrorField, confirmPwdField) {
    if (pwdField.val() !== confirmPwdField.val()) {
        pwdField.addClass("invalidField");
        confirmPwdField.addClass("invalidField");
        pwdErrorField.text("As passwords não coincidem.");
        return false;
    }

    pwdField.removeClass("invalidField");
    confirmPwdField.removeClass("invalidField");
    pwdErrorField.text("");

    return true;
}

$(function() {
    $("#signUp").on("click", function() {
        $("#container").addClass("right-panel-active");
    });

    $("#signIn").on("click", function() {
        $("#container").removeClass("right-panel-active");
    });

    // Toggle Password Visibility
    $(".input-group .fa-eye").click(function() {
        let pwdField = $(this).siblings("input");
        let type = pwdField.attr("type") === "password" ? "text" : "password";
        pwdField.attr("type", type);
        $(this).toggleClass("fa-eye fa-eye-slash");
    });

    // Login Form Submission
    $("#login-form").on("submit", function(e) {
        e.preventDefault();

        const emailField = $("#loginEmailField");
        const emailErrorField = $("#loginEmailErrorField");

        const pwdField = $("#loginPwdField");
        const pwdErrorField = $("#loginPwdErrorField");

        let isValid = true;
        isValid &= validateField(emailField, emailErrorField, "Introduza o seu e-mail.")
        isValid &= validateField(pwdField, pwdErrorField, "Introduza a sua palavra-passe.")

        if (!isValid) {
            return;
        }

        let payload = {
            email: emailField.val(),
            password: pwdField.val(),
        }

        $.ajax({
            url: "/api/login",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function() {
                emailField.val('');
                pwdField.val('');

                window.location.href = "/dashboard/";
                return;
            },
            error: function(xhr) {
                let errorMsg = xhr.responseJSON?.error || "Credenciais incorretas";
                toastr.error(errorMsg);
            }
        })
    });

    // Register Form Submission
    $("#register-form").on("submit", function(e) {
        e.preventDefault();

        const usernameField = $("#registerUsernameField");
        const usernameErrorField = $("#registerUsernameErrorField");

        const emailField = $("#registerEmailField");
        const emailErrorField = $("#registerEmailErrorField");

        const pwdField = $("#registerPwdField");
        const pwdErrorField = $("#registerPwdErrorField");

        const confirmPwdField = $("#registerConfirmPwdField");

        let isValid = true;
        isValid &= validateField(usernameField, usernameErrorField, "Introduza o nome do seu utilizador.");
        isValid &= validateField(emailField, emailErrorField, "Introduza o seu e-mail.")
        isValid &= validateField(pwdField, pwdErrorField, "Introduza a sua palavra-passe.")
        isValid &= validatePasswords(pwdField, pwdErrorField, confirmPwdField);

        if (isValid) {
            let payload = {
                username: usernameField.val(),
                email: emailField.val(),
                password: pwdField.val(),
            }

            $.ajax({
                url: "/api/register",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(payload),
                success: function() {
                    usernameField.val('');
                    emailField.val('');
                    pwdField.val('');
                    confirmPwdField.val('');
                    toastr.success("Conta criada com sucesso!");
                    $("#container").removeClass("right-panel-active");
                },
                error: function(xhr) {
                    let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao criar a sua conta.";
                    toastr.error(errorMsg);
                }
            })
        }
    });
});

