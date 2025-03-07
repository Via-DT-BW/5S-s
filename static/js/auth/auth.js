$(function() {
    $("#signUp").on("click", function() {
        $("#container").addClass("right-panel-active");
    });

    $("#signIn").on("click", function() {
        $("#container").removeClass("right-panel-active");
    });

    $(".input-group .fa-eye").click(function() {
        let pwdField = $(this).siblings("input");
        let type = pwdField.attr("type") === "password" ? "text" : "password";
        pwdField.attr("type", type);

        $(this).toggleClass("fa-eye fa-eye-slash");
    });

    $("#login-form").on("submit", function(e) {
        e.preventDefault();
        toastr.success("Login");
    });

    $("#register-form").on("submit", function(e) {
        e.preventDefault();
        toastr.success("Register");
    });
});

