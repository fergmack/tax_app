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
