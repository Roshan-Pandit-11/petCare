"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  ShieldCheck,
  Wallet,
  HeartHandshake,
  Camera,
  House,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { sitters, image } from "@/lib/data";
import { SitterCard } from "./sitter-card";
export function HomeClient() {
  const router = useRouter();
  const [location, setLocation] = useState("New Delhi");
  const [pet, setPet] = useState("Dog");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="eyebrow">Care that feels like home</div>
              <h1 className="serif">
                A loving home,
                <br />
                whenever you're <em>away.</em>
              </h1>
              <p className="lead">
                Find thoughtful, trusted pet sitters who make every stay feel
                familiar. More tail wags for them, more peace of mind for you.
              </p>
              <form
                className="searchbox"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (start && end && end <= start) {
                    setError("Check-out must be after check-in.");
                    return;
                  }
                  setError("");
                  const q = new URLSearchParams({
                    location,
                    pet,
                    ...(start ? { checkin: start } : {}),
                    ...(end ? { checkout: end } : {}),
                  });
                  router.push(`/sitters?${q.toString()}`);
                }}
              >
                <div className="field">
                  <label>
                    <MapPin size={12} style={{ display: "inline" }} /> Where
                  </label>
                  <input
                    aria-label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or neighbourhood"
                  />
                </div>
                <div className="field">
                  <label>Pet type</label>
                  <select value={pet} onChange={(e) => setPet(e.target.value)}>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Small pet</option>
                  </select>
                </div>
                <div className="field">
                  <label>
                    <CalendarDays size={12} style={{ display: "inline" }} />{" "}
                    Check in
                  </label>
                  <input
                    aria-label="Check-in date"
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>
                    <CalendarDays size={12} style={{ display: "inline" }} />{" "}
                    Check out
                  </label>
                  <input
                    aria-label="Check-out date"
                    type="date"
                    min={start || undefined}
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
                <button className="btn" type="submit">
                  Find a trusted sitter <ArrowRight size={15} />
                </button>
              </form>
              {error && (
                <p role="alert" style={{ color: "#a34c43", fontSize: 11 }}>
                  {error}
                </p>
              )}
              <div className="trustline">
                <ShieldCheck size={16} /> Thoughtful care starts with clear,
                transparent profiles.
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 25,
                }}
              >
                <div style={{ display: "flex" }}>
                  {sitters.slice(0, 3).map((s) => (
                    <img
                      key={s.id}
                      src={s.avatar}
                      alt=""
                      style={{
                        width: 31,
                        height: 31,
                        borderRadius: "50%",
                        border: "2px solid var(--ivory)",
                        objectFit: "cover",
                        marginLeft: -5,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div
                    style={{ color: "#c9a86a", fontSize: 12, letterSpacing: 2 }}
                  >
                    ★★★★★
                  </div>
                  <div className="subtle">
                    Illustrative ratings · sample profiles
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <img
                className="hero-photo"
                src={image}
                alt="A dog enjoying a relaxed moment with a caregiver at home"
              />
              <div className="floating-pill">
                <span style={{ color: "#b18a42" }}>✳</span> Care, with a little
                extra heart
              </div>
              <div className="photo-note">
                <span className="note-icon">
                  <HeartHandshake size={20} />
                </span>
                <div>
                  <strong>Every pet is one of a kind.</strong>
                  <small>Care that follows their routine.</small>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="trust-strip">
          <div className="container trust-items">
            {[
              [
                ShieldCheck,
                "Clear sitter profiles",
                "Know what has been reviewed",
              ],
              [Wallet, "Transparent pricing", "See the breakdown upfront"],
              [
                HeartHandshake,
                "Personalised care",
                "Routines made for your pet",
              ],
              [Camera, "Daily updates", "Stay close while away"],
            ].map(([Icon, title, sub]: any) => (
              <div className="trust-item" key={title}>
                <Icon />
                <div>
                  {title}
                  <small>{sub}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">A simpler kind of care</div>
                <h2 className="serif">
                  Three steps to a<br />
                  happier stay.
                </h2>
              </div>
              <p>
                Finding care should feel reassuring, not overwhelming. Start
                with your pet’s needs, and find a person who gets them.
              </p>
            </div>
            <div className="steps">
              {[
                {
                  n: "01",
                  img: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=800&q=80",
                  title: "Discover your people",
                  text: "Explore detailed profiles, home environments and care styles to find a natural fit.",
                },
                {
                  n: "02",
                  img: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=800&q=80",
                  title: "Meet, choose & book",
                  text: "Compare availability and clear nightly pricing, then send a thoughtful booking request.",
                },
                {
                  n: "03",
                  img: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80",
                  title: "Feel close, even away",
                  text: "Follow along with daily notes, meal logs, walks and little photo moments.",
                },
              ].map((x) => (
                <div className="step" key={x.n}>
                  <img className="step-img" src={x.img} alt="Pet care moment" />
                  <div className="step-number">{x.n}</div>
                  <h3>{x.title}</h3>
                  <p>{x.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section" style={{ background: "#f3f1e9" }}>
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">Meet your neighbourhood</div>
                <h2 className="serif">
                  Good people.
                  <br />
                  Lovely homes.
                </h2>
              </div>
              <Link className="btn btn-outline" href="/sitters">
                Explore all sitters <ArrowRight size={15} />
              </Link>
            </div>
            <div className="sitter-grid">
              {sitters.slice(0, 3).map((s) => (
                <SitterCard key={s.id} sitter={s} />
              ))}
            </div>
            <p className="subtle" style={{ marginTop: 17 }}>
              Sample marketplace profiles for demonstration only. Verification
              labels reflect simulated sample records.
            </p>
          </div>
        </section>
        <section className="feature-band">
          <div className="container feature-grid">
            <img
              className="feature-img"
              src="https://images.unsplash.com/photo-1601758123927-1968b747d857?auto=format&fit=crop&w=1200&q=85"
              alt="A dog resting comfortably at home"
            />
            <div>
              <div className="eyebrow">The PetCare difference</div>
              <h2 className="serif" style={{ fontSize: 46 }}>
                More than a place to stay.
              </h2>
              <p className="lead">
                It’s the familiar little things that make a big difference. We
                help you find care that fits the life your pet already loves.
              </p>
              <div className="feature-list">
                {[
                  [
                    House,
                    "A real home environment",
                    "Explore the space, routines and house rules.",
                  ],
                  [
                    ShieldCheck,
                    "Clear trust signals",
                    "See each review status, not just a badge.",
                  ],
                  [
                    Camera,
                    "Little moments, shared",
                    "Daily updates help you feel part of the stay.",
                  ],
                  [
                    HeartHandshake,
                    "Care that fits",
                    "Share feeding, activity and medical notes.",
                  ],
                ].map(([I, t, p]: any) => (
                  <div key={t}>
                    <I className="feature-icon" size={21} />
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                ))}
              </div>
              <Link className="btn" href="/safety" style={{ marginTop: 15 }}>
                Our safety promise <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  Notes from the pet parent community
                </div>
                <h2 className="serif">
                  The little things
                  <br />
                  mean everything.
                </h2>
              </div>
              <span className="tag">ILLUSTRATIVE SAMPLE STORIES</span>
            </div>
            <div className="quote-grid">
              <div className="quote">
                <div style={{ color: "#c9a86a" }}>★★★★★</div>
                <blockquote>
                  “Knowing the routine was understood made it so much easier to
                  enjoy our trip.”
                </blockquote>
                <small>— An illustrative pet parent story · Demo content</small>
              </div>
              <div className="quote">
                <div style={{ color: "#c9a86a" }}>★★★★★</div>
                <blockquote>
                  “The daily little updates are exactly the kind of reassurance
                  I was hoping for.”
                </blockquote>
                <small>— An illustrative pet parent story · Demo content</small>
              </div>
            </div>
          </div>
        </section>
        <section className="container">
          <div className="cta-band">
            <div>
              <div className="eyebrow" style={{ color: "#d8c59f" }}>
                For the good humans
              </div>
              <h2 className="serif">
                Open your home
                <br />
                to a little more joy.
              </h2>
              <p>
                Build a thoughtful profile and care on a schedule that works for
                you.
              </p>
            </div>
            <Link
              className="btn"
              href="/become-a-sitter"
              style={{ background: "#faf8f2", color: "var(--deep)" }}
            >
              Become a sitter <ArrowRight size={15} />
            </Link>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ maxWidth: 780 }}>
            <div className="eyebrow">A few good questions</div>
            <h2 className="serif">Good to know.</h2>
            {[
              [
                "How are sitters verified?",
                "Profiles show individual review statuses such as submitted, pending or approved. In this demo, verification is simulated and does not represent a real identity or background check.",
              ],
              [
                "How does booking work?",
                "Choose a sitter, select your pet and dates, and send a request. The demo lets you follow the request through simulated booking statuses.",
              ],
              [
                "What about payment?",
                "The checkout experience demonstrates an itemised price and a test payment action only. No real payment is processed.",
              ],
              [
                "Can I share medical information?",
                "Pet profiles include fields for feeding, allergies, medication notes and veterinary contacts. Share only what is needed for care.",
              ],
              [
                "Will I get updates?",
                "The sitter dashboard supports local demo stay updates, including meal, walk, medication and photo notes.",
              ],
              [
                "What happens in an emergency?",
                "Agree on an emergency contact and veterinarian before a stay. PetCare is a demo marketplace and does not provide emergency response services.",
              ],
            ].map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
            <div style={{ marginTop: 22 }}>
              <Link href="/faq" className="btn btn-outline">
                Visit all FAQs <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
