import Link from "next/link";
export default function NotFound() {
  return (
    <main
      className="container section"
      style={{ textAlign: "center", minHeight: "50vh" }}
    >
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        A little detour
      </div>
      <h1 className="serif" style={{ fontSize: 72, color: "var(--deep)" }}>
        404
      </h1>
      <h2 className="serif">This page wandered off.</h2>
      <p className="subtle">Let’s get you back to finding thoughtful care.</p>
      <Link className="btn" href="/">
        Back to home
      </Link>
    </main>
  );
}
