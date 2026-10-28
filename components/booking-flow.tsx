"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import { sitters, pets } from "@/lib/data";
import { money } from "@/lib/utils";
export function BookingFlow({ mode }: { mode: "booking" | "checkout" }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const s = sitters.find((x) => x.id === params.id) || sitters[0];
  const [pet, setPet] = useState("pepper");
  const [start, setStart] = useState("2026-11-12");
  const [end, setEnd] = useState("2026-11-16");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const nights =
    start && end
      ? Math.max(
          0,
          Math.round(
            (new Date(end).getTime() - new Date(start).getTime()) / 86400000,
          ),
        )
      : 0;
  const subtotal = nights * s.price;
  const fee = Math.round(subtotal * 0.08);
  const total = subtotal + fee;
  function proceed() {
    if (!start || !end || nights < 1) {
      setError("Choose a check-out date after check-in.");
      return;
    }
    if (!terms) {
      setError("Please acknowledge the demo terms to continue.");
      return;
    }
    const id = `PC-${Date.now().toString().slice(-6)}`;
    const rec = {
      id,
      sitter: s.name,
      sitterId: s.id,
      pet: pet === "pepper" ? "Pepper" : "Miso",
      dates: `${start} – ${end}`,
      status: mode === "booking" ? "Pending" : "Payment pending",
      total,
      instructions: notes,
      nights,
      subtotal,
      fee,
    };
    try {
      localStorage.setItem("petcare-last-booking", JSON.stringify(rec));
      const old = JSON.parse(
        localStorage.getItem("petcare-demo-bookings") || "[]",
      );
      localStorage.setItem(
        "petcare-demo-bookings",
        JSON.stringify([rec, ...old]),
      );
    } catch {}
    if (mode === "booking") router.push(`/booking/${id}?created=1`);
    else setDone(true);
  }
  if (params.id.startsWith("PC-"))
    return (
      <main
        className="container section"
        style={{ maxWidth: 720, textAlign: "center" }}
      >
        <div
          className="note-icon"
          style={{ margin: "0 auto 20px", width: 64, height: 64 }}
        >
          <CheckCircle2 size={30} />
        </div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          Request saved locally
        </div>
        <h1 className="serif page-title">Your demo request is ready.</h1>
        <p className="subtle">
          Reference {params.id}. This is a simulated request only. The sitter
          has not been contacted and no booking is confirmed.
        </p>
        <div className="panel" style={{ textAlign: "left" }}>
          <h3>What happens next in the demo?</h3>
          <p className="subtle">
            Explore booking status transitions in your workspace. You can also
            continue through the simulated checkout to see the itemised price
            experience.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            <Link className="btn" href={`/checkout/${s.id}`}>
              Continue to demo checkout <ArrowRight size={14} />
            </Link>
            <Link className="btn btn-outline" href="/owner/bookings">
              View my bookings
            </Link>
          </div>
        </div>
      </main>
    );
  if (done)
    return (
      <main
        className="container section"
        style={{ maxWidth: 700, textAlign: "center" }}
      >
        <div
          className="note-icon"
          style={{ margin: "0 auto 20px", width: 64, height: 64 }}
        >
          <CheckCircle2 size={30} />
        </div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          Demo checkout complete
        </div>
        <h1 className="serif page-title">A plan for a lovely stay.</h1>
        <p className="subtle">
          Your simulated payment action is complete. No money was charged, and
          no real booking was confirmed.
        </p>
        <div className="panel" style={{ textAlign: "left", marginTop: 25 }}>
          <div className="panel-head">
            <h3>Demo receipt</h3>
            <span className="status green">SIMULATED</span>
          </div>
          <div className="list-row">
            <img src={s.avatar} alt="" />
            <div className="row-info">
              <strong>{s.name}</strong>
              <small>
                {pet === "pepper" ? "Pepper" : "Miso"} · {start} – {end}
              </small>
            </div>
            <b>{money(total)}</b>
          </div>
          <p className="subtle">
            Itemised total includes a sample 8% platform fee. This fee is
            illustrative and not a real charge.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link className="btn" href="/owner/bookings">
            View bookings
          </Link>
          <Link className="btn btn-outline" href="/owner/dashboard">
            Owner dashboard
          </Link>
        </div>
      </main>
    );
  return (
    <main className="container section" style={{ maxWidth: 980 }}>
      <div className="eyebrow">
        {mode === "booking"
          ? "One thoughtful stay at a time"
          : "Secure-feeling demo checkout"}
      </div>
      <h1 className="serif page-title">
        {mode === "booking"
          ? "Request your stay."
          : "Review & complete your stay."}
      </h1>
      <p className="subtle">
        Every booking and payment step here is simulated. No real reservation or
        charge will occur.
      </p>
      <div
        className="profile-details"
        style={{ gridTemplateColumns: "1fr 340px", marginTop: 25 }}
      >
        <section className="panel">
          <div className="panel-head">
            <h3>Stay details</h3>
            <span className="tag">
              STEP {mode === "booking" ? "1" : "2"} OF 2
            </span>
          </div>
          <div className="list-row">
            <img src={s.avatar} alt="" />
            <div className="row-info">
              <strong>{s.name}</strong>
              <small>
                {s.area} · {s.experience}
              </small>
            </div>
            <b>
              {money(s.price)}
              <small className="subtle"> / night</small>
            </b>
          </div>
          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="form-control">
              <label htmlFor="pet">Pet profile</label>
              <select
                id="pet"
                value={pet}
                onChange={(e) => setPet(e.target.value)}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.breed}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label>Care type</label>
              <select>
                <option>Home boarding</option>
                <option>Day care (demo)</option>
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="start">Check-in</label>
              <input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="end">Check-out</label>
              <input
                id="end"
                type="date"
                min={start}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="form-control" style={{ gridColumn: "1/-1" }}>
              <label htmlFor="notes">Special instructions</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Feeding routine, favourite toy, allergies or medication notes…"
              />
            </div>
          </div>
          {mode === "checkout" && (
            <div
              className="panel"
              style={{ marginTop: 20, background: "var(--ivory)" }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Wallet color="var(--green)" />
                <div>
                  <b>Demo payment method</b>
                  <div className="subtle">
                    Test action only · No card details required
                  </div>
                </div>
              </div>
              <p className="subtle" style={{ margin: "12px 0 0" }}>
                No payment provider is connected. Never enter card numbers or
                CVVs into this demo.
              </p>
            </div>
          )}
          <label
            className="check"
            style={{ marginTop: 20, alignItems: "flex-start" }}
          >
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
            />
            <span>
              I understand this is a simulated booking and payment. I have
              reviewed the sample cancellation and care terms.
            </span>
          </label>
          {error && (
            <p role="alert" style={{ color: "#a34c43", fontSize: 11 }}>
              {error}
            </p>
          )}
          <div className="form-actions">
            <button className="btn" onClick={proceed}>
              {mode === "booking"
                ? "Create demo request"
                : "Simulate test payment"}{" "}
              <ArrowRight size={14} />
            </button>
          </div>
        </section>
        <aside className="profile-aside" style={{ position: "static" }}>
          <h3>Price breakdown</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 18,
            }}
          >
            <span className="subtle">
              {money(s.price)} × {nights} nights
            </span>
            <b>{money(subtotal)}</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <span className="subtle">Platform fee · sample 8%</span>
            <b>{money(fee)}</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid var(--line)",
              paddingTop: 18,
              marginTop: 18,
            }}
          >
            <b>Total (INR)</b>
            <strong style={{ fontSize: 22, color: "var(--green)" }}>
              {money(total)}
            </strong>
          </div>
          <p className="subtle" style={{ marginTop: 15 }}>
            Rule: each overnight stay is billed as one night between check-in
            and check-out. Minimum one night.
          </p>
          <div className="notice">
            <ShieldCheck
              size={14}
              style={{ display: "inline", verticalAlign: "middle" }}
            />{" "}
            Sample price only. No real payment is taken.
          </div>
          <p className="subtle">
            Cancellation terms: demo requests may be changed in the sample
            dashboard. No refund or payment policy is applied.
          </p>
        </aside>
      </div>
    </main>
  );
}
