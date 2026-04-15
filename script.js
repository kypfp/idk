const form = document.getElementById("dispatchForm");
const logsBox = document.getElementById("logs");
const clearLogsBtn = document.getElementById("clearLogs");

function addLog(message, type = "") {
  const logItem = document.createElement("div");
  logItem.className = `log ${type}`.trim();

  const now = new Date().toLocaleTimeString();
  logItem.textContent = `[${now}] ${message}`;

  logsBox.prepend(logItem);
}

function getSelectedServices() {
  return [...document.querySelectorAll('input[name="services"]:checked')]
    .map((item) => item.value);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const batch = document.getElementById("batch").value;
  const services = getSelectedServices();

  if (!phone) {
    addLog("Phone number is required.", "error");
    return;
  }

  const payload = {
    phone,
    batch,
    services
  };

  addLog("Preparing outbound request...");
  addLog(`Target number received: ${phone}`);
  addLog(`Request count set to: ${batch}`);
  addLog(`Modules loaded: ${services.length ? services.join(", ") : "None"}`);

  try {
    const response = await fetch("http://127.0.0.1:5000/send-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed.");
    }

    addLog(data.message || "Request completed successfully.", "ok");

    if (Array.isArray(data.logs)) {
      data.logs.forEach((entry) => addLog(entry, "ok"));
    }
  } catch (error) {
    addLog(`ERROR: ${error.message}`, "error");
  }
});

clearLogsBtn.addEventListener("click", () => {
  logsBox.innerHTML = "";
  addLog("Terminal log cleared.", "ok");
});

window.addEventListener("load", () => {
  addLog("Interface render complete.", "ok");
  addLog("Live activity log mounted successfully.", "ok");
});
