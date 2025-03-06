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
