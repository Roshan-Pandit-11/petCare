export const metadata = { title: "Frequently asked questions" };
const faqs = [
  [
    "How are sitters verified?",
    "The demo tracks individual identity, address and home review statuses. All records are simulated; no actual checks are performed.",
  ],
  [
    "When am I charged?",
    "This frontend only demonstrates a checkout flow. No real payment method is collected and no payment is processed.",
  ],
  [
    "What is the cancellation policy?",
    "A sitter’s profile and booking summary should explain the policy before a real booking. The demo shows example booking information only.",
  ],
  [
    "What pet information should I share?",
    "Include feeding routines, allergies, medication notes, temperament, exercise needs, veterinary details and emergency contacts where appropriate.",
  ],
  [
    "Will I receive updates?",
    "The sitter workspace lets you add local sample updates such as meals, walks, medication and check-in notes.",
  ],
  [
    "What if there is an emergency?",
    "Agree on a plan, emergency contact and veterinarian with the sitter before the stay. This demo does not provide emergency response.",
  ],
  [
    "Can I get a refund?",
    "Refunds are not available in this demo because there are no real charges. A production service would need a clear published policy and support process.",
  ],
  [
    "Are these real sitters and reviews?",
    "No. Sitter profiles, ratings, review snippets and transactions are illustrative seeded content, not genuine provider records.",
  ],
];
export default function Page() {
  return (
    <main className="container section" style={{ maxWidth: 820 }}>
      <div className="eyebrow">Help & reassurance</div>
      <h1 className="serif page-title">Questions, answered.</h1>
      <p className="subtle">
        Straightforward answers about the PetCare demo and the experience it
        illustrates.
      </p>
      {faqs.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </main>
  );
}
