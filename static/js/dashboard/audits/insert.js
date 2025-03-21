import { fetchSession } from "../api.js";

$(document).ready(function() {
    $(document).on("click", "#create-audit-btn", function(e) {
        e.preventDefault();

        fetchSession().then(user => {
            let signed = parseInt(user["id"], 10);
            let overall_score = parseInt($("#score_value").text(), 10);
            let space = parseInt($("#spaceField").val(), 10);

            let audit_payload = {
                signed: signed,
                space: space,
                overall_score: overall_score
            }

            $.ajax({
                url: "/api/audit",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(audit_payload),
                success: function(response) {
                    let audit_id = response.audit.id
                    let checklist_payload = getChecklistPayload();

                    $.ajax({
                        url: `/api/audits/${audit_id}/checklist`,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(checklist_payload),
                        success: function() {
                            toastr.success("Auditoria criada com sucesso.");
                            window.location.href = "/dashboard/audits";
                        },
                        error: function(xhr) {
                            console.log(xhr.response?.error)
                            let errorMsg = xhr.response?.error | "Ocorreu um erro ao tentar inserir a auditoria";
                            toastr.error(errorMsg);
                            return;
                        }
                    })
                },
                error: function(xhr) {
                    console.log(xhr.response?.error)
                    let errorMsg = xhr.responseJSON?.error || "Ocorreu um erro ao tentar inserir a auditoria.";
                    toastr.error(errorMsg);
                    return;
                }
            })
        })
    })
});

function getChecklistPayload() {
    let checklistPayload = [];

    $("#audit-table tbody tr").each(function() {
        let row = $(this);
        let checklistId = row.data("id");
        let lastFiveTds = row.find("td").slice(-5);
        let noks = row.find("td input[type='number']").val();

        let score = 0;
        lastFiveTds.each(function() {
            let val = parseInt($(this).text(), 10);
            if (!isNaN(val)) {
                score = val;
            }
        });

        if (checklistId && !isNaN(score)) {
            checklistPayload.push({
                checklist: checklistId,
                score: score,
                noks: noks
            });
        }
    });

    return checklistPayload;
}
