export type Severity = "critical" | "warning" | "good";

export type Issue = {
  area: string;
  severity: Severity;
  title: string;
  detail: string;
  fix: string;
};

export type ScoreSet = {
  overall: number;
  discoverability: number;
  content: number;
  credibility: number;
  engagement: number;
};

export type ChannelViews = {
  channel: string;
  monthly: number;
  share: number;
};

export type KeywordRow = {
  term: string;
  count: number;
  density: number;
};

export type ScanMetrics = {
  wordCount: number;
  headings: { h1: number; h2: number; h3: number };
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesMissingAlt: number;
  titleLength: number;
  descriptionLength: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  hasCanonical: boolean;
  hasStructuredData: boolean;
  hasViewport: boolean;
  avgSentenceWords: number;
  socialProfiles: string[];
  loadStatus: number;
};

export type ScanResult = {
  inputUrl: string;
  finalUrl: string;
  domain: string;
  kind: "linkedin" | "website";
  scannedAt: string;
  title: string;
  description: string;
  scores: ScoreSet;
  metrics: ScanMetrics;
  keywords: KeywordRow[];
  issues: Issue[];
  strengths: string[];
  estimatedMonthlyViews: number;
  estimatedImpressions: number;
  profileViewPotential: number;
  channels: ChannelViews[];
  benchmark: { label: string; you: number; average: number; top: number }[];
  excerpt: string;
};

export const SCORE_LABELS: Record<keyof ScoreSet, string> = {
  overall: "Overall visibility",
  discoverability: "Discoverability",
  content: "Content depth",
  credibility: "Credibility signals",
  engagement: "Engagement potential",
};

export function grade(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Average";
  if (score >= 40) return "Needs work";
  return "At risk";
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
