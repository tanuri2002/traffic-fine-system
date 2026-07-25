const API_BASE_URL = window.TRAFFIC_FINE_API_BASE_URL || "http://localhost:5001/api";

const lookupForm = document.getElementById("lookup-form");
const paymentForm = document.getElementById("payment-form");
const lookupMessage = document.getElementById("lookup-message");
const paymentMessage = document.getElementById("payment-message");
const summaryPanel = document.getElementById("summary-panel");
const paymentPanel = document.getElementById("payment-panel");

const referenceInput = document.getElementById("reference-number");
const categoryInput = document.getElementById("category-id");
const cardholderInput = document.getElementById("cardholder-name");
const cardNumberInput = document.getElementById("card-number");
const expiryInput = document.getElementById("expiry-date");
const cvvInput = document.getElementById("cvv");

const summaryFields = {
  reference: document.getElementById("summary-reference"),
  driver: document.getElementById("summary-driver"),
  vehicle: document.getElementById("summary-vehicle"),
  offense: document.getElementById("summary-offense"),
  amount: document.getElementById("summary-amount"),
  date: document.getElementById("summary-date"),
  status: document.getElementById("summary-status")
};

let currentFine = null;

function setMessage(target, message, isError = false) {
  target.textContent = message;
  target.style.color = isError ? "#b42318" : "#5f6875";
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function renderFineSummary(fine) {
  summaryFields.reference.textContent = fine.referenceNumber || "-";
  summaryFields.driver.textContent = fine.driverName || "-";
  summaryFields.vehicle.textContent = fine.vehicleNo || "-";
  summaryFields.offense.textContent = fine.offense || fine.category?.title || "-";
  summaryFields.amount.textContent = formatAmount(fine.fineAmount ?? fine.amountLkr ?? fine.category?.amountLkr);
  summaryFields.date.textContent = formatDate(fine.date || fine.issuedAt);
  summaryFields.status.textContent = fine.status || "-";
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload;
}

lookupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(lookupMessage, "Loading fine summary...");
  setMessage(paymentMessage, "");

  const referenceNumber = referenceInput.value.trim();
  const categoryId = categoryInput.value.trim();

  if (!referenceNumber || !categoryId) {
    setMessage(lookupMessage, "Reference number and category ID are required.", true);
    return;
  }

  const lookupUrl = new URL(`${API_BASE_URL}/fines/lookup`);
  lookupUrl.searchParams.set("referenceNumber", referenceNumber);
  lookupUrl.searchParams.set("categoryId", categoryId);

  try {
    const fine = await fetchJson(lookupUrl.toString());
    currentFine = fine;
    renderFineSummary(fine);
    summaryPanel.hidden = false;
    paymentPanel.hidden = false;
    setMessage(lookupMessage, "Fine loaded successfully.");
  } catch (error) {
    currentFine = null;
    summaryPanel.hidden = true;
    paymentPanel.hidden = true;
    setMessage(lookupMessage, error.message, true);
  }
});

paymentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentFine) {
    setMessage(paymentMessage, "Load a fine before submitting payment.", true);
    return;
  }

  const submitButton = paymentForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setMessage(paymentMessage, "Submitting payment...");

  const payload = {
    referenceNumber: currentFine.referenceNumber,
    categoryId: currentFine.category?.id ?? Number(categoryInput.value),
    channel: "WEB",
    cardholderName: cardholderInput.value.trim(),
    cardNumber: cardNumberInput.value.trim(),
    expiryDate: expiryInput.value.trim(),
    cvv: cvvInput.value.trim()
  };

  try {
    const result = await fetchJson(`${API_BASE_URL}/payments/complete`, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const finalFine = result.fine || currentFine;
    currentFine = finalFine;
    renderFineSummary(finalFine);
    setMessage(paymentMessage, result.message || "Payment completed successfully.");
    setMessage(lookupMessage, "Fine paid and receipt updated.");
    paymentForm.reset();
  } catch (error) {
    setMessage(paymentMessage, error.message, true);
  } finally {
    submitButton.disabled = false;
  }
});
