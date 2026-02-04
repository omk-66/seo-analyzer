import { z } from "zod";

/* ---------- Shared / Atomic Schemas ---------- */

const PriorityEnum = z.enum(["low", "medium", "high"]);
const SiteTypeEnum = z.enum(["business", "blog", "ecommerce", "portfolio", "other"]);

const KeywordPlacement = z.array(z.string());

/* ---------- Critical Issues ---------- */

const CriticalIssueSchema = z.object({
    category: z.string(),
    issue: z.string(),
    impact: z.string(),
    evidence: z.string(),
    recommendation: z.string(),
    priority: PriorityEnum,
});

/* ---------- Strengths ---------- */

const StrengthSchema = z.object({
    area: z.string(),
    description: z.string(),
});

/* ---------- Quick Wins ---------- */

const QuickWinSchema = z.object({
    improvement: z.string(),
    impact: z.string(),
    effort: z.enum(["low", "medium", "high"]),
});

/* ---------- Detailed Recommendations ---------- */

const TitleRecommendationSchema = z.object({
    current: z.string(),
    suggested: z.string(),
    reason: z.string(),
});

const MetaDescriptionSchema = z.object({
    current: z.string(),
    suggested: z.string(),
    reason: z.string(),
});

const HeadingsSchema = z.object({
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
});

const ContentSchema = z.object({
    wordCount: z.string(),
    keywordUsage: z.string(),
    readability: z.string(),
    LSIKeywords: z.array(z.string()),
    contentGaps: z.array(z.string()),
    contentStructure: z.string(),
});

const PrimaryKeywordSchema = z.object({
    keyword: z.string(),
    count: z.number().nonnegative(),
    density: z.string(),
    placement: KeywordPlacement,
});

const SecondaryKeywordSchema = z.object({
    keyword: z.string(),
    count: z.number().nonnegative(),
    density: z.string(),
});

const LongTailKeywordSchema = z.object({
    keyword: z.string(),
    count: z.number().nonnegative(),
});

const KeywordsSchema = z.object({
    primaryKeywords: z.array(PrimaryKeywordSchema),
    secondaryKeywords: z.array(SecondaryKeywordSchema),
    longTailKeywords: z.array(LongTailKeywordSchema),
    missingKeywords: z.array(z.string()),
    keywordStuffing: z.boolean(),
});

const InternalLinkSchema = z.object({
    url: z.string(),
    anchor: z.string(),
    isContextual: z.boolean(),
});

const ExternalLinkSchema = z.object({
    url: z.string(),
    anchor: z.string(),
    isNofollow: z.boolean(),
});

const LinksSchema = z.object({
    internalLinks: z.array(InternalLinkSchema),
    externalLinks: z.array(ExternalLinkSchema),
    brokenLinks: z.array(z.string()),
    orphanedPages: z.array(z.string()),
    linkEquity: z.string(),
});

const TechnicalRecommendationsSchema = z.object({
    imageOptimization: z.string(),
    internalLinking: z.string(),
    urlStructure: z.string(),
    structuredData: z.string(),
    metaTags: z.string(),
});

const DetailedRecommendationsSchema = z.object({
    title: TitleRecommendationSchema,
    metaDescription: MetaDescriptionSchema,
    headings: HeadingsSchema,
    content: ContentSchema,
    keywords: KeywordsSchema,
    links: LinksSchema,
    technical: TechnicalRecommendationsSchema,
});

/* ---------- SEO Metrics ---------- */

const CoreWebVitalsSchema = z.object({
    lcp: z.number(),
    inp: z.number(),
    cls: z.number(),
    fcp: z.number(),
    ttfb: z.number(),
});

const PageSpeedSchema = z.object({
    desktop: z.number(),
    mobile: z.number(),
    firstContentfulPaint: z.number(),
    largestContentfulPaint: z.number(),
    timeToInteractive: z.number(),
    speedIndex: z.number(),
    totalBlockingTime: z.number(),
});

const TopKeywordSchema = z.object({
    keyword: z.string(),
    position: z.number(),
    volume: z.number(),
    difficulty: z.number(),
});

const AdditionalMetricsSchema = z.object({
    domainAuthority: z.number(),
    pageAuthority: z.number(),
    backlinksCount: z.number(),
    referringDomains: z.number(),
    organicKeywords: z.number(),
    organicTraffic: z.number(),
    bounceRate: z.number(),
    dwellTime: z.number(),
    conversionRate: z.number(),
});

const SeoMetricsSchema = z.object({
    technicalScore: z.number(),
    contentScore: z.number(),
    performanceScore: z.number(),
    accessibilityScore: z.number(),
    securityScore: z.number(),
    mobileSpeedScore: z.number(),
    readabilityScore: z.number(),
    wordCount: z.number(),
    contentDepthScore: z.number(),
    keywordScore: z.number(),
    structuredDataScore: z.number(),
    internalLinkingScore: z.number(),
    externalLinkingScore: z.number(),
    userExperienceScore: z.number(),
    socialSharingScore: z.number(),

    coreWebVitals: CoreWebVitalsSchema,
    pageSpeed: PageSpeedSchema,

    sslStatus: z.string(),
    mobileFriendliness: z.boolean(),
    contentFreshness: z.string(),

    topKeywords: z.array(TopKeywordSchema),
    schemaTypes: z.array(z.string()),

    additionalMetrics: AdditionalMetricsSchema,
});

/* ---------- Root Schema ---------- */

export const SeoAuditResponseSchema = z.object({
    overallScore: z.number().min(0).max(100),
    siteType: SiteTypeEnum,
    url: z.string(),

    criticalIssues: z.array(CriticalIssueSchema),
    strengths: z.array(StrengthSchema),
    quickWins: z.array(QuickWinSchema),

    detailedRecommendations: DetailedRecommendationsSchema,

    seoMetrics: SeoMetricsSchema,

    nextSteps: z.array(z.string()),
});

/* ---------- Inferred Type ---------- */

export type SeoAuditResponse = z.infer<typeof SeoAuditResponseSchema>;
