
const {
  getErrorAnalysis
} = require("../services/errorAnalyzer");

const analyzeError = async (req, res) => {
  try {
    const { error, language, code = "" } = req.body || {};

    const supportedLanguages = [
      "C", "C++", "Java", "Python",
      "JavaScript", "HTML", "CSS", "SQL"
    ];

    if (typeof error !== "string" || !error.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter an error message."
      });
    }

    if (error.length > 20000) {
      return res.status(413).json({
        success: false,
        message: "Error message is too long."
      });
    }

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language."
      });
    }

    if (typeof code !== "string" || code.length > 30000) {
      return res.status(400).json({
        success: false,
        message: "Invalid or excessively long source code."
      });
    }

    const result = await getErrorAnalysis(
      error.trim(),
      language,
      code
    );

    return res.status(200).json(result);

  } catch (err) {
    console.error("DEVFIX AI error:", err.message);

    if (err.status === 401) {
      return res.status(502).json({
        success: false,
        message: "AI authentication failed. Check your API key."
      });
    }

    if (err.status === 429) {
      return res.status(503).json({
        success: false,
        message: "AI rate limit or quota reached. Check your API usage."
      });
    }

    return res.status(502).json({
      success: false,
      message: "AI analysis failed. Please try again."
    });
  }
};

module.exports = { analyzeError };
