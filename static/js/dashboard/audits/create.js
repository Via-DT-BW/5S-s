import { fetchAuditTypes, fetchDepartmentsSpaces } from "../api.js";
import { getBadge } from "./main.js";

let auditChart;

$(document).ready(function() {
    initializeChart();

    fetchDepartmentsSpaces().then(deps => {
        populateDepartmentsAndSpaces(deps);
    })
});

function populateDepartmentsAndSpaces(departments) {
    let departmentField = $("#departmentField");
    let spaceField = $("#spaceField");

    // Hide the audit table and create audit button initially
    $(".audit-table, #create-audit-btn, #score, #scoreChart, #chart-legend").addClass("d-none");

    departments.forEach(department => {
        let newOption = $(`<option value="${department.id}">${department.name}</option>`);
        departmentField.append(newOption);
    });

    departmentField.on("change", function() {
        let selectedDepartmentId = $(this).val();

        spaceField.prop("selectedIndex", -1);

        let selectedDepartment = departments.find(dep => dep.id == selectedDepartmentId);

        setTimeout(() => {
            spaceField.empty().append('<option selected disabled>-- Selecione um Espaço --</option>');

            if (selectedDepartment && selectedDepartment.spaces.length > 0) {
                selectedDepartment.spaces.forEach(space => {
                    let spaceOption = $(`<option value="${space.id}">${space.name}</option>`);
                    spaceField.append(spaceOption);
                });
            } else {
                spaceField.append('<option disabled>Nenhum espaço disponível</option>');
            }
        }, 1);
    });

    spaceField.on("change", function() {
        let selectedSpaceId = $(this).val();
        let selectedDepartmentId = departmentField.val();

        let selectedDepartment = departments.find(dep => dep.id == selectedDepartmentId);
        let selectedSpace = selectedDepartment ? selectedDepartment.spaces.find(space => space.id == selectedSpaceId) : null;

        if (selectedSpace) {
            let dep = selectedDepartment;
            fetchAndPopulateAuditTable(dep);
            handleAuditScoreChange();

            // Show the audit table and create audit button
            $(".audit-table, #create-audit-btn, #score, #scoreChart, #chart-legend").removeClass("d-none");
        }
    });
}

function initializeChart() {
    const ctx = document.getElementById("scoreChart").getContext("2d");
    auditChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Soma de Pontuação por Categoria",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 16
                }
            }
        }
    });
}

function updateChart() {
    let categoryScores = {};
    let currentCategory = null;  // Track the current category

    $("#audit-table tbody tr").each(function() {
        let row = $(this);
        let categoryCell = row.find("td:first");

        // Check if the row contains a category (vertical-text class)
        if (categoryCell.hasClass("vertical-text")) {
            currentCategory = categoryCell.text().trim();
        } else {
            // Skip rows that don't contain valid data
            if (!currentCategory) return;

            let lastFiveTds = row.find("td").slice(-5);
            let score = 0;

            lastFiveTds.each(function() {
                let val = parseInt($(this).text(), 10);
                if (!isNaN(val)) {
                    score += val;  // Accumulate the score instead of resetting
                }
            });

            // Ensure the score is clamped between 0 and 20
            score = Math.min(Math.max(score, 0), 20);

            if (currentCategory) {
                if (!categoryScores[currentCategory]) {
                    categoryScores[currentCategory] = 0;
                }
                categoryScores[currentCategory] += score;
            }
        }
    });

    let categories = Object.keys(categoryScores);
    let totalScores = categories.map(category => categoryScores[category]);

    let backgroundColors = totalScores.map(score => {
        if (score >= 16) return "#198754";
        if (score >= 12) return "#99cc00";
        if (score >= 8) return "#ffc107";
        if (score >= 4) return "#ff9900";
        return "#wdc3545";
    });

    auditChart.data.labels = categories;
    auditChart.data.datasets[0].data = totalScores;
    auditChart.data.datasets[0].backgroundColor = backgroundColors;

    auditChart.update();
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
        getAuditTotalScore();
        updateChart();
    });
}

function fetchAndPopulateAuditTable(dep) {
    fetchAuditTypes().then(auditTypes => {
        const auditType = auditTypes.filter(auditType => auditType.name !== dep.audit_type);
        populateAuditTable(auditType);
        updateChart();
    });
}

function populateAuditTable(auditType) {
    let audit = auditType[0];
    let counter = 1;
    let tableRows = "";

    Object.values(audit.categories).forEach(category => {
        category.checklists.forEach((checklist, index) => {
            tableRows += `
                <tr data-id="${checklist.id}">
                    ${index === 0 ? `<td rowspan="${category.checklists.length}" class="vertical-text">${category.name}</td>` : ""}
                    <td class="text-center"><b>${counter}</b></td>
                    <td>${checklist.factor}</td>
                    <td>${checklist.criteria}</td>
                    <td>
                        <input type="number" class="form-control text-center" value=0 min=0 />
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>4</td>
                </tr>`
                ;
            counter++;
        });
    });
    $("#audit-table tbody").html(tableRows)
}

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
