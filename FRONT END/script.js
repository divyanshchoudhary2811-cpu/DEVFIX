
const API_URL = "http://localhost:5000/api/analyze";

const errorInput = document.getElementById("errorInput");
const languageSelect = document.getElementById("language");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const copyBtn = document.getElementById("copyBtn");

function showAnalysis(data) {
  document.getElementById("errorTitle").textContent = data.title;
  document.getElementById("severity").textContent = data.severity;
  document.getElementById("whatHappened").textContent = data.what;
  document.getElementById("whyHappened").textContent = data.why;
  document.getElementById("howFix").textContent = data.fix;
  document.getElementById("solution").textContent = data.solution;

  result.classList.remove("hidden");
  result.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function analyzeError() {
  const error = errorInput.value.trim();
  const language = languageSelect.value;

  if (!error) {
    alert("Please enter an error message first.");
    errorInput.focus();
    return;
  }

  result.classList.add("hidden");
  loading.classList.remove("hidden");
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing…";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error,
        language
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Could not analyze the error."
      );
    }

    showAnalysis(data);

  } catch (err) {
    alert(
      `${err.message}\n\nMake sure the DEVFIX backend is running on port 5000.`
    );
  } finally {
    loading.classList.add("hidden");
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = 'Analyze error <span>↗</span>';
  }
}

// ANALYZE BUTTON
analyzeBtn.addEventListener("click", analyzeError);

// CLEAR BUTTON
clearBtn.addEventListener("click", () => {
  errorInput.value = "";
  result.classList.add("hidden");
  loading.classList.add("hidden");
  errorInput.focus();
});

// COPY SOLUTION
copyBtn.addEventListener("click", async () => {
  const text = document.getElementById("solution").textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.textContent = "Copy code";
    }, 1500);

  } catch {
    alert(
      "Copy was blocked by the browser. Select and copy the code manually."
    );
  }
});
