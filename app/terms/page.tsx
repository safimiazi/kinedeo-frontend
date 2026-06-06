import StaticPageLayout from "@/components/StaticPageLayout";

const LAST_UPDATED = "January 1, 2025";

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle={`Last updated: ${LAST_UPDATED}`}
    >
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 shadow-sm">
        <style>{`
          .terms h2 { font-family: 'Playfair Display', serif; color: #2d1a24; font-size: 1.2rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; }
          .terms p, .terms li { color: rgba(109,27,59,0.8); line-height: 1.7; font-size: 0.875rem; }
          .terms ul { padding-left: 1.25rem; margin-bottom: 1rem; }
          .terms li { margin-bottom: 0.4rem; }
          .terms a { color: #e91e8c; }
        `}</style>

        <div className="terms space-y-1">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of <strong>kinedeo.com</strong> operated by KineDeo Bangladesh.
            By accessing or purchasing from our website, you agree to be bound by these Terms.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using our website, you confirm that you are at least 18 years of age (or have parental consent), have read and understood these Terms, and agree to be legally bound by them.
          </p>

          <h2>2. Products & Availability</h2>
          <ul>
            <li>All product descriptions, images, and prices are subject to change without notice.</li>
            <li>We reserve the right to discontinue any product at any time.</li>
            <li>Product colours may appear slightly different on-screen due to monitor settings.</li>
            <li>We do our best to keep stock levels accurate, but occasionally an item may be out of stock after you order. In such cases, we will notify you and offer a full refund or substitution.</li>
          </ul>

          <h2>3. Pricing & Payment</h2>
          <ul>
            <li>All prices are in <strong>Bangladeshi Taka (BDT / ৳)</strong>.</li>
            <li>Prices include applicable taxes unless stated otherwise.</li>
            <li>We reserve the right to correct pricing errors, even after an order is placed. In such cases, we will notify you and offer a refund or the corrected price.</li>
            <li>Payments are processed securely via SSLCommerz. We do not store card details.</li>
          </ul>

          <h2>4. Order Acceptance</h2>
          <p>
            Placing an order does not constitute a contract. An order is accepted when we confirm it via SMS/email. We reserve the right to refuse or cancel any order for any reason, including suspected fraud or stock unavailability.
          </p>

          <h2>5. Shipping & Delivery</h2>
          <ul>
            <li>Estimated delivery times are provided at checkout and are not guaranteed.</li>
            <li>We are not responsible for delays caused by courier services, weather, or other events outside our control.</li>
            <li>Risk of loss transfers to you upon delivery.</li>
          </ul>

          <h2>6. Returns & Refunds</h2>
          <p>
            Please refer to our <a href="/returns">Returns & Refunds Policy</a> for full details on eligibility, process, and timelines.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content on kinedeo.com — including text, images, logos, and designs — is owned by KineDeo and protected by copyright law. You may not reproduce, distribute, or use our content without written permission.
          </p>

          <h2>8. User Accounts</h2>
          <ul>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to notify us immediately of any unauthorised account access.</li>
            <li>We reserve the right to terminate accounts that violate these Terms.</li>
          </ul>

          <h2>9. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to hack, scrape, or disrupt our systems</li>
            <li>Submit false or fraudulent orders</li>
            <li>Impersonate KineDeo or its staff</li>
            <li>Post offensive, defamatory, or misleading reviews</li>
          </ul>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, KineDeo shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability shall not exceed the amount paid for the specific order in dispute.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the website after changes constitutes acceptance of the updated Terms.
          </p>

          <h2>13. Contact</h2>
          <p>
            For questions about these Terms:<br />
            📧 <a href="mailto:hello@kinedeo.com">hello@kinedeo.com</a><br />
            📍 Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </StaticPageLayout>
  );
}
