// Function to log time locally when offline
function logTimeOffline(value) {
  const timestamp = new Date().toLocaleString();
  const timeLog = { timestamp, value };

  // Store data in localStorage
  let logs = JSON.parse(localStorage.getItem("timeLogs")) || [];
  logs.push(timeLog);
  localStorage.setItem("timeLogs", JSON.stringify(logs));

  // Update the UI with a confirmation message
  alert("Your time log has been saved locally. It will sync when you are online!");
}

// Add event listeners to buttons
document.getElementById("button1").addEventListener("click", function () {
  logTimeOffline("Member");
});

document.getElementById("button2").addEventListener("click", function () {
  logTimeOffline("Paying Public");
});

document.getElementById("button3").addEventListener("click", function () {
  logTimeOffline("Mass");
});

// Function to sync offline logs when online
function syncOfflineLogs() {
  const logs = JSON.parse(localStorage.getItem("timeLogs")) || [];

  if (logs.length > 0) {
    logs.forEach((log, index) => {
      // Send data to Google Apps Script via fetch()
      fetch("https://script.google.com/macros/s/AKfycby1qXSnvUE3O7aq4a1KBSpA1tI_9Dr0CTdlD8lycvkJX-GI2HO-ntZwrGj8NZrMQTF6/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([log.timestamp, log.value]),
        mode: "no-cors"
      })
        .then(response => response.text())
        .then(data => {
          console.log("Server response:", data);

          // Remove successfully synced log from localStorage
          logs.splice(index, 1);  // Remove the synced log
          localStorage.setItem("timeLogs", JSON.stringify(logs));  // Save updated logs
        })
        .catch(error => console.error("Error:", error));
    });
  }
}


// Check if the user is online and sync data if possible
window.addEventListener("online", syncOfflineLogs);
