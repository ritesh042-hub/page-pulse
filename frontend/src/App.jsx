import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://page-pulse-backend-0ntu.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAudit = async (event) => {
    event.preventDefault();

    setError("");
    setReport(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/audit`, {
        url: url.trim(),
      });

      setReport(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Unable to audit this website. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main className="container">
        <section className="hero">
          <p className="eyebrow">Website Audit Tool</p>

          <h1>Page Pulse</h1>

          <p className="subtitle">
            Enter any public webpage URL and receive a quick technical and
            content report.
          </p>

          <form className="audit-form" onSubmit={handleAudit}>
            <label htmlFor="website-url">Website URL</label>

            <div className="input-row">
              <input
                id="website-url"
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                autoComplete="url"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Auditing..." : "Audit page"}
              </button>
            </div>
          </form>

          {error && (
            <div className="message error-message" role="alert">
              {error}
            </div>
          )}
        </section>

        {report && (
          <section className="results" aria-live="polite">
            <div className="results-heading">
              <div>
                <p className="eyebrow">Audit complete</p>
                <h2>{report.title || "Untitled page"}</h2>
              </div>

              <span
                className={`status-badge ${
                  report.httpStatus >= 200 && report.httpStatus < 400
                    ? "success"
                    : "warning"
                }`}
              >
                HTTP {report.httpStatus}
              </span>
            </div>

            <p className="audited-url">{report.url}</p>

            <div className="report-grid">
              <article className="report-card">
                <span>Response time</span>
                <strong>{report.responseTimeMs} ms</strong>
              </article>

              <article className="report-card">
                <span>H1 headings</span>
                <strong>{report.h1Count}</strong>
              </article>

              <article className="report-card">
                <span>Missing image alt text</span>
                <strong>{report.imagesMissingAlt}</strong>
              </article>

              <article className="report-card">
                <span>Approximate word count</span>
                <strong>{report.wordCount}</strong>
              </article>
            </div>

            <article className="description-card">
              <h3>Meta description</h3>
              <p>
                {report.metaDescription ||
                  "No meta description was found on this page."}
              </p>
            </article>
          </section>
        )}
      </main>

      <footer>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noreferrer"
        >
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </div>
  );
}

export default App;