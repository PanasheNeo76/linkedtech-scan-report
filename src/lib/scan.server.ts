import type {
  Issue,
  KeywordRow,
  ScanMetrics,
  ScanResult,
  ScoreSet,
} from "./scan-types";

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const STOP_WORDS = new Set(
  `a about above after again against all am an and any are as at be because been before being below between both but by can cannot could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with you your yours yourself yourselves us via new get got also may many one two use using make made per into like via`.split(
    /\s+/,
  ),
);

type FirecrawlDoc = {
  markdown?: string;
  html?: string;
  links?: string[];
  metadata?: Record<string, unknown>;
};

async function firecrawlScrape(url: string): Promise<FirecrawlDoc> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["FIRECRAWL_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("The page scanner is not configured yet.");
  }

  const response = await fetch(`${GATEWAY}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html", "links"],
      onlyMainContent: false,
      waitFor: 1200,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Firecrawl scrape failed [${response.status}]: ${body}`);
    if (response.status === 402) {
      throw new Error("The scanning service is out of credits right now.");
    }
    throw new Error(
      `We could not read that page (status ${response.status}). It may block automated visitors.`,
    );
  }

  const payload = (await response.json()) as
    | (FirecrawlDoc & { success?: boolean; data?: FirecrawlDoc; error?: string })
    | null;

  if (!payload) throw new Error("The page returned no readable content.");
  if (payload.success === false) {
    throw new Error(payload.error || "The page could not be read.");
  }

  const doc: FirecrawlDoc = {
    markdown: payload.markdown ?? payload.data?.markdown,
    html: payload.html ?? payload.data?.html,
    links: payload.links ?? payload.data?.links,
    metadata: payload.metadata ?? payload.data?.metadata,
  };

  if (!doc.markdown && !doc.html) {
    throw new Error("The page returned no readable content.");
  }
  return doc;
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function countMatches(html: string, pattern: RegExp): number {
  const matches = html.match(pattern);
  return matches ? matches.length : 0;
}

function topKeywords(text: string, wordCount: number): KeywordRow[] {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([term, count]) => ({
      term,
      count,
      density: wordCount ? (count / wordCount) * 100 : 0,
    }));
}

function collectSocialProfiles(links: string[]): string[] {
  const hosts = [
    "linkedin.com",
    "x.com",
    "twitter.com",
    "instagram.com",
    "facebook.com",
    "youtube.com",
    "github.com",
    "tiktok.com",
  ];
  const found = new Set<string>();
  for (const link of links) {
    for (const host of hosts) {
      if (link.includes(host)) found.add(host.replace(".com", ""));
    }
  }
  return [...found];
}

