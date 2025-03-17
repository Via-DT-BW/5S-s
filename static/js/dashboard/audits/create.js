import { fetchDepartmentSpaces, fetchSession, fetchDepartment, fetchAuditTypes } from "../api.js";
import { getBadge } from "./main.js";

$(document).ready(function() {
    fetchSession().then(user => {
        fetchDepartment(user.department).then(dep => {
            user["department_name"] = dep["name"];

            fetchAndPopulateSpaces(user.department);
            $("#departmentField").val(user.department_name);

            fetchAndPopulateAuditTable(dep)
            handleAuditScoreChange()
        });
    });
});

function getAuditTotalScore() {
    let totalScore = 0;

    $("#audit-table tbody tr").each(function() {
        let row = $(this);
        let lastFiveTds = row.find("td").slice(-5);
        let score = 0;

        lastFiveTds.each(function() {
            let val = parseInt($(this).text(), 10);
            if (!isNaN(val)) {
                score = val;
                return false;
            }
        });

        totalScore += score;
    });

    let badge = getBadge(totalScore);

    $("#score_name").text(badge.score);
    $("#score_value").text(totalScore);
    $("#score").removeClass(function(_, className) {
        return (className.match(/(^|\s)bg-\S+/g) || []).join(' ');
    }).addClass(badge.class);

    return totalScore;
}

function handleAuditScoreChange() {
    $("#audit-table tbody").on("input", "input[type='number']", function() {
        let inputVal = parseInt($(this).val(), 10) || 0;
        let row = $(this).closest("tr");
        let tds = row.find("td");
        let lastTdIndex = tds.length - 1;

        tds.slice(-5).text("");

        if (inputVal === 0) {
            tds.eq(lastTdIndex).text("4");
        } else if (inputVal === 1) {
            tds.eq(lastTdIndex - 1).text("3");
        } else if (inputVal === 2) {
            tds.eq(lastTdIndex - 2).text("2");
        } else if (inputVal > 2 && inputVal < 6) {
            tds.eq(lastTdIndex - 3).text("1");
        } else if (inputVal >= 6) {
            tds.eq(lastTdIndex - 4).text("0");
        }
        getAuditTotalScore()
    })
}

function populateAuditTable(auditType) {
    let audit = auditType[0];
    let counter = 1;
    let tableRows = "";

    Object.values(audit.categories).forEach(category => {
        category.checklists.forEach((checklist, index) => {
            tableRows += `
                <tr>
                    ${index === 0 ? `<td rowspan="${category.checklists.length}" class="vertical-text">${category.name}</td>` : ""}
                    <td class="text-center"><b>${counter}</b></td>
                    <td>${checklist.factor}</td>
                    <td>${checklist.criteria}</td>
                    <td>
                        <input type="number" class="form-control text-center" style="max-width: 75px" value=0 min=0 />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>4</td>
                </tr>
            `;
            counter++;
        });
    });
    $("#audit-table tbody").html(tableRows)
}

function fetchAndPopulateAuditTable(dep) {
    fetchAuditTypes().then(auditTypes => {
        const auditType = auditTypes.filter(auditType => auditType.name !== dep.audit_type);

        populateAuditTable(auditType)
    });
}

function fetchAndPopulateSpaces(departmentId) {
    let spaceField = $("#spaceField");
    let loading = $("<div class='spinner'></div>").text("A carregar...");

    spaceField.after(loading);

    fetchDepartmentSpaces(departmentId).then(spaces => {
        spaceField.empty();
        spaces.forEach(space => {
            spaceField.append(new Option(space.name, space.id));
        });
    }).always(() => {
        loading.remove();
    });
}

