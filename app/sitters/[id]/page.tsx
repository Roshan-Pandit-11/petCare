import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  Heart,
  House,
  ArrowRight,
} from "lucide-react";
import { sitters, pets } from "@/lib/data";
import { money } from "@/lib/utils";
import type { Metadata } from "next";
export function generateStaticParams() {
  return sitters.map((s) => ({ id: s.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = sitters.find((x) => x.id === id);
  return {
    title: s ? `${s.name} · Sitter profile` : "Sitter not found",
    description: s?.bio,
  };
}
export default async function SitterProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = sitters.find((x) => x.id === id);
  if (!s) notFound();
  return (
    <main className="container">
      <div className="page-hero" style={{ paddingBottom: 10 }}>
        <Link href="/sitters" className="subtle">
          ← Back to sitters
        </Link>
      </div>
      <section className="profile-hero">
        <div>
          <img
            className="profile-cover"
            src={s.image}
            alt={`Home environment hosted by ${s.name}`}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <img
              src="https://images.unsplash.com/photo-1601758123927-1968b747d857?auto=format&fit=crop&w=500&q=80"
              alt="Pet-friendly lounge"
              style={{
                width: "32%",
                height: 105,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=500&q=80"
              alt="A dog enjoying outdoor time"
              style={{
                width: "32%",
                height: 105,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=500&q=80"
              alt="Comfortable pet care space"
              style={{
                width: "32%",
                height: 105,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
          </div>
        </div>
        <aside className="profile-aside">
          <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
            <img
              src={s.avatar}
              alt={s.name}
              className="avatar"
              style={{ width: 72, height: 72, border: 0 }}
            />
            <div>
              <h1 className="serif" style={{ fontSize: 29, margin: "0 0 3px" }}>
                {s.name}
              </h1>
              <div className="subtle">
                <MapPin size={12} style={{ display: "inline" }} /> {s.area}
              </div>
              <div style={{ fontSize: 11, marginTop: 5 }}>
                <Star
                  size={12}
                  fill="#c9a86a"
                  color="#c9a86a"
                  style={{ display: "inline" }}
                />{" "}
                {s.rating.toFixed(2)}{" "}
                <span className="subtle">({s.reviews} sample reviews)</span>
              </div>
            </div>
          </div>
          <div className="verified">
            <ShieldCheck size={13} /> Sample verification record
          </div>
          <p className="subtle" style={{ lineHeight: 1.9, marginTop: 15 }}>
            {s.bio}
          </p>
          <div className="stats-row">
            <div className="stat">
              <strong>{s.experience.split(" ")[0]}</strong>
              <span>Years experience</span>
            </div>
            <div className="stat">
              <strong>{s.capacity}</strong>
              <span>Pets at a time</span>
            </div>
            <div className="stat">
              <strong>{s.available ? "Open" : "Limited"}</strong>
              <span>Availability</span>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--line)",
              marginTop: 20,
              paddingTop: 18,
            }}
          >
            <div className="price" style={{ fontSize: 25 }}>
              {money(s.price)} <small>/ night</small>
            </div>
            <div className="subtle">Final price shown before confirmation</div>
            <Link
              className="btn"
              href={`/booking/${s.id}`}
              style={{ width: "100%", marginTop: 15 }}
            >
              Request a stay <ArrowRight size={15} />
            </Link>
            <div className="notice-bar">
              Booking requests in this demo do not contact a real sitter.
            </div>
          </div>
        </aside>
      </section>
      <section className="profile-details">
        <div>
          <div className="content-block">
            <div className="eyebrow">A little about the home</div>
            <h2 className="serif">Comfort, care & familiar routines.</h2>
            <p>
              {s.home} Every stay begins with a conversation about your pet’s
              needs, favourite activities, feeding schedule and the small
              comforts that help them settle in.
            </p>
          </div>
          <div className="content-block">
            <h2 className="serif">Care that feels like them.</h2>
            <div className="feature-list">
              {[
                [
                  House,
                  "Home environment",
                  "A welcoming space for rest and supervised play.",
                ],
                [
                  Heart,
                  "Personal routines",
                  "Feeding and activity plans tailored to your pet.",
                ],
                [
                  Camera,
                  "Daily updates",
                  "A sample journal for notes and photos.",
                ],
                [
                  ShieldCheck,
                  "Transparent checks",
                  "Review the status of each simulated check.",
                ],
              ].map(([I, t, p]: any) => (
                <div key={t}>
                  <I className="feature-icon" size={20} />
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="content-block">
            <h2 className="serif">Accepted pets & amenities</h2>
            <div className="tag-row">
              {s.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
              <span className="tag">Fresh water</span>
              <span className="tag">Daily photo notes</span>
            </div>
            <p>
              Capacity: up to {s.capacity} pets at a time. Confirm compatibility
              and availability directly in the booking request before arranging
              a stay.
            </p>
          </div>
          <div className="content-block">
            <h2 className="serif">Trust & verification</h2>
            {["Identity", "Address", "Home review"].map((v, i) => (
              <div className="list-row" key={v}>
                <CheckCircle2
                  size={17}
                  color={
                    s.verified.some(
                      (x) =>
                        x.toLowerCase().includes(v.toLowerCase()) &&
                        x.includes("approved"),
                    )
                      ? "var(--green)"
                      : "#b6a06b"
                  }
                />
                <div className="row-info">
                  <strong>{v} check</strong>
                  <small>
                    {s.verified.find((x) =>
                      x.toLowerCase().includes(v.toLowerCase()),
                    ) || "Not yet reviewed"}
                  </small>
                </div>
                <span
                  className={`status ${s.verified.some((x) => x.toLowerCase().includes(v.toLowerCase()) && x.includes("approved")) ? "green" : ""}`}
                >
                  {s.verified.some(
                    (x) =>
                      x.toLowerCase().includes(v.toLowerCase()) &&
                      x.includes("approved"),
                  )
                    ? "Approved"
                    : "Pending"}
                </span>
              </div>
            ))}
            <p>
              These are seeded demonstration statuses, not actual identity
              checks, home visits or certifications.
            </p>
          </div>
          <div className="content-block">
            <h2 className="serif">Sample parent notes</h2>
            <span className="tag">ILLUSTRATIVE REVIEWS · DEMO</span>
            <p>
              “A calm, considerate experience with thoughtful updates and clear
              routines.”
            </p>
            <p className="subtle">
              Example review text for interface demonstration only.
            </p>
          </div>
        </div>
        <aside>
          <div className="panel" style={{ position: "sticky", top: 100 }}>
            <h3>Request a stay</h3>
            <p className="subtle">
              Choose dates and a pet to start a local demo booking.
            </p>
            <div className="form-control">
              <label>Pet profile</label>
              <select id="pet">
                <option value="pepper">Pepper · Indie</option>
                <option value="miso">Miso · Cat</option>
              </select>
            </div>
            <div className="form-control" style={{ marginTop: 12 }}>
              <label>Check-in</label>
              <input type="date" id="checkin" defaultValue="2026-11-12" />
            </div>
            <div className="form-control" style={{ marginTop: 12 }}>
              <label>Check-out</label>
              <input type="date" id="checkout" defaultValue="2026-11-16" />
            </div>
            <div className="form-control" style={{ marginTop: 12 }}>
              <label>Special instructions</label>
              <textarea
                id="instructions"
                placeholder="Feeding routine, favourite toy…"
              />
            </div>
            <Link
              className="btn"
              href={`/booking/${s.id}`}
              style={{ width: "100%", marginTop: 15 }}
            >
              Request booking <ArrowRight size={14} />
            </Link>
            <p className="subtle" style={{ marginTop: 10 }}>
              No payment or real-world reservation occurs.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
