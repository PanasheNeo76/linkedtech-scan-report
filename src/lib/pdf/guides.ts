export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "callout"; title: string; body: string; tone?: "info" | "warn" | "risk" | "ok" }
  | { type: "table"; head: string[]; rows: string[][]; widths?: number[] };

export type Guide = {
  id: string;
  filename: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: string[];
  summary: string;
  pages: string;
  sections: { heading: string; blocks: Block[] }[];
};

export const LINKEDIN_PLAYBOOK: Guide = {
  id: "linkedin-playbook",
  filename: "LinkedTech-LinkedIn-Profile-Playbook.pdf",
  eyebrow: "Reference Playbook",
  title: "The LinkedIn Profile Visibility Playbook",
  subtitle:
    "A complete, field-tested reference for turning a LinkedIn profile into a discoverable, credible and consistently viewed professional asset.",
  meta: [
    "Edition 4.1 - LinkedTech Research",
    "Audience: founders, consultants, job seekers, sales and recruiting teams",
    "Reading time: approximately 35 minutes",
  ],
  summary:
    "How LinkedIn search and feed distribution actually work, and the exact profile, content and network moves that increase profile views.",
  pages: "14 sections",
  sections: [
    {
      heading: "1. How LinkedIn decides who sees you",
      blocks: [
        {
          type: "p",
          text: "LinkedIn visibility is produced by three separate systems that most people treat as one. The first is profile search, an index that matches keywords in your headline, about section, job titles, skills and recommendations against what a recruiter, buyer or peer types into the search bar. The second is feed distribution, a ranking system that decides whether the content you publish is shown to your connections and, if early signals are strong, to second and third degree audiences. The third is off-platform search: your public profile is crawled by search engines, which means your name plus your specialism is a query you can win or lose in Google as well as inside LinkedIn.",
        },
        {
          type: "p",
          text: "These systems reward different behaviours. Search rewards precise, repeated vocabulary and completeness. The feed rewards dwell time, early engagement and consistency of posting. External search rewards a clear, keyword-bearing headline, a filled-out profile and inbound links from sites that already rank. A profile that is optimised for only one of the three plateaus quickly, which is why a strong writer with an empty skills section and a well-structured profile that never posts both underperform.",
        },
        {
          type: "callout",
          title: "The practical implication",
          body: "Treat your profile as a landing page, your posts as the traffic source, and your network as the distribution list. Each needs its own weekly attention, and improvements compound only when all three move together.",
          tone: "info",
        },
      ],
    },
    {
      heading: "2. The headline: your highest-leverage 220 characters",
      blocks: [
        {
          type: "p",
          text: "The headline appears in search results, in the feed next to every comment you leave, in notifications, in messaging previews and in the search engine title of your public profile. No other field is shown to more people. Default headlines generated from your current job title waste that surface because they describe an employer rather than a capability.",
        },
        {
          type: "p",
          text: "A high-performing headline contains a role term a stranger would search for, a domain or industry qualifier, a proof element and an outcome. Order matters: the first 60 characters are what survive truncation on mobile and in search engine listings.",
        },
        {
          type: "table",
          head: ["Pattern", "Example", "Why it works"],
          rows: [
            [
              "Role + domain + outcome",
              "Fractional CFO for SaaS | cash runway and board reporting",
              "Matches both a job-title search and a problem search",
            ],
            [
              "Role + proof + audience",
              "B2B SEO consultant | 40+ site audits | mid-market manufacturers",
              "Numeric proof survives skim reading and builds trust early",
            ],
            [
              "Transition framing",
              "Mechanical engineer moving into product | CAD, DFM, medical devices",
              "Keeps legacy keywords while signalling the target role",
            ],
          ],
          widths: [130, 200, 153],
        },
        {
          type: "bullets",
          items: [
            "Include the single phrase you most want to be found for, written the way other people write it, not your internal job title.",
            "Avoid unexplained internal labels, emoji walls and vague virtue words such as passionate, driven or visionary.",
            "Keep punctuation simple; vertical bars scan better than dashes in narrow mobile columns.",
            "Rewrite the headline whenever your positioning changes, then leave it alone for at least 90 days so search behaviour can settle.",
          ],
        },
      ],
    },
    {
      heading: "3. The about section: structure beats eloquence",
      blocks: [
        {
          type: "p",
          text: "Only the first two lines of the about section are visible before the reader must tap to expand, so the opening must justify the expansion. The rest of the field is one of the few places on the profile where you can place enough natural language for keyword matching without looking artificial.",
        },
        {
          type: "numbered",
          items: [
            "Open with the problem you solve, stated in the language the reader uses when they complain about it.",
            "State who you do it for, with enough specificity that the wrong reader self-selects out.",
            "Give three to five pieces of evidence: results with numbers, named categories of client, scale of systems handled, or published work.",
            "Describe your method briefly, so the reader can imagine working with you rather than simply trusting you.",
            "Close with an explicit next step: what to message you about, and what you will do in response.",
          ],
        },
        {
          type: "callout",
          title: "Keyword hygiene",
          body: "Aim for your core phrase and two close variants to appear naturally three to five times across the about section and experience entries combined. Stacking the same term ten times reads as spam to humans without measurably improving ranking.",
          tone: "warn",
        },
      ],
    },
    {
      heading: "4. Experience entries as searchable evidence",
      blocks: [
        {
          type: "p",
          text: "Experience entries are indexed individually. A role described in three bullet points of duties contributes almost nothing to search and nothing at all to credibility. Rewrite each recent role as scope, actions and outcomes, and use the job title field to carry a searchable term where your company's internal naming is obscure.",
        },
        {
          type: "bullets",
          items: [
            "Lead with scope: team size, budget, market, product surface, or number of accounts.",
            "Quantify at least one outcome per role, even if the number is approximate and labelled as such.",
            "Add media: a case study PDF, a published article, a product screenshot, a conference recording.",
            "Name the tools and standards you actually used; these are frequent filter terms in recruiter search.",
            "Keep older roles short. Depth on the last three positions, one line each before that.",
          ],
        },
      ],
    },
    {
      heading: "5. Skills, endorsements and recommendations",
      blocks: [
        {
          type: "p",
          text: "Skills are a structured field, which makes them unusually powerful compared with free text. The top three pinned skills are shown prominently and carry the most weight in matching, so they should mirror your headline rather than reflect the full range of things you can do.",
        },
        {
          type: "table",
          head: ["Asset", "Target", "Maintenance"],
          rows: [
            ["Pinned skills", "3 that match your core positioning", "Review each quarter"],
            ["Total skills", "20-30, all genuinely defensible", "Prune yearly"],
            ["Endorsements", "10+ on each pinned skill", "Request after delivered work"],
            ["Recommendations", "2 per significant role", "Ask within two weeks of a win"],
          ],
          widths: [150, 180, 153],
        },
        {
          type: "p",
          text: "Recommendations carry keywords written by someone else, which is credibility a self-written profile cannot manufacture. When requesting one, offer the specifics: remind the writer of the project, the outcome and the phrase you would like them to use. Most people want to help and are simply short of time and detail.",
        },
      ],
    },
    {
      heading: "6. The visual layer: photo, banner and featured section",
      blocks: [
        {
          type: "bullets",
          items: [
            "Profile photo: face occupying roughly 60 percent of the frame, even lighting, plain background, current appearance, neutral to warm expression.",
            "Banner: 1584 x 396 pixels, carrying one clear statement of value or proof rather than decorative scenery.",
            "Featured section: three to five items maximum, ordered so the strongest proof is first, refreshed each quarter.",
            "Custom profile URL: claim a clean vanity URL; it is the anchor you will reuse in email signatures, decks and site footers.",
          ],
        },
      ],
    },
    {
      heading: "7. Publishing cadence that the feed rewards",
      blocks: [
        {
          type: "p",
          text: "Feed distribution is decided in the first 60 to 90 minutes after publication, based on how long people stay on the post and whether they respond in ways that require effort. Comments and saves are stronger signals than reactions; a post that earns several substantive replies from relevant people outperforms one with many passive likes.",
        },
        {
          type: "table",
          head: ["Format", "Best used for", "Practical guidance"],
          rows: [
            ["Text post", "Opinions, lessons, short stories", "150-350 words, one idea, line breaks every 1-2 sentences"],
            ["Document carousel", "Frameworks, checklists, teardowns", "8-12 pages, one point per page, readable at thumbnail size"],
            ["Single image", "Proof, behind-the-scenes, results", "Original imagery beats stock every time"],
            ["Native video", "Demonstrations, explanations", "Under 90 seconds, captions burned in"],
            ["Poll", "Audience research, re-activation", "Sparingly, and always follow up with the findings"],
          ],
          widths: [110, 150, 223],
        },
        {
          type: "numbered",
          items: [
            "Publish two to three times per week at a time when your audience is actually online, then hold that pattern for at least eight weeks.",
            "Spend twenty minutes commenting thoughtfully on other people's posts before and after you publish.",
            "Answer every comment on your own post within the first two hours.",
            "Avoid editing a post in the first hour; reserve link-sharing for the comments where it does not compete with the post itself.",
            "Repurpose anything that performed well after ninety days, rewritten rather than reposted.",
          ],
        },
      ],
    },
    {
      heading: "8. Network growth without spam",
      blocks: [
        {
          type: "p",
          text: "Your posts reach your network first, so the composition of that network sets the ceiling on distribution. A thousand relevant connections outperform ten thousand random ones, because relevance drives the early engagement that unlocks wider reach.",
        },
        {
          type: "bullets",
          items: [
            "Send a small number of personalised invitations each week to people in your actual field.",
            "Follow rather than connect when you only want the content, keeping your network signal clean.",
            "Accept invitations selectively; an audience diluted by unrelated accounts weakens early engagement.",
            "Re-engage dormant contacts with a specific, useful message rather than a generic catch-up.",
          ],
        },
      ],
    },
    {
      heading: "9. Making your profile rank in external search",
      blocks: [
        {
          type: "p",
          text: "Public LinkedIn profiles rank well in search engines because the domain is authoritative and the pages are structurally clean. You can influence that ranking in three ways: making the profile public, giving it a keyword-bearing headline, and linking to it from other pages that already have authority.",
        },
        {
          type: "bullets",
          items: [
            "Set public profile visibility to on, including the about, experience and skills sections.",
            "Link to your profile from your website footer, your author bio, your email signature and any published articles.",
            "Use consistent name spelling everywhere; identity fragmentation is the most common ranking problem for individuals.",
            "Add Person structured data on your own site that references the LinkedIn URL as a same-as identity link.",
          ],
        },
      ],
    },
    {
      heading: "10. Measurement: the five numbers that matter",
      blocks: [
        {
          type: "table",
          head: ["Metric", "Where", "What it tells you"],
          rows: [
            ["Profile views (28 day)", "Profile dashboard", "Whether distribution is reaching new people"],
            ["Search appearances", "Profile dashboard", "Whether your keywords match real queries"],
            ["Post impressions", "Per-post analytics", "Feed distribution health"],
            ["Engagement rate", "Per-post analytics", "Content quality relative to audience size"],
            ["Inbound conversations", "Your inbox", "The only metric tied to outcomes"],
          ],
          widths: [140, 120, 223],
        },
        {
          type: "callout",
          title: "Review rhythm",
          body: "Check post analytics weekly, profile analytics monthly, and positioning quarterly. Changing your positioning more often than quarterly makes it impossible to tell what worked.",
          tone: "ok",
        },
      ],
    },
    {
      heading: "11. A 30 day implementation schedule",
      blocks: [
        {
          type: "table",
          head: ["Week", "Focus", "Deliverables"],
          rows: [
            ["1", "Foundation", "Headline, about, photo, banner, custom URL, public visibility"],
            ["2", "Evidence", "Rewrite last three roles, pin three skills, request two recommendations"],
            ["3", "Distribution", "Publish three posts, comment daily, send 20 personalised invitations"],
            ["4", "Reinforcement", "Add featured items, cross-link from your site, record baseline metrics"],
          ],
          widths: [50, 110, 323],
        },
      ],
    },
    {
      heading: "12. Common failure patterns",
      blocks: [
        {
          type: "bullets",
          items: [
            "Rewriting the profile monthly, which prevents any measurement of effect.",
            "Optimising the profile while publishing nothing, leaving no traffic source.",
            "Publishing constantly with a profile that does not convert the visit.",
            "Chasing reach with engagement-bait, which grows the wrong audience and weakens future distribution.",
            "Automating connection requests and comments, which damages credibility faster than it builds reach.",
            "Treating the headline as a job title instead of a search term.",
          ],
        },
      ],
    },
    {
      heading: "13. Sector-specific adjustments",
      blocks: [
        {
          type: "table",
          head: ["Audience", "Priority", "Notes"],
          rows: [
            ["Job seekers", "Search matching", "Mirror target job descriptions; recruiters filter on titles and skills"],
            ["Consultants", "Proof and method", "Featured case studies and outcome numbers do the selling"],
            ["Founders", "Narrative", "Company story plus personal credibility; expect profile visits after every post"],
            ["Sales teams", "Consistency", "Standardise headlines and banners across the team, vary the content"],
            ["Academics", "Publication trail", "Link papers and talks; the featured section acts as a portfolio"],
          ],
          widths: [95, 115, 273],
        },
      ],
    },
    {
      heading: "14. Quick reference checklist",
      blocks: [
        {
          type: "numbered",
          items: [
            "Headline carries a real search term in the first 60 characters.",
            "About section opens with a problem and closes with a next step.",
            "Last three roles rewritten as scope, action and outcome.",
            "Three pinned skills match the headline, each with ten or more endorsements.",
            "Two recommendations per significant role.",
            "Professional photo and a banner that states value.",
            "Three to five featured items, strongest first.",
            "Public profile visibility enabled and custom URL claimed.",
            "Posting two to three times weekly on a fixed rhythm.",
            "Profile linked from your website, signature and published work.",
            "Baseline metrics recorded and reviewed monthly.",
          ],
        },
      ],
    },
  ],
};