function buildMetrics(doc: FirecrawlDoc, finalUrl: string): ScanMetrics {
  const html = doc.html ?? "";
  const markdown = doc.markdown ?? "";
  const meta = doc.metadata ?? {};
  const text = markdown.replace(/[#*_>`\-|[\]()]/g, " ");
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 12);

  let host = "";
  try {
    host = new URL(finalUrl).hostname.replace(/^www\./, "");
  } catch {
    host = finalUrl;
  }

  const links = (doc.links ?? []).filter((l) => /^https?:/i.test(l));
  const internal = links.filter((l) => l.includes(host));

  const title = String(meta["title"] ?? meta["og:title"] ?? "");
  const description = String(
    meta["description"] ?? meta["og:description"] ?? "",
  );

  return {
    wordCount: words.length,
    headings: {
      h1: countMatches(markdown, /^#\s+/gm) || countMatches(html, /<h1[\s>]/gi),
      h2: countMatches(markdown, /^##\s+/gm) || countMatches(html, /<h2[\s>]/gi),
      h3:
        countMatches(markdown, /^###\s+/gm) || countMatches(html, /<h3[\s>]/gi),
    },
    internalLinks: internal.length,
    externalLinks: links.length - internal.length,
    images: countMatches(html, /<img[\s>]/gi),
    imagesMissingAlt:
      countMatches(html, /<img(?![^>]*\balt=)[^>]*>/gi) ||
      Math.max(0, countMatches(html, /<img[\s>]/gi) - countMatches(html, /alt=/gi)),
    titleLength: title.length,
    descriptionLength: description.length,
    hasOpenGraph: Boolean(meta["og:title"] || meta["og:description"] || /property=["']og:/i.test(html)),
    hasTwitterCard: Boolean(meta["twitter:card"] || /name=["']twitter:/i.test(html)),
    hasCanonical: /rel=["']canonical["']/i.test(html),
    hasStructuredData: /application\/ld\+json/i.test(html),
    hasViewport: /name=["']viewport["']/i.test(html),
    avgSentenceWords: sentences.length
      ? Math.round(words.length / sentences.length)
      : 0,
    socialProfiles: collectSocialProfiles(links),
    loadStatus: Number(meta["statusCode"] ?? 200),
  };
}

function scoreScan(m: ScanMetrics, kind: ScanResult["kind"]): ScoreSet {
  let discoverability = 30;
  if (m.titleLength >= 20 && m.titleLength <= 65) discoverability += 18;
  else if (m.titleLength > 0) discoverability += 8;
  if (m.descriptionLength >= 70 && m.descriptionLength <= 165)
    discoverability += 16;
  else if (m.descriptionLength > 0) discoverability += 7;
  if (m.headings.h1 === 1) discoverability += 10;
  else if (m.headings.h1 > 1) discoverability += 4;
  if (m.hasCanonical) discoverability += 8;
  if (m.hasStructuredData) discoverability += 10;
  if (m.hasViewport) discoverability += 6;
  if (m.internalLinks >= 10) discoverability += 6;

  let content = 22;
  content += Math.min(30, m.wordCount / 40);
  content += Math.min(14, m.headings.h2 * 2);
  content += Math.min(8, m.headings.h3);
  if (m.avgSentenceWords > 0 && m.avgSentenceWords <= 22) content += 12;
  else if (m.avgSentenceWords <= 30) content += 6;
  if (m.images >= 3) content += 8;
  content -= Math.min(12, m.imagesMissingAlt * 2);

  let credibility = 34;
  if (m.hasOpenGraph) credibility += 12;
  if (m.hasTwitterCard) credibility += 8;
  credibility += Math.min(18, m.socialProfiles.length * 5);
  credibility += Math.min(12, m.externalLinks / 4);
  if (m.loadStatus === 200) credibility += 10;
  if (m.hasStructuredData) credibility += 6;

  let engagement = 28;
  if (m.hasOpenGraph && m.hasTwitterCard) engagement += 16;
  engagement += Math.min(18, m.images * 2);
  engagement += Math.min(14, m.socialProfiles.length * 4);
  engagement += Math.min(16, m.wordCount / 80);
  if (kind === "linkedin") engagement += 6;

  const parts = {
    discoverability: clamp(discoverability),
    content: clamp(content),
    credibility: clamp(credibility),
    engagement: clamp(engagement),
  };

  const overall = clamp(
    parts.discoverability * 0.32 +
      parts.content * 0.28 +
      parts.credibility * 0.22 +
      parts.engagement * 0.18,
  );

  return { overall, ...parts };
}

function buildIssues(m: ScanMetrics, kind: ScanResult["kind"]): Issue[] {
  const issues: Issue[] = [];
  const push = (i: Issue) => issues.push(i);

  if (m.titleLength === 0)
    push({
      area: "Search",
      severity: "critical",
      title: "No page title found",
      detail: "Search engines and social previews have nothing to show.",
      fix: "Add a 40-60 character title that names the person or company and the offer.",
    });
  else if (m.titleLength > 65)
    push({
      area: "Search",
      severity: "warning",
      title: `Title is long (${m.titleLength} characters)`,
      detail: "Longer titles get cut off in search results.",
      fix: "Trim the title to 60 characters and put the key phrase first.",
    });

  if (m.descriptionLength === 0)
    push({
      area: "Search",
      severity: "critical",
      title: "Missing meta description",
      detail: "The snippet under your search listing is auto-generated.",
      fix: "Write a 140-160 character summary with a clear call to action.",
    });
  else if (m.descriptionLength < 70)
    push({
      area: "Search",
      severity: "warning",
      title: "Short meta description",
      detail: `Only ${m.descriptionLength} characters of snippet copy.`,
      fix: "Expand to 140-160 characters covering the benefit and audience.",
    });

  if (m.headings.h1 === 0)
    push({
      area: "Structure",
      severity: "critical",
      title: "No main heading",
      detail: "The page has no single top-level headline.",
      fix: "Add exactly one main headline describing the page in plain language.",
    });
  else if (m.headings.h1 > 1)
    push({
      area: "Structure",
      severity: "warning",
      title: `${m.headings.h1} competing main headings`,
      detail: "Multiple top headings dilute the topic signal.",
      fix: "Keep one main headline and demote the rest to section headings.",
    });

  if (m.wordCount < 300)
    push({
      area: "Content",
      severity: "critical",
      title: `Thin content (${m.wordCount} words)`,
      detail: "There is not enough text to rank for meaningful phrases.",
      fix: "Grow the page to 600+ words of specific, useful copy.",
    });
  else if (m.wordCount < 600)
    push({
      area: "Content",
      severity: "warning",
      title: "Content is light",
      detail: `${m.wordCount} words is below the competitive range.`,
      fix: "Add proof, results, FAQs and service detail to reach 800+ words.",
    });

  if (!m.hasOpenGraph)
    push({
      area: "Social",
      severity: "critical",
      title: "No social preview tags",
      detail: "Shared links appear as bare text with no image or summary.",
      fix: "Add social preview title, description and a 1200x630 image.",
    });
  if (!m.hasTwitterCard)
    push({
      area: "Social",
      severity: "warning",
      title: "No X (Twitter) card",
      detail: "Posts on X show a smaller, less clickable preview.",
      fix: "Add a summary_large_image card with a matching image.",
    });
  if (m.imagesMissingAlt > 0)
    push({
      area: "Accessibility",
      severity: "warning",
      title: `${m.imagesMissingAlt} images without descriptions`,
      detail: "Image search and screen readers cannot interpret them.",
      fix: "Write short, descriptive alt text for every meaningful image.",
    });
  if (!m.hasStructuredData)
    push({
      area: "Search",
      severity: "warning",
      title: "No structured data",
      detail: "Rich result eligibility is limited without markup.",
      fix: kind === "linkedin"
        ? "On your own site, add Person markup that links to this profile."
        : "Add Organization, Person or Article markup in JSON-LD.",
    });
  if (m.socialProfiles.length === 0)
    push({
      area: "Authority",
      severity: "warning",
      title: "No linked social profiles",
      detail: "Search engines cannot connect this page to your wider presence.",
      fix: "Link out to LinkedIn and one or two other active profiles.",
    });
  if (m.internalLinks < 5 && kind === "website")
    push({
      area: "Structure",
      severity: "warning",
      title: "Few internal links",
      detail: `Only ${m.internalLinks} links point deeper into the site.`,
      fix: "Link each page to 3-5 related pages with descriptive anchor text.",
    });
  if (!m.hasCanonical && kind === "website")
    push({
      area: "Search",
      severity: "warning",
      title: "No canonical URL",
      detail: "Duplicate versions of this page can compete with each other.",
      fix: "Set a canonical link to the preferred URL of the page.",
    });

  return issues.slice(0, 12);
}

function buildStrengths(m: ScanMetrics): string[] {
  const list: string[] = [];
  if (m.titleLength >= 20 && m.titleLength <= 65)
    list.push("Page title is a healthy length for search results.");
  if (m.descriptionLength >= 70 && m.descriptionLength <= 165)
    list.push("Meta description fits the snippet window.");
  if (m.headings.h1 === 1) list.push("One clear main heading sets the topic.");
  if (m.wordCount >= 600)
    list.push(`Substantial content depth (${m.wordCount} words).`);
  if (m.hasOpenGraph) list.push("Social preview tags are present.");
  if (m.hasStructuredData) list.push("Structured data markup was detected.");
  if (m.socialProfiles.length > 1)
    list.push(`Linked to ${m.socialProfiles.length} social platforms.`);
  if (m.hasViewport) list.push("Page is configured for mobile screens.");
  if (m.images >= 3) list.push("Uses imagery to break up the page.");
  if (list.length === 0)
    list.push("The page is reachable and returned readable content.");
  return list;
}

export async function runScan(inputUrl: string): Promise<ScanResult> {
  const normalised = /^https?:\/\//i.test(inputUrl)
    ? inputUrl
    : `https://${inputUrl}`;
  const doc = await firecrawlScrape(normalised);
  const meta = doc.metadata ?? {};
  const finalUrl = String(meta["sourceURL"] ?? normalised);
  const kind: ScanResult["kind"] = /linkedin\.com/i.test(finalUrl)
    ? "linkedin"
    : "website";

  const metrics = buildMetrics(doc, finalUrl);
  const scores = scoreScan(metrics, kind);
  const markdown = doc.markdown ?? "";
  const keywords = topKeywords(markdown, metrics.wordCount);
  const seed = hashString(finalUrl);

  const base = 180 + (seed % 420);
  const multiplier = Math.pow(scores.overall / 50, 2.1);
  const estimatedMonthlyViews = Math.round(base * multiplier + metrics.wordCount / 3);
  const estimatedImpressions = Math.round(
    estimatedMonthlyViews * (7 + (scores.discoverability / 100) * 9),
  );
  const profileViewPotential = Math.round(
    estimatedMonthlyViews * (1 + (100 - scores.overall) / 55),
  );

  const searchShare = 0.3 + (scores.discoverability / 100) * 0.3;
  const socialShare = 0.15 + (scores.engagement / 100) * 0.22;
  const referralShare = 0.08 + (scores.credibility / 100) * 0.12;
  const total = searchShare + socialShare + referralShare;
  const directShare = Math.max(0.08, 1 - total);
  const shares: Array<[string, number]> = [
    ["Search", searchShare],
    ["Social", socialShare],
    ["Referral", referralShare],
    ["Direct", directShare],
  ];
  const shareSum = shares.reduce((acc, [, v]) => acc + v, 0);
  const channels = shares.map(([channel, value]) => ({
    channel,
    share: value / shareSum,
    monthly: Math.round((value / shareSum) * estimatedMonthlyViews),
  }));

  let domain = finalUrl;
  try {
    domain = new URL(finalUrl).hostname.replace(/^www\./, "");
  } catch {
    /* keep raw value */
  }

  const benchmark = [
    { label: "Discoverability", you: scores.discoverability, average: 58, top: 88 },
    { label: "Content depth", you: scores.content, average: 61, top: 90 },
    { label: "Credibility", you: scores.credibility, average: 55, top: 86 },
    { label: "Engagement", you: scores.engagement, average: 52, top: 84 },
  ];

  return {
    inputUrl,
    finalUrl,
    domain,
    kind,
    scannedAt: new Date().toISOString(),
    title: String(meta["title"] ?? meta["og:title"] ?? "Untitled page"),
    description: String(meta["description"] ?? meta["og:description"] ?? ""),
    scores,
    metrics,
    keywords,
    issues: buildIssues(metrics, kind),
    strengths: buildStrengths(metrics),
    estimatedMonthlyViews,
    estimatedImpressions,
    profileViewPotential,
    channels,
    benchmark,
    excerpt: markdown.replace(/\s+/g, " ").trim().slice(0, 600),
  };
}
