$(document).ready(function() {
    $("#searchInput").on("keyup", function() {
        var searchTerm = $(this).val().toLowerCase().trim();
        var anyMatch = false;

        $(".list-group-item").each(function() {
            var username = $(this).find("strong").text().toLowerCase().trim();

            if (username.includes(searchTerm)) {
                $(this).removeClass("d-none");
                anyMatch = true;
            } else {
                $(this).addClass("d-none");
            }
        });

        if (!anyMatch || searchTerm === "") {
            $(".list-group-item").removeClass("d-none");
        }
    });
});
