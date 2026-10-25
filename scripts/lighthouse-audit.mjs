import fs from "node:fs";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4173";
fs.mkdirSync("outputs/institutional", { recursive: true });
const chrome = await launch({
  chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  chromeFlags: ["--headless", "--disable-gpu", "--no-first-run"],
});
try {
  for (const route of ["/", "/equipe"]) {
    const result = await lighthouse(base + route, {
      port: chrome.port,
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices"],
      formFactor: "mobile",
      throttlingMethod: "simulate",
    });
    const label = route === "/" ? "home" : "team";
    fs.writeFileSync(
      `outputs/institutional/lighthouse-${label}.html`,
      result.report[0],
    );
    fs.writeFileSync(
      `outputs/institutional/lighthouse-${label}.json`,
      result.report[1],
    );
    console.log(
      JSON.stringify({
        page: route,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, c]) => [
            key,
            Math.round(c.score * 100),
          ]),
        ),
        metrics: {
          fcp: result.lhr.audits["first-contentful-paint"].displayValue,
          lcp: result.lhr.audits["largest-contentful-paint"].displayValue,
          cls: result.lhr.audits["cumulative-layout-shift"].displayValue,
          tbt: result.lhr.audits["total-blocking-time"].displayValue,
        },
        warnings: result.lhr.runWarnings,
        issues: Object.entries(result.lhr.audits)
          .filter(
            ([, a]) =>
              a.score !== null &&
              a.score < 0.9 &&
              a.scoreDisplayMode !== "informative",
          )
          .map(([key, a]) => ({
            id: key,
            title: a.title,
            score: a.score,
            detail: a.displayValue,
            nodes: a.details?.items
              ?.filter((i) => i.node)
              .map((i) => i.node.snippet)
              .slice(0, 5),
          })),
      }),
    );
  }
} finally {
  await chrome.kill();
}
