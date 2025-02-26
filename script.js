document.getElementById("sendButton").addEventListener("click", function () {
  const chatInput = document.getElementById("chatInput").value.trim();
  if (chatInput) {
    console.log("Sending question:", chatInput);
    // Future API integration for sending chat messages
    document.getElementById("chatInput").value = "";
  }
});

document.getElementById("signInButton").addEventListener("click", function () {
  console.log("Redirecting to sign-in page...");
  // Future authentication integration
});
