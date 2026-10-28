import Link from "next/link";
export const metadata = { title: "About PetCare" };
export default function Page() {
  return (
    <main>
      <section className="container hero-mini">
        <div className="eyebrow">A more human kind of pet care</div>
        <h1 className="serif">
          Because they're
          <br />
          family, too.
        </h1>
        <p>
          PetCare is a concept marketplace built around a simple belief: finding
          care for your pet should feel as thoughtful as caring for them
          yourself.
        </p>
      </section>
      <section className="container feature-grid section">
        <img
          className="feature-img"
          src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=1000&q=80"
          alt="Dog enjoying a peaceful moment"
        />
        <div>
          <h2 className="serif">Trust, warmth and clarity.</h2>
          <p className="lead">
            We bring the details that matter into one place: care routines, home
            information, transparent prices and useful updates.
          </p>
          <p className="subtle">
            This is a demonstration product with illustrative users and data,
            not an operating booking service.
          </p>
          <Link className="btn" href="/sitters">
            Explore the demo
          </Link>
        </div>
      </section>
    </main>
  );
}
