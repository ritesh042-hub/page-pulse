const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { parsePage } = require("./parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Page Pulse API is running",
  });
});

app.post("/api/audit", async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      error: "A valid URL is required.",
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid URL format. Include http:// or https://",
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      error: "Only HTTP and HTTPS URLs are supported.",
    });
  }

  const startTime = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      maxRedirects: 5,
      responseType: "text",
      headers: {
        "User-Agent": "PagePulseAuditor/1.0",
      },
      validateStatus: () => true,
    });

    const responseTime = Date.now() - startTime;

    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/html")) {
      return res.status(415).json({
        error: "The requested URL did not return an HTML page.",
        httpStatus: response.status,
        contentType,
      });
    }

    const report = parsePage(response.data);

    return res.json({
      url: response.request?.res?.responseUrl || url,
      httpStatus: response.status,
      responseTimeMs: responseTime,
      ...report,
    });
  } catch (error) {
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    ) {
      return res.status(504).json({
        error: "The website request timed out.",
      });
    }

    return res.status(502).json({
      error: "Unable to fetch the requested website.",
      details: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
  });
});

app.listen(PORT, () => {
  console.log(`Page Pulse API running on http://localhost:${PORT}`);
});