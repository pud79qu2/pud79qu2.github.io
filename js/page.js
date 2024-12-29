const sheetUrl = "https://script.google.com/macros/s/AKfycbxW5Vbfndl9GU45AMweqNRPbG1S07dsIcZs70tqnsLj58RRzFXJnDhSqGHV4AcQNE8a/exec"; // 替换为你的 Google Apps Script 部署 URL
let currentPage = 1;
const recordsPerPage = 5;
async function fetchData() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.json();
        return data.filter(row => row.replied === true);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}
function ask() {
    window.location.href = "https://forms.gle/fhXc9Cv7CMPLSqix8"; // 替换为目标链接
}
function renderPage(data, page) {
    const contentDiv = document.getElementById("content");
    const paginationDiv = document.getElementById("pagination");
    contentDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, data.length);

    // Render records
    for (let i = startIndex; i < endIndex; i++) {
        const questionDiv = document.createElement("div");
        questionDiv.className = "question";
        questionDiv.textContent = data[i].question;

        const answerDiv = document.createElement("div");
        answerDiv.className = "answer";
        answerDiv.textContent = data[i].answer;

        contentDiv.appendChild(questionDiv);
        contentDiv.appendChild(answerDiv);
    }

    // Render pagination buttons
    const totalPages = Math.ceil(data.length / recordsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === page ? "active" : "";
        button.disabled = i === page;
        button.addEventListener("click", () => {
            currentPage = i;
            renderPage(data, i);
        });
        paginationDiv.appendChild(button);
    }
}

async function init() {
    const data = await fetchData();
    renderPage(data, 1);
}

document.addEventListener("DOMContentLoaded", init);
