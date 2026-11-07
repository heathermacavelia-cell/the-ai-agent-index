/**
 * The person behind the index (Heather 2026-11-07: "It should be my name and image
 * and link to my linkedin profile"). One place, so every byline, the About page and
 * the structured data name the same real person. Google's helpful-content guidance
 * (updated 2026-10-01) treats a real, verifiable creator as a trust signal and a
 * made-up one as a low-quality signal; this is the real one.
 *
 * IMAGE: set EDITOR.image to the photo's public path once the file is in
 * public/team/. Until then it is null and nothing renders or claims a photo.
 */
export const EDITOR = {
  name: 'Heather MacAvelia',
  jobTitle: 'Founder and editor, The AI Agent Index',
  aboutPath: '/about#heather',
  linkedin: 'https://www.linkedin.com/in/heather-macavelia-6401251b/',
  image: '/team/heather-macavelia.jpg' as string | null,
}

const SITE = 'https://theaiagentindex.com'

/** schema.org Person for author fields. */
export const EDITOR_PERSON = {
  '@type': 'Person',
  name: EDITOR.name,
  url: SITE + EDITOR.aboutPath,
  jobTitle: EDITOR.jobTitle,
  sameAs: [EDITOR.linkedin],
  worksFor: { '@type': 'Organization', name: 'The AI Agent Index', url: SITE },
  ...(EDITOR.image ? { image: SITE + EDITOR.image } : {}),
}
