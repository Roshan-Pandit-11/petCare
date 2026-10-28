"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
} from "lucide-react";
import { sitters } from "@/lib/data";
import { SitterCard } from "./sitter-card";
export function Marketplace() {
  const params = useSearchParams();
  const [location, setLocation] = useState(params.get("location") || "");
  const [pet, setPet] = useState(params.get("pet") || "Any pet");
  const [max, setMax] = useState("3000");
  const [verified, setVerified] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const results = useMemo(() => {
    let r = sitters.filter(
      (s) =>
        (!location ||
          s.area.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes("delhi")) &&
        (pet === "Any pet" ||
          s.tags.some((t) => t.toLowerCase().includes(pet.toLowerCase())) ||
          (pet === "Small pet" && s.tags.includes("Small pets"))) &&
        s.price <= Number(max) &&
        (!verified || s.verified.includes("Identity approved")) &&
        (!outdoor || s.tags.some((t) => /garden|outdoor/i.test(t))) &&
        (!query ||
          `${s.name} ${s.area} ${s.bio}`
            .toLowerCase()
            .includes(query.toLowerCase())),
    );
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sort === "low") r.sort((a, b) => a.price - b.price);
    if (sort === "high") r.sort((a, b) => b.price - a.price);
    return r;
  }, [location, pet, max, verified, outdoor, sort, query]);
  function reset() {
    setLocation("");
    setPet("Any pet");
    setMax("3000");
    setVerified(false);
    setOutdoor(false);
    setQuery("");
  }
  return (
    <>
      <section className="page-hero container">
        <div className="eyebrow">The right fit for your best friend</div>
        <h1 className="page-title serif">
          Find their home away
          <br />
          from home.
        </h1>
        <p>
          Meet thoughtful local sitters, explore their spaces and choose care
          that feels right. Sample profiles are used throughout this demo.
        </p>
        <div
          className="searchbox"
          style={{
            maxWidth: 800,
            gridTemplateColumns: "1.2fr 1fr 1fr",
            marginTop: 24,
          }}
        >
          <div className="field">
            <label>Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Area or city"
            />
          </div>
          <div className="field">
            <label>Pet type</label>
            <select value={pet} onChange={(e) => setPet(e.target.value)}>
              <option>Any pet</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Small pet</option>
            </select>
          </div>
          <div className="field">
            <label>Search sitters</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or keyword"
            />
          </div>
        </div>
      </section>
      <section className="container market-layout">
        <aside className={`filters ${showFilters ? "" : "collapsed"}`}>
          <div className="panel-head">
            <h3>
              <SlidersHorizontal
                size={15}
                style={{ display: "inline", marginRight: 6 }}
              />{" "}
              Refine your search
            </h3>
            <button
              className="btn btn-ghost btn-small"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide" : "Show"}
            </button>
          </div>
          <div className="filter-group">
            <h4>Nightly budget · up to ₹{max}</h4>
            <input
              aria-label="Maximum nightly budget"
              type="range"
              min="1000"
              max="3000"
              step="100"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              style={{ width: "100%", accentColor: "var(--green)" }}
            />
            <div className="subtle">
              ₹1,000 <span style={{ float: "right" }}>₹3,000+</span>
            </div>
          </div>
          <div className="filter-group">
            <h4>Trust & home</h4>
            <label className="check">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => setVerified(e.target.checked)}
              />{" "}
              Identity approved
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={outdoor}
                onChange={(e) => setOutdoor(e.target.checked)}
              />{" "}
              Outdoor space
            </label>
          </div>
          <div className="filter-group">
            <h4>Accepted pets</h4>
            {["Dog", "Cat", "Small pet"].map((p) => (
              <label className="check" key={p}>
                <input
                  type="radio"
                  name="petfilter"
                  checked={pet === p}
                  onChange={() => setPet(p)}
                />
                {p}s
              </label>
            ))}
          </div>
          <button
            className="btn btn-outline"
            style={{ width: "100%" }}
            onClick={reset}
          >
            <RotateCcw size={13} /> Clear all filters
          </button>
        </aside>
        <div>
          <div className="market-tools">
            <div>
              <strong>{results.length} sitters</strong>
              <span className="subtle"> · matching your preferences</span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select
                aria-label="Sort sitters"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest rated</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
              <button
                className={`heart ${view === "grid" ? "active" : ""}`}
                aria-label="Grid view"
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                className={`heart ${view === "list" ? "active" : ""}`}
                aria-label="List view"
                onClick={() => setView("list")}
              >
                <List size={15} />
              </button>
            </div>
          </div>
          {results.length ? (
            <div className={`results-grid ${view}`}>
              {results.map((s) => (
                <SitterCard key={s.id} sitter={s} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={28} color="var(--green)" />
              <h3>No sitters found just yet</h3>
              <p className="subtle">
                Try a broader area or clear a few filters to see more options.
              </p>
              <button className="btn" onClick={reset}>
                Clear filters
              </button>
            </div>
          )}
          <p className="subtle" style={{ marginTop: 20 }}>
            Availability and verification information are illustrative demo
            records, not live provider data.
          </p>
        </div>
      </section>
    </>
  );
}
