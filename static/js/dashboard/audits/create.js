import { fetchAuditTypes, fetchDepartmentsSpaces } from "../api.js";
import { getBadge } from "./main.js";

let auditChart;

$(document).ready(function() {
    initializeChart();
    fetchDepartmentsSpaces().then(deps => {
        if (deps) {
            populateDepartmentsAndSpaces(deps);
        }
    }).catch(error => toastr.error(error));
});

function populateDepartmentsAndSpaces(departments) {
    let departmentField = $("#departmentField");
    let spaceField = $("#spaceField");

    $(".audit-table, #create-audit-btn, #score, #scoreChart, #chart-legend").addClass("d-none");

    departmentField.empty().append('<option selected disabled>-- Selecione um Departamento --</option>');
    spaceField.empty().append('<option selected disabled>-- Selecione um Espaço --</option>');

    departments.forEach(department => {
        let newOption = $(`<option value="${department.id}">${department.name}</option>`);
        departmentField.append(newOption);
    });

    departmentField.off("change").on("change", function() {
        let selectedDepartmentId = $(this).val();
        spaceField.empty().append('<option selected disabled>-- Selecione um Espaço --</option>');

        let selectedDepartment = departments.find(dep => dep.id == selectedDepartmentId);
        if (selectedDepartment?.spaces?.length > 0) {
            selectedDepartment.spaces.forEach(space => {
                let spaceOption = $(`<option value="${space.id}">${space.name}</option>`);
                spaceField.append(spaceOption);
            });
        } else {
            spaceField.append('<option disabled>Nenhum espaço disponível</option>');
        }
    });

    spaceField.off("change").on("change", function() {
        let selectedDepartmentId = departmentField.val();
        let selectedSpaceId = $(this).val();
        let selectedDepartment = departments.find(dep => dep.id == selectedDepartmentId);
        let selectedSpace = selectedDepartment?.spaces?.find(space => space.id == selectedSpaceId);

        if (selectedSpace) {
            fetchAndPopulateAuditTable(selectedDepartment);
            handleAuditScoreChange();
            $(".audit-table, #create-audit-btn, #score, #scoreChart, #chart-legend").removeClass("d-none");
        }
    });
}

function initializeChart() {
    auditChart = Highcharts.chart('scoreChart', {
        chart: { type: 'column' },
        title: { text: 'Soma de Pontuação por Categoria' },
        xAxis: { categories: [] },
        yAxis: { min: 0, max: 20, title: { text: 'Pontuação' } },
        series: [{ name: 'Pontuação', data: [], colorByPoint: true }]
    });
}

function updateChart() {
    let categoryScores = {};
    let currentCategory = null;

    $("#audit-table tbody tr").each(function() {
        let row = $(this);
        let categoryCell = row.find("td:first");

        if (categoryCell.hasClass("vertical-text")) {
            currentCategory = categoryCell.text().trim();
        } else if (currentCategory) {
            let score = row.find("td").slice(-5).toArray().reduce((sum, td) => {
                let val = parseInt($(td).text(), 10);
                return isNaN(val) ? sum : sum + val;
            }, 0);

            categoryScores[currentCategory] = (categoryScores[currentCategory] || 0) + Math.min(Math.max(score, 0), 20);
        }
    });

    console.log("Updating chart with:", categoryScores);

    auditChart.series[0].setData(Object.values(categoryScores));
    auditChart.xAxis[0].setCategories(Object.keys(categoryScores));
}

function handleAuditScoreChange() {
    $("#audit-table tbody").off("input", "input[type='number']").on("input", "input[type='number']", function() {
        let inputVal = parseInt($(this).val(), 10) || 0;
        let row = $(this).closest("tr");
        let tds = row.find("td");
        let lastTdIndex = tds.length - 1;

        tds.slice(-5).text("");

        if (inputVal === 0) tds.eq(lastTdIndex).text("4");
        else if (inputVal === 1) tds.eq(lastTdIndex - 1).text("3");
        else if (inputVal === 2) tds.eq(lastTdIndex - 2).text("2");
        else if (inputVal > 2 && inputVal < 6) tds.eq(lastTdIndex - 3).text("1");
        else if (inputVal >= 6) tds.eq(lastTdIndex - 4).text("0");

        getAuditTotalScore();
        updateChart();
    });
}

function fetchAndPopulateAuditTable(dep) {
    fetchAuditTypes().then(auditTypes => {
        const auditType = auditTypes.filter(auditType => auditType.name !== dep.audit_type);
        if (auditType.length > 0) {
            populateAuditTable(auditType);
            initializeChart();
            updateChart();
        }
    }).catch(error => console.error("Error fetching audit types:", error));
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
