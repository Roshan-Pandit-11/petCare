"use client";
import { useState } from "react";
import Link from "next/link";
export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [care, setCare] = useState("Dogs");
  const [sent, setSent] = useState(false);
  return (
    <main>
      <section className="container hero-mini">
        <div className="eyebrow">For thoughtful caregivers</div>
        <h1 className="serif">
          Make room for
          <br />
          more tail wags.
        </h1>
        <p>
          Share your experience, shape a care profile and welcome pets into a
          home that fits your schedule.
        </p>
      </section>
      <section className="container feature-grid section">
        <div>
          <h2 className="serif">Care on your terms.</h2>
          <div className="feature-list">
            {[
              [
                "Create your profile",
                "Tell pet parents about your home, experience and routine.",
              ],
              [
                "Set your availability",
                "Choose the days and capacity that work for you.",
              ],
              [
                "Share every little moment",
                "Add thoughtful updates during sample stays.",
              ],
              [
                "Understand your earnings",
                "See a transparent demonstration of booking totals.",
              ],
            ].map(([a, b]) => (
              <div key={a}>
                <h3>{a}</h3>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="eyebrow">Sitter interest form</div>
          <h2 className="serif" style={{ fontSize: 30 }}>
            Let’s get to know you.
          </h2>
          {sent ? (
            <div className="notice">
              <b>Interest saved in demo.</b>
              <p style={{ margin: "8px 0 0" }}>
                Thanks, {name}. No application has been sent to a real service.
              </p>
              <Link href="/sitter/profile">Explore sitter workspace →</Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim() && email.includes("@")) setSent(true);
              }}
            >
              <div className="form-control" style={{ marginTop: 16 }}>
                <label>Your name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div className="form-control" style={{ marginTop: 16 }}>
                <label>Email (demo only)</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.test"
                />
              </div>
              <div className="form-control" style={{ marginTop: 16 }}>
                <label>Most comfortable caring for</label>
                <select value={care} onChange={(e) => setCare(e.target.value)}>
                  <option>Dogs</option>
                  <option>Cats</option>
                  <option>Dogs and cats</option>
                  <option>Small pets</option>
                </select>
              </div>
              <div className="notice">
                Demo form only. Do not submit real sensitive information.
              </div>
              <button className="btn" style={{ width: "100%" }}>
                Save interest locally
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