export const SEO_PLAYBOOK: Guide = {
  id: "seo-playbook",
  filename: "LinkedTech-Website-Visibility-Playbook.pdf",
  eyebrow: "Reference Playbook",
  title: "The Website Visibility & Search Playbook",
  subtitle:
    "A structured reference covering technical foundations, on-page craft, content architecture, authority building and measurement for sites that need to be found.",
  meta: [
    "Edition 4.1 - LinkedTech Research",
    "Audience: site owners, marketers, agencies and technical teams",
    "Reading time: approximately 40 minutes",
  ],
  summary:
    "The full technical and editorial reference behind every website recommendation LinkedTech makes, from crawling to conversion.",
  pages: "15 sections",
  sections: [
    {
      heading: "1. What visibility actually consists of",
      blocks: [
        {
          type: "p",
          text: "Search visibility is the product of four sequential conditions. A page must be reachable by a crawler, indexable once reached, relevant to a query once indexed, and more trustworthy than the alternatives once relevance is established. Failure at any earlier stage makes work at the later stages worthless, which is why audits should always be read in that order rather than starting with keywords.",
        },
        {
          type: "table",
          head: ["Stage", "Question", "Typical blocker"],
          rows: [
            ["Crawl", "Can a bot reach the page?", "Robots rules, broken internal linking, client-only rendering"],
            ["Index", "Is the page eligible to appear?", "Noindex tags, canonical conflicts, duplicate templates"],
            ["Relevance", "Does it match the query?", "Missing title and heading signals, thin or generic copy"],
            ["Trust", "Why this page over another?", "No citations, no author identity, no external references"],
          ],
          widths: [70, 140, 273],
        },
      ],
    },
    {
      heading: "2. Technical foundations",
      blocks: [
        {
          type: "bullets",
          items: [
            "Serve one canonical version of every URL: single protocol, single host, consistent trailing slash treatment.",
            "Return correct status codes. Soft 404s and 200-status error pages confuse indexing more than honest 404s.",
            "Maintain an accurate XML sitemap containing only canonical, indexable URLs, and reference it from robots.txt.",
            "Ensure primary content is present in the server-rendered HTML rather than assembled only after JavaScript execution.",
            "Keep redirect chains to a single hop and avoid redirecting into pages that themselves redirect.",
            "Use HTTPS everywhere, with no mixed-content requests on any template.",
          ],
        },
        {
          type: "callout",
          title: "Diagnostic order",
          body: "When traffic drops, check indexing coverage before content quality. Most sudden losses are technical: an accidental noindex, a canonical pointing at the wrong template, or a blocked directory.",
          tone: "risk",
        },
      ],
    },
    {
      heading: "3. Performance and page experience",
      blocks: [
        {
          type: "p",
          text: "Speed rarely creates rankings on its own, but it reliably destroys conversion and amplifies every other weakness. Optimise for the experience of a mid-range mobile device on an ordinary connection, not for a desktop on office fibre.",
        },
        {
          type: "table",
          head: ["Signal", "Target", "Most common cause of failure"],
          rows: [
            ["Largest contentful paint", "Under 2.5s", "Unoptimised hero image, blocking fonts"],
            ["Interaction responsiveness", "Under 200ms", "Heavy third-party scripts and tag managers"],
            ["Layout stability", "Under 0.1 shift", "Images without dimensions, late-loading banners"],
            ["Total page weight", "Under 1.5MB", "Uncompressed imagery, unused component libraries"],
          ],
          widths: [140, 90, 253],
        },
        {
          type: "bullets",
          items: [
            "Serve modern image formats at the size actually displayed, with width and height attributes always set.",
            "Lazy-load below-the-fold media only; never lazy-load the main hero image.",
            "Audit third-party scripts quarterly and remove anything without a named owner.",
            "Preload the primary font and use a fallback that matches its metrics closely.",
          ],
        },
      ],
    },
    {
      heading: "4. On-page craft",
      blocks: [
        {
          type: "table",
          head: ["Element", "Specification", "Purpose"],
          rows: [
            ["Title", "50-60 characters, primary phrase first", "Ranking signal and click decision"],
            ["Meta description", "140-160 characters, benefit plus action", "Click-through rate, not ranking"],
            ["H1", "Exactly one, matching page intent", "Topic confirmation"],
            ["H2/H3", "Logical outline, keyword variants", "Scannability and passage matching"],
            ["Image alt text", "Descriptive, specific, no stuffing", "Accessibility and image search"],
            ["Internal links", "3-5 per page, descriptive anchors", "Crawl paths and authority flow"],
          ],
          widths: [100, 190, 193],
        },
        {
          type: "p",
          text: "Write for the query behind the query. A visitor searching a product category rarely wants a definition; they want comparison, price framing and reassurance. Matching intent is more valuable than matching phrasing, and it is what separates pages that rank briefly from pages that hold position.",
        },
      ],
    },
    {
      heading: "5. Keyword and intent research",
      blocks: [
        {
          type: "numbered",
          items: [
            "List the problems your audience describes in their own words, gathered from sales calls, support tickets and community threads.",
            "Expand each problem into the queries it produces, separating informational, comparison and transactional intent.",
            "Group queries into topics where one page could satisfy all of them; resist building one page per phrase.",
            "Check what currently ranks for each group and identify the format the results share.",
            "Score each topic by business value, achievable difficulty and existing internal coverage.",
            "Assign one primary page per topic and record it, so future content strengthens rather than competes.",
          ],
        },
        {
          type: "callout",
          title: "Cannibalisation",
          body: "Two pages targeting the same intent split signals and usually both underperform. When you find a pair, choose a winner, merge the useful content, and redirect the loser.",
          tone: "warn",
        },
      ],
    },
    {
      heading: "6. Content architecture",
      blocks: [
        {
          type: "p",
          text: "Sites that rank consistently look like organised libraries rather than collections of posts. A hub page covers a topic broadly and links to supporting pages that each answer one question in depth; those pages link back and sideways. The structure makes the topic legible to crawlers and navigable for humans.",
        },
        {
          type: "bullets",
          items: [
            "Keep important pages within three clicks of the homepage.",
            "Give every hub a clear URL pattern and keep it stable over time.",
            "Prune or consolidate pages that have had no impressions for twelve months.",
            "Update evergreen pages on a schedule rather than publishing new near-duplicates.",
            "Use breadcrumbs so both users and crawlers can see hierarchy.",
          ],
        },
      ],
    },
    {
      heading: "7. Structured data",
      blocks: [
        {
          type: "table",
          head: ["Type", "Use on", "Benefit"],
          rows: [
            ["Organization", "Homepage", "Entity recognition, knowledge panel eligibility"],
            ["Person", "Bio and author pages", "Identity linking to social profiles"],
            ["Article", "Editorial content", "Publication dates and author attribution"],
            ["Product", "Commerce pages", "Price, availability and review display"],
            ["FAQPage", "Support content", "Expanded result real estate where eligible"],
            ["BreadcrumbList", "All templates", "Cleaner result paths"],
          ],
          widths: [100, 130, 253],
        },
        {
          type: "p",
          text: "Markup must describe content that is genuinely visible on the page. Mismatched or inflated markup risks manual action and never produces durable gains.",
        },
      ],
    },
    {
      heading: "8. Social and link previews",
      blocks: [
        {
          type: "bullets",
          items: [
            "Set social preview title, description and a 1200 x 630 image on every shareable template.",
            "Add an X card of type summary_large_image referencing the same asset.",
            "Use absolute image URLs; relative paths break in most preview crawlers.",
            "Test each template with the platforms' own preview debuggers after deployment.",
            "Generate preview images programmatically for content-heavy sites so no page ships without one.",
          ],
        },
      ],
    },
    {
      heading: "9. Authority and external signals",
      blocks: [
        {
          type: "p",
          text: "Authority is earned by being cited, and citations follow from being useful, original or newsworthy. Sustainable tactics all involve producing something worth referencing: original data, a genuinely better explanation, a free tool, or expert commentary that journalists and peers can quote.",
        },
        {
          type: "table",
          head: ["Tactic", "Effort", "Durability"],
          rows: [
            ["Original research or survey data", "High", "Very high; cited for years"],
            ["Free tools and calculators", "High", "High; accumulates links passively"],
            ["Expert commentary and interviews", "Medium", "Medium; depends on publication"],
            ["Partner and customer case studies", "Medium", "Medium; strong conversion value"],
            ["Directory and profile listings", "Low", "Low; useful for consistency, not ranking"],
            ["Paid link schemes", "Low", "Negative; risk of penalty"],
          ],
          widths: [170, 70, 243],
        },
      ],
    },
    {
      heading: "10. Local and entity visibility",
      blocks: [
        {
          type: "bullets",
          items: [
            "Keep name, address and phone identical across your site, business profile and major directories.",
            "Maintain the business profile actively: hours, categories, photos and responses to reviews.",
            "Build one substantive page per genuine location or service area, never templated duplicates.",
            "Encourage reviews continuously rather than in bursts, and answer every one.",
          ],
        },
      ],
    },
    {
      heading: "11. Measurement framework",
      blocks: [
        {
          type: "table",
          head: ["Layer", "Metrics", "Cadence"],
          rows: [
            ["Health", "Indexed pages, crawl errors, status codes", "Weekly"],
            ["Demand", "Impressions, average position, query count", "Weekly"],
            ["Engagement", "Click-through rate, scroll depth, time on page", "Monthly"],
            ["Outcome", "Enquiries, signups, revenue per landing page", "Monthly"],
            ["Position", "Share of voice against named competitors", "Quarterly"],
          ],
          widths: [90, 200, 193],
        },
        {
          type: "callout",
          title: "Attribution honesty",
          body: "Search results vary by person, device and place. Track impressions and clicks from your own search console data rather than manual position checks, and always compare like periods year over year to avoid seasonal illusions.",
          tone: "info",
        },
      ],
    },
    {
      heading: "12. A 90 day programme",
      blocks: [
        {
          type: "table",
          head: ["Phase", "Days", "Work"],
          rows: [
            ["Stabilise", "1-30", "Fix crawl and index blockers, correct titles and descriptions, repair broken links"],
            ["Strengthen", "31-60", "Rebuild the three highest-value pages, add structured data and internal links"],
            ["Expand", "61-90", "Publish hub and supporting content, pursue two authority assets, report on baseline shift"],
          ],
          widths: [80, 60, 343],
        },
      ],
    },
    {
      heading: "13. Recurring maintenance",
      blocks: [
        {
          type: "bullets",
          items: [
            "Weekly: indexing coverage, new errors, top movers in queries.",
            "Monthly: content refresh on two evergreen pages, internal link additions, performance spot check.",
            "Quarterly: full technical crawl, cannibalisation review, competitor comparison, structured data validation.",
            "Annually: information architecture review, pruning of dead pages, redirect map audit.",
          ],
        },
      ],
    },
    {
      heading: "14. Risks and anti-patterns",
      blocks: [
        {
          type: "bullets",
          items: [
            "Mass-generated pages with no unique value, which dilute site quality signals.",
            "Keyword stuffing in titles and alt text, which suppresses click-through rate.",
            "Hiding content behind interactions that crawlers cannot trigger.",
            "Migrating a site without a tested redirect map.",
            "Blocking CSS or JavaScript that is required to render the page.",
            "Chasing rankings for phrases with no commercial relevance.",
          ],
        },
      ],
    },
    {
      heading: "15. Glossary",
      blocks: [
        {
          type: "table",
          head: ["Term", "Meaning"],
          rows: [
            ["Canonical URL", "The preferred address for a page when several versions exist"],
            ["Crawl budget", "The practical limit on how much of a site a bot fetches in a period"],
            ["Impression", "One appearance of your page in a result set"],
            ["Intent", "The underlying goal behind a search query"],
            ["Passage matching", "Ranking part of a page for a query it answers directly"],
            ["Share of voice", "Your visibility as a proportion of a competitive set"],
            ["Structured data", "Machine-readable markup describing page content"],
            ["Topical authority", "Accumulated evidence that a site covers a subject thoroughly"],
          ],
          widths: [140, 343],
        },
      ],
    },
  ],
};

export const GUIDES: Guide[] = [LINKEDIN_PLAYBOOK, SEO_PLAYBOOK];
