import StaticPageLayout from "@/components/StaticPageLayout";

const LAST_UPDATED = "January 1, 2025";

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle={`Last updated: ${LAST_UPDATED}`}
    >
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 shadow-sm prose prose-sm max-w-none">
        <style>{`
          .prose h2 { font-family: 'Playfair Display', serif; color: #2d1a24; font-size: 1.2rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; }
          .prose p, .prose li { color: #6d1b3b; opacity: 0.8; line-height: 1.7; font-size: 0.875rem; }
          .prose ul { padding-left: 1.25rem; }
          .prose li { margin-bottom: 0.4rem; }
          .prose a { color: #e91e8c; }
        `}</style>

        <p>
          Welcome to <strong>KineDeo</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;). We operate the website{" "}
          <a href="https://kinedeo.com">kinedeo.com</a>. This Privacy Policy explains how we collect, use, and protect your information when you use our website or make a purchase.
        </p>
        <p>By using KineDeo, you agree to the collection and use of information in accordance with this policy.</p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, phone number, email address, delivery address — provided when you place an order or create an account.</li>
          <li><strong>Order Information:</strong> Products purchased, order history, transaction IDs, and payment status.</li>
          <li><strong>Device & Usage Data:</strong> IP address, browser type, pages visited, time spent on pages — collected automatically via cookies and analytics tools.</li>
          <li><strong>Communications:</strong> Messages you send us via email or contact forms.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To send order confirmations and shipping updates via SMS or email</li>
          <li>To respond to customer support requests</li>
          <li>To improve our website and product offerings</li>
          <li>To send promotional offers (only with your consent — you can unsubscribe at any time)</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>3. Payment Information</h2>
        <p>
          All payments are processed through <strong>SSLCommerz</strong>, a PCI-DSS certified payment gateway. We do not store your card details on our servers. SSLCommerz&rsquo;s privacy policy governs the handling of your payment data.
        </p>

        <h2>4. Sharing Your Information</h2>
        <p>We do not sell or rent your personal information. We may share it with:</p>
        <ul>
          <li><strong>Delivery Partners:</strong> To fulfil your order</li>
          <li><strong>Payment Processors:</strong> SSLCommerz, for transaction processing</li>
          <li><strong>Analytics Tools:</strong> For anonymous website analytics</li>
          <li><strong>Legal Authorities:</strong> When required by law</li>
        </ul>

        <h2>5. Cookies</h2>
        <p>
          We use cookies to improve your browsing experience, remember your cart, and analyse site traffic. See our{" "}
          <a href="/cookies">Cookie Policy</a> for full details. You can disable cookies in your browser settings, though some features may not work correctly.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your order data for up to <strong>3 years</strong> for accounting and legal purposes. Account data is retained until you request deletion. You can request deletion by emailing hello@kinedeo.com.
        </p>

        <h2>7. Your Rights</h2>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications at any time</li>
        </ul>
        <p>To exercise these rights, email us at <a href="mailto:hello@kinedeo.com">hello@kinedeo.com</a>.</p>

        <h2>8. Security</h2>
        <p>
          We use industry-standard encryption (HTTPS/SSL) to protect data in transit. Access to your data is restricted to authorised personnel only. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2>9. Children&rsquo;s Privacy</h2>
        <p>
          Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with information, please contact us immediately.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Continued use of the website after changes constitutes acceptance.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          For privacy-related questions, contact us at:<br />
          📧 <a href="mailto:hello@kinedeo.com">hello@kinedeo.com</a><br />
          📍 Dhaka, Bangladesh
        </p>
      </div>
    </StaticPageLayout>
  );
}
