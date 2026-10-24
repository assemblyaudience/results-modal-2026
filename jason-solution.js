
(() => {
  const API_URL =
    "https://fpfn4rqbhwnzwe5k2q7tsyy7ga0nbrfb.lambda-url.us-east-2.on.aws/";
  const SELECTOR = ".ta-results[data-page][data-lid]";

  let resultsPromise;

  function getResults() {
    if (!resultsPromise) {
      resultsPromise = fetch(API_URL).then((response) => {
        if (!response.ok) {
          throw new Error(`Election results request failed: ${response.status}`);
        }

        return response.json();
      });
    }

    return resultsPromise;
  }

  function parseRaceRows(resultsTable) {
    return resultsTable.map((row) => ({
      candidate: row.bnm,
      votes: row.vct,
      percent: `${(parseFloat(row.pct) * 100).toFixed(2)}%`,
      lid: row.lid,
    }));
  }

  function renderTable(target, rows) {
    if (!rows.length) {
      target.innerHTML = `
        <hr class="ta-results-rule" aria-hidden="true">
        <p class="ta-results-empty">No results found.</p>
      `;
      return;
    }

    const tableRows = rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.candidate)}</td>
            <td>${escapeHtml(row.votes)}</td>
            <td>${escapeHtml(row.percent)}</td>
          </tr>
        `,
      )
      .join("");

    target.innerHTML = `
      <hr class="ta-results-rule" aria-hidden="true">
      <table class="ta-results-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Votes</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function injectStyles() {
    if (document.getElementById("ta-results-styles")) return;

    const style = document.createElement("style");
    style.id = "ta-results-styles";
    style.textContent = `
      .ta-results {
        margin: 0 0 1.75rem;
        background: #f5f5f5;
        color: #111;
        overflow-x: auto;
      }

      .ta-results-rule {
        border: 0;
        border-top: 1px solid #555;
        height: 0;
        margin: 0 0 18px;
        width: 100%;
        max-width: 100%;
      }

      .ta-results-table {
        width: 100%;
        min-width: 460px;
        border: 0;
        border-collapse: collapse;
        border-spacing: 0;
        background: #f5f5f5;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .ta-results-table thead,
      .ta-results-table tbody,
      .ta-results-table tr,
      .ta-results-table th,
      .ta-results-table td {
        border-left: 0 !important;
        border-right: 0 !important;
        border-top: 0 !important;
      }

      .ta-results-table th,
      .ta-results-table td {
        border-bottom: 1px solid #d9d9d9 !important;
        padding: 10px;
        text-align: left;
        vertical-align: middle;
      }

      .ta-results-table th {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.2;
        padding-top: 4px;
        padding-bottom: 12px;
      }

      .ta-results-table td {
        font-size: 24px;
        font-weight: 400;
        line-height: 1.35;
      }

      .ta-results-table th:first-child,
      .ta-results-table td:first-child {
        padding-left: 10px;
        width: 48%;
      }

      .ta-results-table th:nth-child(2),
      .ta-results-table td:nth-child(2),
      .ta-results-table th:nth-child(3),
      .ta-results-table td:nth-child(3) {
        white-space: nowrap;
      }

      .ta-results-loading,
      .ta-results-empty,
      .ta-results-error {
        margin: 0;
        padding: 0 10px 10px;
        color: #111;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 18px;
        line-height: 1.4;
      }

      @media (max-width: 660px) {
        .ta-results-table {
          min-width: 420px;
        }

        .ta-results-table th {
          font-size: 24px;
        }

        .ta-results-table td {
          font-size: 20px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  async function hydrateResults() {
    injectStyles();

    const targets = Array.from(document.querySelectorAll(SELECTOR));
    if (!targets.length) return;

    for (const target of targets) {
      target.innerHTML = `
        <hr class="ta-results-rule" aria-hidden="true">
        <p class="ta-results-loading">Loading results...</p>
      `;
    }

    try {
      const results = await getResults();

      for (const target of targets) {
        const page = target.dataset.page;
        const lid = target.dataset.lid;
        const pageResults = results[page] || [];
        const rows = parseRaceRows(pageResults).filter((row) => row.lid === lid);

        renderTable(target, rows);
      }
    } catch (error) {
      for (const target of targets) {
        target.innerHTML = `
          <hr class="ta-results-rule" aria-hidden="true">
          <p class="ta-results-error">Results are temporarily unavailable.</p>
        `;
      }

      console.error(error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrateResults);
  } else {
    hydrateResults();
  }
})();
