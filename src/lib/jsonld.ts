// ═══════════════════════════════════════════════════════════════
// JSON-LD Structured Data helpers
// Each function returns a plain object suitable for injection via
// <script type="application/ld+json" dangerouslySetInnerHTML={...} />
// ═══════════════════════════════════════════════════════════════

/**
 * SITE_URL — canonical base URL of the site.
 * Falls back to production URL when the env var is not set.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://image.toolconv.com';

const SITE_NAME = 'ImageTools';
const TAGLINE =
  'Free online image tools — 100% browser-side, zero upload, no signup.';
const FAVICON_URL = `${SITE_URL}/favicon.ico`;

// ───────────────────────────────────────────────────────────────
// 1. Organization
// ───────────────────────────────────────────────────────────────

/**
 * generateOrganizationSchema — Organization schema for the whole site.
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: TAGLINE,
    sameAs: [] as string[],
    logo: FAVICON_URL,
  };
}

// ───────────────────────────────────────────────────────────────
// 2. WebSite
// ───────────────────────────────────────────────────────────────

/**
 * generateWebSiteSchema — WebSite schema for search engines.
 * Includes a potential SearchAction that targets the site's search endpoint.
 */
export function generateWebSiteSchema(
  locale: string = 'en',
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: TAGLINE,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 3. WebApplication (for general tool pages)
// ───────────────────────────────────────────────────────────────

/**
 * generateWebApplicationSchema — WebApplication schema for tool pages.
 *
 * @param name        — Tool display name
 * @param description — Tool description
 * @param url         — Canonical URL of the tool page
 * @param category    — Application category (default: "MultimediaApplication")
 */
export function generateWebApplicationSchema(
  name: string,
  description: string,
  url: string,
  category: string = 'MultimediaApplication',
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements:
      'Requires JavaScript. Works in all modern browsers (Chrome, Firefox, Safari, Edge).',
  };
}

// ───────────────────────────────────────────────────────────────
// 4. FAQPage
// ───────────────────────────────────────────────────────────────

/**
 * generateFAQSchema — FAQPage schema for FAQ sections.
 *
 * @param faqs — Array of { question, answer } objects
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ───────────────────────────────────────────────────────────────
// 5. BreadcrumbList
// ───────────────────────────────────────────────────────────────

/**
 * generateBreadcrumbSchema — BreadcrumbList schema for navigation.
 *
 * @param items — Array of { name, url } representing breadcrumb trail
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ───────────────────────────────────────────────────────────────
// 6. HowTo (for tool guide / tutorial pages)
// ───────────────────────────────────────────────────────────────

/**
 * generateHowToSchema — HowTo schema for step-by-step guides.
 *
 * @param name  — Title of the HowTo / guide
 * @param steps — Ordered list of step descriptions
 */
export function generateHowToSchema(
  name: string,
  steps: string[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text,
    })),
  };
}

// ───────────────────────────────────────────────────────────────
// 7. SoftwareApplication (for converter / utility pages)
// ───────────────────────────────────────────────────────────────

/**
 * generateSoftwareApplicationSchema — SoftwareApplication schema
 * for converter and utility pages.
 *
 * @param name        — Application name
 * @param description — Application description
 * @param url         — Canonical URL
 * @param locale      — Language / locale code (default "en")
 */
export function generateSoftwareApplicationSchema(
  name: string,
  description: string,
  url: string,
  locale: string = 'en',
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    inLanguage: locale,
  };
}

// ───────────────────────────────────────────────────────────────
// 8. ImageObject (for image-heavy / gallery pages)
// ───────────────────────────────────────────────────────────────

/**
 * generateImageSchema — ImageObject schema for images displayed
 * on image-heavy pages (e.g. galleries, before/after comparisons).
 *
 * @param url     — Absolute URL of the image
 * @param caption — Caption or description
 * @param width   — Image width in pixels
 * @param height  — Image height in pixels
 */
export function generateImageSchema(
  url: string,
  caption: string,
  width: number,
  height: number,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    caption,
    width,
    height,
  };
}
