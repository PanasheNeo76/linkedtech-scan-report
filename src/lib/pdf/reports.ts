import { createReport } from "./builder";
import { GUIDES, type Block, type Guide } from "./guides";
import {
  formatNumber,
  grade,
  type Issue,
  type ScanResult,
} from "../scan-types";

function stamp(result: ScanResult) {
  return new Date(result.scannedAt).toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function severityLabel(severity: Issue["severity"]) {
  if (severity === "critical") return "High";
  if (severity === "warning") return "Medium";
  return "Low";
}

export function buildScorecardPdf(result: ScanResult) {
  const r = createReport();
  const kindLabel =
    result.kind === "linkedin" ? "LinkedIn profile" : "Website page";

  r.cover({
    eyebrow: "Report 1 of 4 - Scan data",
    title: "Visibility Scorecard",
    subtitle: `A scored assessment of ${result.domain}, covering discoverability, content depth, credibility signals and engagement potential.`,
    meta: [
      `Target: ${result.finalUrl}`,
      `Type: ${kindLabel}`,
      `Scanned: ${stamp(result)}`,
      `Overall score: ${result.scores.overall}/100 (${grade(result.scores.overall)})`,
    ],
  });

  r.h1("Executive summary");
  r.p(
    `${result.title || result.domain} scores ${result.scores.overall} out of 100 for overall visibility, which places it in the "${grade(result.scores.overall)}" band. The scan read the live page and evaluated ${formatNumber(result.metrics.wordCount)} words of content, ${result.metrics.internalLinks + result.metrics.externalLinks} links and the full set of search and social metadata.`,
  );
  r.p(
    result.issues.length
      ? `We identified ${result.issues.length} improvement opportunities, of which ${result.issues.filter((i) => i.severity === "critical").length} are high priority. Addressing the high priority items alone typically moves the overall score by 8 to 15 points.`
      : "No material issues were detected on this page, which is unusual and indicates a well-maintained presence.",
  );

  r.h2("Headline numbers");
  r.kvGrid([
    ["Overall score", `${result.scores.overall}/100`],
    ["Band", grade(result.scores.overall)],
    ["Est. monthly views", formatNumber(result.estimatedMonthlyViews)],
    ["Est. monthly impressions", formatNumber(result.estimatedImpressions)],
    ["Untapped view potential", formatNumber(result.profileViewPotential)],
    ["Content volume", `${formatNumber(result.metrics.wordCount)} words`],
  ]);

  r.h1("Score breakdown");
  r.scoreBar(
    "Discoverability",
    result.scores.discoverability,
    "Titles, descriptions, headings, canonical and structured data - how easily search engines understand and index the page.",
  );
  r.scoreBar(
    "Content depth",
    result.scores.content,
    "Volume, structure, readability and imagery - whether there is enough substance to compete.",
  );
  r.scoreBar(
    "Credibility signals",
    result.scores.credibility,
    "Social preview metadata, linked profiles, outbound references and response health.",
  );
  r.scoreBar(
    "Engagement potential",
    result.scores.engagement,
    "How well the page performs when shared, and how likely a visitor is to act.",
  );
  r.scoreBar(
    "Overall visibility",
    result.scores.overall,
    "Weighted composite: discoverability 32%, content 28%, credibility 22%, engagement 18%.",
  );

  r.h1("Benchmark against peers");
  r.p(
    "Peer averages are drawn from the LinkedTech reference set of professional profiles and small-business pages. The top decile column shows what leading pages in the same category achieve.",
  );
  r.table(
    ["Dimension", "You", "Peer average", "Top decile", "Gap to top"],
    result.benchmark.map((b) => [
      b.label,
      String(b.you),
      String(b.average),
      String(b.top),
      `${Math.max(0, b.top - b.you)} pts`,
    ]),
    [150, 60, 100, 90, 83],
  );

  r.h1("Estimated visibility and reach");
  r.p(
    "Estimates are modelled from the measured signals on the page, not from analytics access. They are directional: use them to size opportunity and track change between scans rather than as absolute traffic counts.",
  );
  r.table(
    ["Channel", "Est. monthly views", "Share of total"],
    result.channels.map((c) => [
      c.channel,
      formatNumber(c.monthly),
      `${Math.round(c.share * 100)}%`,
    ]),
    [160, 170, 153],
  );
  r.callout(
    "Where the upside sits",
    `At the current score, this page is modelled at roughly ${formatNumber(result.estimatedMonthlyViews)} views per month. Closing the high priority items moves the modelled figure towards ${formatNumber(result.profileViewPotential)} views per month, mostly through search and social preview improvements.`,
    "info",
  );

  r.h1("What is already working");
  r.bullets(result.strengths);

  r.h1("Priority actions");
  if (result.issues.length) {
    r.table(
      ["Action", "Priority", "Area"],
      result.issues.map((i) => [i.fix, severityLabel(i.severity), i.area]),
      [300, 90, 93],
    );
  } else {
    r.p(
      "No priority actions were generated. Re-scan after your next content update to confirm nothing has regressed.",
    );
  }

  r.h1("Method and limitations");
  r.p(
    "LinkedTech reads the page as an anonymous visitor, extracts its rendered content, metadata and link graph, then scores each dimension against fixed rules. No login, analytics access or historical data is used. Pages that require authentication, block automated visitors or render content only after user interaction will score lower than a human reviewer would judge them, and estimates assume the page remains reachable and unchanged.",
  );
  r.small(
    `Report generated by LinkedTech for ${result.finalUrl} on ${stamp(result)}.`,
  );

  r.save(
    `LinkedTech-Visibility-Scorecard-${result.domain.replace(/[^a-z0-9]/gi, "-")}.pdf`,
    `LinkedTech - Visibility Scorecard - ${result.domain}`,
  );
}

export function buildTechnicalPdf(result: ScanResult) {
  const r = createReport();
  const m = result.metrics;
  const yesNo = (value: boolean) => (value ? "Present" : "Missing");

  r.cover({
    eyebrow: "Report 2 of 4 - Scan data",
    title: "Content & Technical Audit",
    subtitle: `The full evidence log from the scan of ${result.domain}: metadata, structure, keyword profile, link graph and every detected issue with its remedy.`,
    meta: [
      `Target: ${result.finalUrl}`,
      `Scanned: ${stamp(result)}`,
      `Issues found: ${result.issues.length}`,
      `Response status: ${m.loadStatus}`,
    ],
  });

  r.h1("Page identity");
  r.table(
    ["Field", "Value"],
    [
      ["Page title", result.title || "Not set"],
      ["Title length", `${m.titleLength} characters`],
      ["Meta description", result.description || "Not set"],
      ["Description length", `${m.descriptionLength} characters`],
      ["Final URL", result.finalUrl],
      ["Domain", result.domain],
      ["Detected type", result.kind === "linkedin" ? "LinkedIn profile" : "Website page"],
    ],
    [130, 353],
  );

  r.h1("Technical signals");
  r.table(
    ["Signal", "Status", "Why it matters"],
    [
      ["Response status", String(m.loadStatus), "Anything other than 200 blocks or weakens indexing"],
      ["Mobile viewport", yesNo(m.hasViewport), "Required for usable mobile rendering"],
      ["Canonical URL", yesNo(m.hasCanonical), "Prevents duplicate versions competing"],
      ["Structured data", yesNo(m.hasStructuredData), "Enables richer search results"],
      ["Social preview tags", yesNo(m.hasOpenGraph), "Controls how shared links look"],
      ["X (Twitter) card", yesNo(m.hasTwitterCard), "Larger, more clickable previews"],
    ],
    [130, 90, 263],
  );

  r.h1("Structure and content");
  r.table(
    ["Measure", "Value", "Guidance"],
    [
      ["Word count", formatNumber(m.wordCount), "600+ words for competitive pages"],
      ["Main headings (H1)", String(m.headings.h1), "Exactly one"],
      ["Section headings (H2)", String(m.headings.h2), "3-8 for scannability"],
      ["Sub headings (H3)", String(m.headings.h3), "Use to break long sections"],
      ["Average sentence length", `${m.avgSentenceWords} words`, "Under 22 words reads easily"],
      ["Images", String(m.images), "3+ supporting visuals"],
      ["Images without alt text", String(m.imagesMissingAlt), "Should be zero"],
    ],
    [160, 90, 233],
  );

  r.h1("Link graph");
  r.kvGrid([
    ["Internal links", formatNumber(m.internalLinks)],
    ["External links", formatNumber(m.externalLinks)],
    ["Linked platforms", m.socialProfiles.length ? m.socialProfiles.join(", ") : "None detected"],
    ["Total links read", formatNumber(m.internalLinks + m.externalLinks)],
  ]);
  r.p(
    m.internalLinks >= 5
      ? "Internal linking is sufficient for crawlers to discover related pages from here."
      : "Internal linking is thin, which limits how easily crawlers and visitors move deeper into the site from this page.",
  );

  r.h1("Keyword profile");
  r.p(
    "These are the most frequent meaningful terms in the page's visible text. They are what a search engine is most likely to associate with the page, whether or not that matches your intention.",
  );
  if (result.keywords.length) {
    r.table(
      ["Term", "Occurrences", "Density"],
      result.keywords.map((k) => [
        k.term,
        String(k.count),
        `${k.density.toFixed(2)}%`,
      ]),
      [220, 130, 133],
    );
    r.callout(
      "Read this as positioning",
      `The dominant term on this page is "${result.keywords[0]?.term}". If that is not the phrase you want to be found for, the page copy is describing something other than your intended offer.`,
      result.keywords[0] && result.keywords[0].density > 4 ? "warn" : "info",
    );
  } else {
    r.p("Not enough text was found to build a keyword profile.");
  }

  r.h1("Detected issues and remedies");
  if (result.issues.length) {
    result.issues.forEach((issue, index) => {
      r.h2(`${index + 1}. ${issue.title}`);
      r.small(`Area: ${issue.area}  |  Priority: ${severityLabel(issue.severity)}`);
      r.p(issue.detail);
      r.callout("Recommended fix", issue.fix, issue.severity === "critical" ? "risk" : "warn");
    });
  } else {
    r.p("No issues were detected against the current rule set.");
  }

  r.h1("Content sample read by the scanner");
  r.p(result.excerpt || "No readable body text was returned.");

  r.h1("How to use this audit");
  r.numbered([
    "Work through the high priority items first; they gate the effect of everything else.",
    "Fix metadata and structure before adding new content.",
    "Re-scan after each batch of changes and record the score movement.",
    "Keep the keyword profile aligned with your intended positioning at every review.",
  ]);
  r.small(`Evidence log generated by LinkedTech on ${stamp(result)}.`);

  r.save(
    `LinkedTech-Technical-Audit-${result.domain.replace(/[^a-z0-9]/gi, "-")}.pdf`,
    `LinkedTech - Content & Technical Audit - ${result.domain}`,
  );
}

function renderBlocks(r: ReturnType<typeof createReport>, blocks: Block[]) {
  for (const block of blocks) {
    switch (block.type) {
      case "p":
        r.p(block.text);
        break;
      case "h2":
        r.h2(block.text);
        break;
      case "bullets":
        r.bullets(block.items);
        break;
      case "numbered":
        r.numbered(block.items);
        break;
      case "callout":
        r.callout(block.title, block.body, block.tone);
        break;
      case "table":
        r.table(block.head, block.rows, block.widths);
        break;
    }
  }
}

export function buildGuidePdf(guide: Guide, index: number) {
  const r = createReport();
  r.cover({
    eyebrow: `Report ${index} of 4 - Reference library`,
    title: guide.title,
    subtitle: guide.subtitle,
    meta: guide.meta,
  });

  r.h1("Contents");
  r.numbered(guide.sections.map((s) => s.heading));

  for (const section of guide.sections) {
    r.h1(section.heading);
    renderBlocks(r, section.blocks);
  }

  r.h1("About this document");
  r.p(
    "This is a fixed reference edition from the LinkedTech library. Its contents do not change between scans, so you can share it with a team, annotate it, and use it as the standard alongside any scan report.",
  );
  r.save(guide.filename, `LinkedTech - ${guide.title}`);
}

export function buildReport(id: string, result: ScanResult | null) {
  if (id === "scorecard" && result) return buildScorecardPdf(result);
  if (id === "audit" && result) return buildTechnicalPdf(result);
  if (id === "linkedin-playbook") return buildGuidePdf(GUIDES[0], 3);
  if (id === "seo-playbook") return buildGuidePdf(GUIDES[1], 4);
}
