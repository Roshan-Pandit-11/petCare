import {
  ShieldCheck,
  HeartHandshake,
  ClipboardCheck,
  PhoneCall,
} from "lucide-react";
export const metadata = { title: "Our safety promise" };
export default function Page() {
  return (
    <main>
      <section className="container hero-mini">
        <div className="eyebrow">Trust is a practice</div>
        <h1 className="serif">
          Clear information.
          <br />
          Thoughtful decisions.
        </h1>
        <p>
          Safety starts with knowing who may care for your pet, what their home
          is like and how they plan to meet your pet’s needs.
        </p>
      </section>
      <section className="container section">
        <div className="feature-list">
          {[
            [
              ShieldCheck,
              "Transparent review statuses",
              "Profiles distinguish submitted, pending and approved checks. In this demo, all statuses are seeded and simulated.",
            ],
            [
              HeartHandshake,
              "Care plans that travel",
              "Keep feeding, allergies, medication notes and familiar routines together in the pet profile.",
            ],
            [
              ClipboardCheck,
              "Clear booking terms",
              "Review dates, nightly rates, itemised totals and cancellation notes before the demo confirmation.",
            ],
            [
              PhoneCall,
              "Plan for emergencies",
              "Agree on an emergency contact and veterinarian before any real-world stay. The demo is not an emergency service.",
            ],
          ].map(([I, t, p]: any) => (
            <div key={t}>
              <I size={24} className="feature-icon" />
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
        <div className="notice" style={{ marginTop: 35 }}>
          No real identity, address, background or home checks are performed by
          this demonstration. No insurance coverage or emergency response is
          represented.
        </div>
      </section>
    </main>
  );
}
