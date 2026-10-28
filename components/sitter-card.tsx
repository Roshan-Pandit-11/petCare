"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Star, ShieldCheck, ArrowUpRight } from "lucide-react";
import type { Sitter } from "@/lib/data";
import { money } from "@/lib/utils";
export function SitterCard({ sitter: s }: { sitter: Sitter }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="sitter-card">
      <Link href={`/sitters/${s.id}`}>
        <img
          className="sitter-cover"
          src={s.image}
          alt={`Welcoming home hosted by ${s.name}`}
        />
      </Link>
      <div className="sitter-body">
        <div className="sitter-person">
          <img className="avatar" src={s.avatar} alt="" />
          <div style={{ paddingTop: 24, flex: 1 }}>
            <p className="sitter-name">{s.name}</p>
            <div className="subtle">
              <MapPin
                size={11}
                style={{ display: "inline", verticalAlign: "middle" }}
              />{" "}
              {s.area}
            </div>
          </div>
          <button
            aria-label={saved ? "Remove from favourites" : "Save sitter"}
            className={`heart ${saved ? "active" : ""}`}
            onClick={() => {
              setSaved(!saved);
              try {
                const a = JSON.parse(
                  localStorage.getItem("petcare-favorites") || "[]",
                ) as string[];
                localStorage.setItem(
                  "petcare-favorites",
                  JSON.stringify(
                    saved
                      ? a.filter((x) => x !== s.id)
                      : [...new Set([...a, s.id])],
                  ),
                );
              } catch {}
            }}
          >
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="verified">
          <ShieldCheck size={12} />
          {s.verified.includes("Identity approved")
            ? "Identity reviewed"
            : "Demo profile · review pending"}
        </div>
        <div className="card-meta">
          <span>
            <Star
              size={12}
              fill="#c9a86a"
              color="#c9a86a"
              style={{ display: "inline", verticalAlign: "middle" }}
            />{" "}
            <b>{s.rating.toFixed(2)}</b>{" "}
            <span className="subtle">({s.reviews} sample reviews)</span>
          </span>
          <span className="subtle">{s.experience}</span>
        </div>
        <div className="tag-row">
          {s.tags.slice(0, 3).map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="card-bottom">
          <div>
            <span className="price">{money(s.price)}</span>
            <small className="subtle"> / night</small>
            <div className="subtle">
              {s.available
                ? "Availability shown in demo"
                : "Limited availability"}
            </div>
          </div>
          <Link href={`/sitters/${s.id}`} className="btn btn-small">
            View profile <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
