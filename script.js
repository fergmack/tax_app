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

// let selectedStartDate = "2023-04-06";
// let selectedEndDate = "2024-04-05";

// document.querySelectorAll(".tax-year-btn").forEach((btn) => {
//   btn.addEventListener("click", function () {
//     selectedStartDate = this.dataset.start;
//     selectedEndDate = this.dataset.end;
//     document
//       .querySelectorAll(".tax-year-btn")
//       .forEach((b) => b.classList.remove("active"));
//     this.classList.add("active");
//   });
// });

