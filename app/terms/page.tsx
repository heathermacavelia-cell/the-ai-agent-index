import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for The AI Agent Index: listing tiers, what each one promises, refunds, and our editorial independence.',
}

const sectionH2 = {
  fontWeight: 700,
  fontSize: '1.125rem',
  color: '#111827',
  marginBottom: '0.75rem',
}

const para = { marginTop: '0.75rem' }

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6B7280', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#D1D5DB' }}>/</span>
        <span style={{ color: '#111827' }}>Terms of Service</span>
      </nav>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
        Terms of Service
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '3rem' }}>
        Last updated: August 31, 2026
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#374151', fontSize: '0.9375rem', lineHeight: 1.8 }}>

        <section>
          <h2 style={sectionH2}>Who we are</h2>
          <p>The AI Agent Index (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an independent directory of AI agents for business automation, operated at theaiagentindex.com from Ontario, Canada. These terms cover using the site and buying any of our listing or placement products.</p>
          <p style={para}>By submitting a listing or buying a paid product, you agree to these terms. If you are doing so for a company, you confirm you are authorised to act for it.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Listings are editorial, not advertising</h2>
          <p>Every listing on this site is researched and written by our editorial team. When you submit a product, what you tell us guides that research. It is not published as you wrote it, and we may reach different conclusions from the ones you would prefer.</p>
          <p style={para}>We decide what appears on this site. We may decline any submission, and we may edit, correct, update or remove any listing at any time. Buying a paid product does not create a right to be listed, to be listed in a particular way, or to approve what we write.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Editorial independence</h2>
          <p>Payment never affects a rating, a ranking, a score, or where a product appears in search results, category pages or comparisons. This is not a courtesy and it is not negotiable.</p>
          <p style={para}>Paid products buy speed, editorial attention, ongoing maintenance and clearly labelled advertising placement. Nothing else.</p>
          <p style={para}>Our audited badge means a listing has passed a full editorial audit, and it displays the date of that audit. It does not mean anyone paid. A free listing we audit later carries the same badge on the same terms.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Listing tiers and what each one promises</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '1rem', borderLeft: '3px solid #E5E7EB', marginTop: '0.75rem' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Self-managed (free)</p>
              <p>We carry out a lighter check of the basics and your listing states that this is what happened. <strong>We do not promise any timeline for free listings.</strong> We work through them as capacity allows, and we may never get to a particular submission. If that matters to you, choose a paid tier.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Editorial Review (39 USD, one-time)</p>
              <p>A full editorial audit checked against your live public sources, published within <strong>3 business days</strong>. Includes the structured data fields our machine-readable surfaces publish, an audited badge with its date, a newsletter mention, homepage rotation and an editorially approved marketing hook.</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>Editorial Managed (99 USD per month)</p>
              <p>Everything in Editorial Review, published within <strong>1 business day</strong>, and re-audited every 30 days for as long as the subscription is active.</p>
            </div>
          </div>

          <p style={para}>Business days are Monday to Friday excluding Ontario statutory holidays. The clock starts when we have both your completed submission and cleared payment, whichever comes later.</p>
          <p style={para}>If we miss a stated timeline, tell us and we will refund the payment for that listing in full. That is the remedy for a missed timeline.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Payment and refunds</h2>
          <p>Payment is taken up front, in US dollars, through Stripe. We do not see or store your card details.</p>
          <p style={para}><strong>If your product does not qualify for the index, you get a full refund automatically.</strong> You do not have to ask. <strong>Once your listing is published, the payment is final</strong> and no refund is available, because the work has been done.</p>
          <p style={para}>Editorial Managed can be cancelled at any time. Cancellation takes effect at the end of the current billing month, and part-months are not refunded. If we remove or deactivate a managed listing for any reason other than your breach of these terms, we refund the unused part of that month.</p>
          <p style={para}>Prices may change. A change never affects an existing subscription until we have told you by email in advance.</p>
          <p style={para}>Prices are exclusive of any sales tax, VAT or GST that may apply. Where we are required to collect such tax, it is shown at checkout.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Advertising placements</h2>
          <p>Premium Featured listings, comparison placements, category sponsorships and listing banners are advertising products. They are labelled on the page so a first-time reader can tell that placement was paid for.</p>
          <p style={para}>Every paid placement includes ongoing accuracy maintenance for the listing it promotes, because an out-of-date listing in a promoted position serves nobody.</p>
          <p style={para}>Where a vendor contributes to how their own side of a comparison is written, the page says so, and the other product&apos;s section remains our independent assessment. Any claim a vendor supplies is verified like every other claim on this site before it is published.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Information you give us</h2>
          <p>You confirm that information you submit is accurate to the best of your knowledge, that you have the right to give it to us, and that any logo or asset you supply may be displayed on this site for the purpose of your listing.</p>
          <p style={para}>Do not submit confidential information. Anything you send us for a listing may be published or used in our research.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Accuracy, and its limits</h2>
          <p>We check listings against live public sources and we correct what we find. We do not guarantee that every listing is complete, current or free of error. Products change, vendors change their pricing, and a listing is accurate as at the date shown on it and no later.</p>
          <p style={para}>Nothing on this site is a recommendation, an endorsement, or advice about what you should buy. Do your own evaluation before making a purchasing decision.</p>
          <p style={para}>If you find something wrong on any listing, tell us at hello@theaiagentindex.com and we will check it. That applies to your own listing and to anyone else&apos;s.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Removing a listing</h2>
          <p>We may remove or deactivate any listing, including a paid one, if the product is discontinued, the information cannot be verified, the listing breaches these terms or our policies, or the product no longer fits the index.</p>
          <p style={para}>You may ask us to remove your listing at any time by writing to hello@theaiagentindex.com.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Acceptable use</h2>
          <p>Do not submit false, misleading or automated submissions, scrape the site in a way that degrades it for others, or misrepresent your relationship to a product. We may refuse service and remove content that breaches this.</p>
          <p style={para}>Our public API and machine-readable endpoints are provided for reasonable use. We may rate limit or withdraw access if that use becomes unreasonable.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Liability</h2>
          <p>The site is provided as it is. To the extent the law allows, we are not liable for indirect or consequential loss, lost profits, or decisions made in reliance on anything published here.</p>
          <p style={para}>Where we are liable, our total liability to you is limited to the amount you have paid us in the twelve months before the claim.</p>
          <p style={para}>Nothing in these terms limits any right you have under consumer protection law that cannot be limited by agreement.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Changes to these terms</h2>
          <p>We may update these terms. The date at the top shows when they last changed. If a change materially affects a paid product you are already using, we will tell you by email before it applies to you.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Governing law</h2>
          <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada that apply there, and the courts of Ontario have jurisdiction.</p>
        </section>

        <section>
          <h2 style={sectionH2}>Contact</h2>
          <p>Write to <a href="mailto:hello@theaiagentindex.com" style={{ color: '#2563EB', textDecoration: 'none' }}>hello@theaiagentindex.com</a>. See also our <Link href="/privacy" style={{ color: '#2563EB', textDecoration: 'none' }}>Privacy Policy</Link> and our <Link href="/methodology" style={{ color: '#2563EB', textDecoration: 'none' }}>Methodology</Link>, which explains how listings are researched and rated.</p>
        </section>

      </div>
    </div>
  )
}