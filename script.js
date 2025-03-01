document.getElementById("sendButton").addEventListener("click", function () {
  const chatInput = document.getElementById("chatInput").value.trim();
  if (chatInput) {
    console.log("Sending question:", chatInput);
    document.getElementById("chatInput").value = "";
  }
});

document.getElementById("signInButton").addEventListener("click", function () {
  console.log("Redirecting to sign-in page...");
});

let selectedStartDate = "2023-04-06";
let selectedEndDate = "2024-04-05";

document.querySelectorAll(".tax-year-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    selectedStartDate = this.dataset.start;
    selectedEndDate = this.dataset.end;
    document
      .querySelectorAll(".tax-year-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
  });
});

document
  .getElementById("addExpenseButton")
  .addEventListener("click", function () {
    const tableBody = document.querySelector("#expenseTable tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><input type="date" class="expense-date"></td>
      <td><input type="text" class="expense-name" placeholder="Enter expense"></td>
      <td><input type="number" class="expense-price" placeholder="£0.00" min="0" step="0.01"></td>
      <td>
          <select class="expense-category">
              <option value="Rent, rates, insurance and ground rents">Rent, rates, insurance and ground rents</option>
              <option value="Property repairs and maintenance">Property repairs and maintenance</option>
              <option value="Non-residential property finance costs">Non-residential property finance costs</option>
              <option value="Legal, management and other professional fees">Legal, management and other professional fees</option>
              <option value="Costs of services provided, including wages">Costs of services provided, including wages</option>
              <option value="Other allowable property expenses">Other allowable property expenses</option>
          </select>
      </td>
      <td><button class="delete-expense">Remove</button></td>
    `;

    tableBody.appendChild(row);

    const dateInput = row.querySelector(".expense-date");
    dateInput.min = selectedStartDate;
    dateInput.max = selectedEndDate;

    dateInput.addEventListener("input", function () {
      let selectedYear = new Date(this.value).getFullYear();
      if (selectedYear < 2023 || selectedYear > 2024) {
        alert("Only dates within 2023 and 2024 are allowed.");
        this.value = "";
      }
    });

    row.querySelector(".expense-price").addEventListener("input", updateTotal);
    row
      .querySelector(".expense-category")
      .addEventListener("change", updateTotal);

    row.querySelector(".delete-expense").addEventListener("click", function () {
      row.remove();
      updateTotal();
    });
  });

// function updateTotal() {
//   let total = 0;
//   document.querySelectorAll(".expense-price").forEach((input) => {
//     total += parseFloat(input.value) || 0;
//   });
//   document.getElementById("totalAmount").textContent = total.toFixed(2);
// }

// New grouped by functionality >>>

function updateTotal() {
  let total = 0;
  const categoryTotals = {};

  document.querySelectorAll(".expense-price").forEach((input) => {
    const row = input.closest("tr");
    const price = parseFloat(input.value) || 0;
    const category = row.querySelector(".expense-category").value;

    total += price;
    categoryTotals[category] = (categoryTotals[category] || 0) + price;
  });

  document.getElementById("totalAmount").textContent = total.toFixed(2);
  updateCategoryTable(categoryTotals);
}

function updateCategoryTable(categoryTotals) {
  const tbody = document.querySelector("#categoryTable tbody");
  tbody.innerHTML = "";

  Object.entries(categoryTotals).forEach(([category, amount]) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${category}</td><td>£${amount.toFixed(2)}</td>`;
    tbody.appendChild(row);
  });
}

// ^^^ group by functionality

document
  .getElementById("saveExpensesButton")
  .addEventListener("click", function () {
    const expenses = [];
    document.querySelectorAll("#expenseTable tbody tr").forEach((row) => {
      const date = row.querySelector(".expense-date").value;
      const name = row.querySelector(".expense-name").value.trim();
      const price = parseFloat(row.querySelector(".expense-price").value) || 0;
      const category = row.querySelector(".expense-category").value;

      if (date && name && price > 0) {
        expenses.push({ date, name, price, category });
      }
    });

    if (expenses.length === 0) {
      alert("Please add at least one valid expense.");
      return;
    }

    console.log("Sending expenses:", expenses);

    fetch("YOUR_API_GATEWAY_URL", {
      method: "POST",
      body: JSON.stringify({ expenses }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Expenses saved successfully!");
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error saving expenses:", error);
        alert("Failed to save expenses.");
      });
  });

document.addEventListener("DOMContentLoaded", function () {
  for (let i = 0; i < 5; i++) {
    document.getElementById("addExpenseButton").click();
  }

  // -- download functionality
  document.getElementById("exportExcel").addEventListener("click", function () {
    exportTableToExcel("categoryTable", "Amounts_by_Category");
  });

  document.getElementById("exportCSV").addEventListener("click", function () {
    exportTableToCSV("categoryTable", "Amounts_by_Category.csv");
  });

  document.getElementById("exportDoc").addEventListener("click", function () {
    exportTableToDoc("categoryTable", "Amounts_by_Category.doc");
  });

  // Export to Excel
  function exportTableToExcel(tableID, filename) {
    let table = document.getElementById(tableID);
    let wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, filename + ".xlsx");
  }

  // Export to CSV
  function exportTableToCSV(tableID, filename) {
    let table = document.getElementById(tableID);
    let rows = table.querySelectorAll("tr");
    let csvContent = [];

    rows.forEach((row) => {
      let cols = row.querySelectorAll("th, td");
      let rowData = Array.from(cols).map((col) => `"${col.innerText}"`);
      csvContent.push(rowData.join(","));
    });

    let csvBlob = new Blob([csvContent.join("\n")], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(csvBlob);
    link.download = filename;
    link.click();
  }

  // Export to DOC
  function exportTableToDoc(tableID, filename) {
    let table = document.getElementById(tableID);
    let html = `<table border="1">${table.innerHTML}</table>`;
    let blob = new Blob(["\ufeff", html], { type: "application/msword" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  // ^^^
});
