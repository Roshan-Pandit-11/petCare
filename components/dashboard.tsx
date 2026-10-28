"use client";
import Link from "next/link";
import { useState } from "react";
import {
  PawPrint,
  LayoutDashboard,
  CalendarDays,
  Heart,
  MessageCircle,
  Settings,
  Users,
  ShieldCheck,
  Wallet,
  ClipboardList,
  House,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Camera,
  Clock,
  Dog,
  Search,
  Bell,
  X,
  Save,
  Send,
} from "lucide-react";
import { initialBookings, pets, sitters } from "@/lib/data";
import { money } from "@/lib/utils";
const ownerLinks = [
  ["Overview", "/owner/dashboard", LayoutDashboard],
  ["My pets", "/owner/pets", PawPrint],
  ["Bookings", "/owner/bookings", CalendarDays],
  ["Messages", "/owner/messages", MessageCircle],
  ["Favourites", "/owner/favorites", Heart],
  ["Settings", "/owner/settings", Settings],
] as const;
const sitterLinks = [
  ["Overview", "/sitter/dashboard", LayoutDashboard],
  ["My profile", "/sitter/profile", Users],
  ["Booking requests", "/sitter/bookings", CalendarDays],
  ["Availability", "/sitter/availability", CalendarDays],
  ["Stay updates", "/sitter/stay-updates", Camera],
  ["Earnings", "/sitter/earnings", Wallet],
  ["Settings", "/sitter/settings", Settings],
] as const;
const adminLinks = [
  ["Overview", "/admin/dashboard", LayoutDashboard],
  ["Verifications", "/admin/verifications", ShieldCheck],
  ["Users", "/admin/users", Users],
  ["Bookings", "/admin/bookings", CalendarDays],
  ["Reports & cases", "/admin/reports", ClipboardList],
] as const;
const configs: Record<
  string,
  {
    title: string;
    desc: string;
    links: readonly (readonly [string, string, any])[];
    role: string;
  }
> = {
  owner: {
    title: "Your pet parent space",
    desc: "Everything your pet needs, all in one thoughtful place.",
    links: ownerLinks,
    role: "Pet owner",
  },
  sitter: {
    title: "Your care studio",
    desc: "Manage stays, welcome new guests and keep pet parents close.",
    links: sitterLinks,
    role: "Pet sitter",
  },
  admin: {
    title: "Platform operations",
    desc: "A clear view of the PetCare demo marketplace.",
    links: adminLinks,
    role: "Administrator",
  },
};
export function Dashboard({
  role,
  section = "dashboard",
}: {
  role: "owner" | "sitter" | "admin";
  section?: string;
}) {
  const cfg = configs[role];
  const [toast, setToast] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [petList, setPetList] = useState(pets);
  const [newName, setNewName] = useState("");
  const [newBreed, setNewBreed] = useState("");
  const [newType, setNewType] = useState("Dog");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    "Hi! Pepper loves a quiet morning walk. Anything special we should know?",
    "That sounds perfect — a short walk before breakfast is her favourite.",
  ]);
  const [updates, setUpdates] = useState([
    "Breakfast finished happily · 8:15 AM",
    "Enjoyed a sunny garden break · 10:30 AM",
  ]);
  const [note, setNote] = useState("");
  const [profileName, setProfileName] = useState("Maya Shah");
  const [rate, setRate] = useState("1800");
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [read, setRead] = useState(false);
  const [modal, setModal] = useState("");
  const active =
    cfg.links.find((x) => x[1].split("/").pop() === section) || cfg.links[0];
  const titleMap: Record<string, string> = {
    dashboard:
      role === "owner"
        ? "Welcome back, there."
        : role === "sitter"
          ? "Good morning, Maya."
          : "Overview",
    pets: "Your pet profiles",
    new: "Add a pet",
    "[id]": "Pet details",
    bookings: "Your bookings",
    messages: "Messages",
    favorites: "Your favourite sitters",
    settings: "Account settings",
    profile: "Your sitter profile",
    availability: "Availability calendar",
    "stay-updates": "Stay updates",
    earnings: "Earnings overview",
    verifications: "Verification queue",
    users: "User directory",
    reports: "Reports & complaints",
  };
  const title = titleMap[section] || titleMap.dashboard;
  const ping = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2600);
  };
  const linkTo = (label: string) =>
    cfg.links.find((l) => l[0] === label)?.[1] || "/";
  const changeStatus = (id: string, status: string) => {
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    ping(`Demo booking ${id} marked ${status.toLowerCase()}.`);
  };
  const addPet = () => {
    if (!newName.trim() || !newBreed.trim()) {
      ping("Add a pet name and breed to continue.");
      return;
    }
    setPetList((p) => [
      ...p,
      {
        id: newName.toLowerCase().replace(/\W+/g, "-"),
        name: newName,
        breed: newBreed,
        type: newType,
        image:
          newType === "Cat"
            ? "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=240&q=80"
            : "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=240&q=80",
      },
    ]);
    setNewName("");
    setNewBreed("");
    ping("Pet profile added to this demo session.");
  };
  const addMessage = () => {
    if (!message.trim()) return;
    setMessages((m) => [...m, message]);
    setMessage("");
    ping("Message added locally. It was not delivered to a real person.");
  };
  return (
    <>
      <div className="app-shell">
        <aside className="sidebar">
          <Link className="brand" href="/">
            <span className="brandmark">
              <PawPrint size={18} />
            </span>
            petcare.
          </Link>
          <div className="side-label">{cfg.role} workspace</div>
          {cfg.links.map(([label, url, Icon]) => (
            <Link
              key={url}
              className={`side-link ${url === `/${role}/${section}` || url.endsWith("/" + section) ? "active" : ""}`}
              href={url}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <div
            style={{
              marginTop: "auto",
              padding: "15px 11px",
              background: "var(--ivory)",
              borderRadius: 10,
            }}
          >
            <div className="verified">
              <CheckCircle2 size={12} /> DEMO MODE
            </div>
            <p
              className="subtle"
              style={{ lineHeight: 1.8, margin: "10px 0 0" }}
            >
              Changes stay in this browser session. No real messages, bookings
              or payments are sent.
            </p>
            <Link
              href="/"
              className="subtle"
              style={{ display: "block", marginTop: 12 }}
            >
              ← Back to PetCare
            </Link>
          </div>
        </aside>
        <nav className="mobile-sidebar">
          {cfg.links.map(([label, url, Icon]) => (
            <Link
              key={url}
              className={`side-link ${url === `/${role}/${section}` ? "active" : ""}`}
              href={url}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <main className="dashboard-main">
          <div className="dash-header">
            <div>
              <div className="eyebrow">{cfg.role} workspace</div>
              <h1 className="serif">{title}</h1>
              <p>
                {section === "dashboard"
                  ? cfg.desc
                  : "Manage your details and activity in the PetCare demo."}
              </p>
            </div>
            <button
              className="heart"
              aria-label="Notifications"
              onClick={() => {
                setRead(true);
                ping("You are all caught up in this demo.");
              }}
            >
              <Bell size={17} />
              {!read && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#c9a86a",
                    position: "absolute",
                    margin: "-20px 0 0 13px",
                  }}
                />
              )}
            </button>
          </div>
          {section === "dashboard" && (
            <>
              <div className="metric-grid">
                {(role === "owner"
                  ? [
                      [
                        "Your pets",
                        String(petList.length),
                        "Profiles in your care",
                      ],
                      ["Upcoming stays", "2", "Across your sample bookings"],
                      ["Saved sitters", "3", "Curated for you"],
                      [
                        "Stay updates",
                        String(updates.length),
                        "Recent local demo notes",
                      ],
                    ]
                  : role === "sitter"
                    ? [
                        ["New requests", "3", "Review when you’re ready"],
                        ["Upcoming stays", "2", "On your sample calendar"],
                        [
                          "Average rating",
                          "4.98",
                          "Illustrative profile rating",
                        ],
                        ["Demo earnings", money(28400), "Not actual income"],
                      ]
                    : [
                        ["Demo users", "128", "Seeded sample records"],
                        ["Active sitters", "24", "Illustrative listing state"],
                        [
                          "Pending reviews",
                          "7",
                          "Simulated verification queue",
                        ],
                        [
                          "Bookings",
                          String(bookings.length),
                          "Sample booking records",
                        ],
                      ]
                ).map(([l, v, f]) => (
                  <div className="metric" key={l}>
                    <div className="metric-label">{l}</div>
                    <div className="metric-value">{v}</div>
                    <div className="metric-foot">{f}</div>
                  </div>
                ))}
              </div>
              <div className="two-col">
                <section className="panel">
                  <div className="panel-head">
                    <h3>
                      {role === "admin"
                        ? "Recent platform activity"
                        : "Booking activity"}
                    </h3>
                    <Link
                      href={linkTo(role === "admin" ? "Bookings" : "Bookings")}
                      className="subtle"
                    >
                      View all ↗
                    </Link>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Booking</th>
                          <th>Pet / guest</th>
                          <th>Dates</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id}>
                            <td>
                              <b>{b.id}</b>
                            </td>
                            <td>
                              {b.pet} · {b.sitter}
                            </td>
                            <td>{b.dates}</td>
                            <td>
                              <span
                                className={`status ${b.status === "Completed" ? "green" : b.status === "Pending" ? "" : "gray"}`}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="panel">
                  <div className="panel-head">
                    <h3>
                      {role === "owner"
                        ? "Your pets"
                        : role === "sitter"
                          ? "Your next guests"
                          : "Needs attention"}
                    </h3>
                    <Link
                      href={linkTo(
                        role === "owner"
                          ? "My pets"
                          : role === "sitter"
                            ? "Booking requests"
                            : "Verifications",
                      )}
                      className="subtle"
                    >
                      See more ↗
                    </Link>
                  </div>
                  {(role === "owner"
                    ? petList
                    : role === "sitter"
                      ? pets
                      : sitters.slice(0, 3)
                  )
                    .slice(0, 3)
                    .map((p: any) => (
                      <div className="list-row" key={p.id}>
                        <img src={p.image || p.avatar} alt="" />
                        <div className="row-info">
                          <strong>{p.name}</strong>
                          <small>{p.breed || p.area || "Sample record"}</small>
                        </div>
                        <ArrowUpRight size={15} color="var(--green)" />
                      </div>
                    ))}
                </section>
              </div>
              <section className="panel">
                <div className="panel-head">
                  <h3>Thoughtful next steps</h3>
                  <span className="tag">DEMO SHORTCUTS</span>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {role === "owner" ? (
                    <>
                      <Link className="btn" href="/sitters">
                        Find a sitter <ArrowUpRight size={14} />
                      </Link>
                      <Link className="btn btn-outline" href="/owner/pets/new">
                        <Plus size={14} /> Add a pet
                      </Link>
                      <Link className="btn btn-outline" href="/owner/messages">
                        Message a sitter
                      </Link>
                    </>
                  ) : role === "sitter" ? (
                    <>
                      <Link className="btn" href="/sitter/bookings">
                        Review requests
                      </Link>
                      <Link
                        className="btn btn-outline"
                        href="/sitter/availability"
                      >
                        Update availability
                      </Link>
                      <Link
                        className="btn btn-outline"
                        href="/sitter/stay-updates"
                      >
                        Add stay update
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="btn" href="/admin/verifications">
                        Review verification queue
                      </Link>
                      <Link className="btn btn-outline" href="/admin/reports">
                        Review reports
                      </Link>
                    </>
                  )}
                </div>
              </section>
            </>
          )}
          {(section === "pets" || section === "new") && role === "owner" && (
            <>
              <section className="panel">
                <div className="panel-head">
                  <h3>
                    {section === "new"
                      ? "Create a pet profile"
                      : "Pet profiles"}
                  </h3>
                  <Link className="btn btn-small" href="/owner/pets/new">
                    <Plus size={14} /> Add pet
                  </Link>
                </div>
                {section === "new" || modal === "addpet" ? (
                  <>
                    <div className="form-grid">
                      <div className="form-control">
                        <label htmlFor="petname">Pet name *</label>
                        <input
                          id="petname"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Pepper"
                        />
                      </div>
                      <div className="form-control">
                        <label htmlFor="breed">Breed and age *</label>
                        <input
                          id="breed"
                          value={newBreed}
                          onChange={(e) => setNewBreed(e.target.value)}
                          placeholder="e.g. Indie · 3 years"
                        />
                      </div>
                      <div className="form-control">
                        <label htmlFor="type">Species</label>
                        <select
                          id="type"
                          value={newType}
                          onChange={(e) => setNewType(e.target.value)}
                        >
                          <option>Dog</option>
                          <option>Cat</option>
                          <option>Small pet</option>
                        </select>
                      </div>
                      <div className="form-control">
                        <label>Care notes</label>
                        <input placeholder="Feeding routine, temperament…" />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="btn" onClick={addPet}>
                        <Save size={14} /> Save pet profile
                      </button>
                    </div>
                  </>
                ) : null}
                <div className="sitter-grid" style={{ marginTop: 20 }}>
                  {petList.map((p) => (
                    <div className="sitter-card" key={p.id}>
                      <img
                        className="sitter-cover"
                        src={p.image}
                        alt={p.name}
                      />
                      <div className="sitter-body">
                        <h3>{p.name}</h3>
                        <p className="subtle">
                          {p.breed} · {p.type}
                        </p>
                        <div className="tag-row">
                          <span className="tag">Care profile</span>
                          <span className="tag">Demo record</span>
                        </div>
                        <button
                          className="btn btn-outline btn-small"
                          style={{ marginTop: 15 }}
                          onClick={() =>
                            ping(
                              `${p.name}'s profile is ready to edit in the demo.`,
                            )
                          }
                        >
                          Edit details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
          {section === "bookings" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Booking records</h3>
                <select
                  className="control"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                  <option>Accepted</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Pet</th>
                      <th>Sitter</th>
                      <th>Stay dates</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Demo actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter((b) => filter === "All" || b.status === filter)
                      .map((b) => (
                        <tr key={b.id}>
                          <td>
                            <b>{b.id}</b>
                          </td>
                          <td>{b.pet}</td>
                          <td>{b.sitter}</td>
                          <td>{b.dates}</td>
                          <td>{money(b.total)}</td>
                          <td>
                            <span
                              className={`status ${b.status === "Completed" ? "green" : ""}`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 5 }}>
                              {b.status === "Pending" && (
                                <button
                                  className="btn btn-small"
                                  onClick={() =>
                                    changeStatus(
                                      b.id,
                                      role === "sitter"
                                        ? "Accepted"
                                        : "Cancelled",
                                    )
                                  }
                                >
                                  {role === "sitter" ? "Accept" : "Cancel"}
                                </button>
                              )}
                              {b.status === "Accepted" && (
                                <button
                                  className="btn btn-small"
                                  onClick={() =>
                                    changeStatus(b.id, "Confirmed")
                                  }
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-small"
                                onClick={() => setModal(b.id)}
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {modal && bookings.some((b) => b.id === modal) && (
                <div className="notice-bar">
                  {bookings.find((b) => b.id === modal)?.id} · Sample booking
                  detail. Price and status are demonstration values.{" "}
                  <button
                    onClick={() => setModal("")}
                    style={{ float: "right", border: 0, background: "none" }}
                  >
                    Close
                  </button>
                </div>
              )}
            </section>
          )}
          {section === "favorites" && role === "owner" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Saved sitters</h3>
                <Link className="btn btn-small" href="/sitters">
                  Discover sitters
                </Link>
              </div>
              <div className="sitter-grid">
                {sitters.slice(0, 3).map((s) => (
                  <div className="sitter-card" key={s.id}>
                    <img className="sitter-cover" src={s.image} alt="" />
                    <div className="sitter-body">
                      <h3>{s.name}</h3>
                      <p className="subtle">{s.area}</p>
                      <b>
                        {money(s.price)} <small>/ night</small>
                      </b>
                      <div style={{ marginTop: 12 }}>
                        <Link
                          className="btn btn-small"
                          href={`/sitters/${s.id}`}
                        >
                          View profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="subtle" style={{ marginTop: 14 }}>
                Favourite changes from listing cards are stored locally in this
                browser. This seeded section illustrates the experience.
              </p>
            </section>
          )}
          {section === "messages" && role === "owner" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Conversation · Maya Shah</h3>
                <span className="status gray">Local demo only</span>
              </div>
              <div
                style={{
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  justifyContent: "end",
                  padding: "15px 0",
                }}
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: i % 2 ? "flex-end" : "flex-start",
                      background: i % 2 ? "var(--sage)" : "#f5f3ed",
                      padding: "12px 15px",
                      borderRadius: 12,
                      maxWidth: "82%",
                      fontSize: 12,
                    }}
                  >
                    {m}
                    <div className="subtle" style={{ marginTop: 5 }}>
                      Demo message · {i + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="notice">
                Messages are stored locally in this active demo session and are
                not delivered to real people.
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addMessage();
                }}
                style={{ display: "flex", gap: 8 }}
              >
                <input
                  className="control"
                  style={{ flex: 1 }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message…"
                />
                <button className="btn" type="submit">
                  <Send size={14} /> Send
                </button>
              </form>
            </section>
          )}
          {section === "stay-updates" && role === "sitter" && (
            <>
              <section className="panel">
                <div className="panel-head">
                  <h3>Today's care journal</h3>
                  <span className="status green">Active demo stay</span>
                </div>
                <div className="form-grid">
                  <div className="form-control">
                    <label>Update type</label>
                    <select id="updatetype">
                      <option>Activity</option>
                      <option>Meal</option>
                      <option>Walk</option>
                      <option>Medication</option>
                      <option>Check-in</option>
                      <option>Check-out</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label>Short note</label>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Pepper enjoyed her morning walk…"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    className="btn"
                    onClick={() => {
                      if (note.trim()) {
                        setUpdates((u) => [note, ...u]);
                        setNote("");
                        ping("Stay update added to the local demo journal.");
                      } else ping("Write a short update first.");
                    }}
                  >
                    <Plus size={14} /> Add update
                  </button>
                </div>
              </section>
              <section className="panel">
                <h3>Recent updates</h3>
                {updates.map((u, i) => (
                  <div className="list-row" key={i}>
                    <span className="note-icon">
                      <Camera size={17} />
                    </span>
                    <div className="row-info">
                      <strong>{u}</strong>
                      <small>Sample care journal · Demo only</small>
                    </div>
                    <Clock size={14} color="var(--muted)" />
                  </div>
                ))}
              </section>
            </>
          )}
          {section === "availability" && role === "sitter" && (
            <section className="panel">
              <div className="panel-head">
                <h3>October 2026</h3>
                <span className="tag">SELECTABLE DEMO CALENDAR</span>
              </div>
              <div className="calendar">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div className="day-head" key={i}>
                    {d}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2;
                  const valid = day > 0 && day <= 31;
                  return (
                    <button
                      key={i}
                      onClick={(e) => {
                        if (valid) {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).classList.toggle("selected");
                          ping(`October ${day} selection changed locally.`);
                        }
                      }}
                      className={
                        valid
                          ? day % 7 === 0
                            ? "busy"
                            : day % 5 === 0
                              ? "available"
                              : ""
                          : ""
                      }
                      style={{
                        border: 0,
                        cursor: valid ? "pointer" : "default",
                        background: valid ? undefined : "transparent",
                      }}
                    >
                      {valid ? day : ""}
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <span className="subtle">
                  <i
                    style={{
                      display: "inline-block",
                      width: 9,
                      height: 9,
                      background: "#e6ede4",
                      borderRadius: 2,
                      marginRight: 6,
                    }}
                  />
                  Available (sample)
                </span>
                <span className="subtle">
                  <i
                    style={{
                      display: "inline-block",
                      width: 9,
                      height: 9,
                      background: "#f6e6df",
                      borderRadius: 2,
                      marginRight: 6,
                    }}
                  />
                  Booked (sample)
                </span>
                <span className="subtle">
                  Click a date to select or deselect it.
                </span>
              </div>
              <div className="form-actions">
                <button
                  className="btn"
                  onClick={() =>
                    ping("Availability selection saved to this demo view only.")
                  }
                >
                  Save availability
                </button>
              </div>
            </section>
          )}
          {section === "profile" && role === "sitter" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Public profile details</h3>
                <span className="status gray">Demo profile</span>
              </div>
              <div className="form-grid">
                <div className="form-control">
                  <label>Display name</label>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label>Nightly rate (INR)</label>
                  <input
                    type="number"
                    min="500"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label>Experience</label>
                  <input defaultValue="6 years of thoughtful pet care" />
                </div>
                <div className="form-control">
                  <label>Accepted pets</label>
                  <select>
                    <option>Dogs and cats</option>
                    <option>Dogs only</option>
                    <option>Cats only</option>
                    <option>Small pets</option>
                  </select>
                </div>
                <div className="form-control" style={{ gridColumn: "1/-1" }}>
                  <label>About your home and care</label>
                  <textarea defaultValue="A calm, pet-loving home with sunny naps, gentle play and familiar routines." />
                </div>
              </div>
              <div className="form-actions">
                <button
                  className="btn"
                  onClick={() => {
                    setSaved(true);
                    ping("Profile edits saved in this local demo view.");
                  }}
                >
                  <Save size={14} /> Save profile
                </button>
              </div>
              {saved && (
                <div className="notice-bar">
                  Preview: {profileName} · {money(Number(rate) || 0)} per night.
                  Changes are not published to a real marketplace.
                </div>
              )}
            </section>
          )}
          {section === "earnings" && role === "sitter" && (
            <>
              <div className="metric-grid">
                {[
                  ["Total demo earnings", money(28400)],
                  ["Pending demo", money(7200)],
                  ["Completed stays", "8"],
                  ["Average per stay", money(3550)],
                ].map(([a, b]) => (
                  <div className="metric" key={a}>
                    <div className="metric-label">{a}</div>
                    <div className="metric-value">{b}</div>
                    <div className="metric-foot">
                      Illustrative only · no money transferred
                    </div>
                  </div>
                ))}
              </div>
              <section className="panel">
                <h3>Recent demo transactions</h3>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "TR-2048",
                          "Pepper · 4 nights",
                          "Oct 18, 2026",
                          "₹7,200",
                          "Pending",
                        ],
                        [
                          "TR-1982",
                          "Miso · 2 nights",
                          "Oct 08, 2026",
                          "₹3,000",
                          "Completed",
                        ],
                        [
                          "TR-1911",
                          "Luna · 3 nights",
                          "Sep 22, 2026",
                          "₹5,400",
                          "Completed",
                        ],
                      ].map((r) => (
                        <tr key={r[0]}>
                          {r.map((c, i) => (
                            <td key={i}>
                              {i === 4 ? (
                                <span
                                  className={`status ${c === "Completed" ? "green" : ""}`}
                                >
                                  {c}
                                </span>
                              ) : (
                                c
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
          {section === "verifications" && role === "admin" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Simulated verification queue</h3>
                <span className="status">7 pending sample cases</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Submitted</th>
                      <th>Identity</th>
                      <th>Address</th>
                      <th>Home review</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sitters.map((s, i) => (
                      <tr key={s.id}>
                        <td>
                          <b>{s.name}</b>
                          <div className="subtle">{s.area}</div>
                        </td>
                        <td>Oct {12 + i}, 2026</td>
                        <td>
                          <span
                            className={`status ${s.verified.includes("Identity approved") ? "green" : ""}`}
                          >
                            {s.verified.includes("Identity approved")
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status ${s.verified.includes("Address approved") ? "green" : ""}`}
                          >
                            {s.verified.includes("Address approved")
                              ? "Approved"
                              : "Pending"}
                          </span>
                        </td>
                        <td>
                          <span className="status gray">
                            {s.verified.includes("Home reviewed")
                              ? "Reviewed"
                              : "Not reviewed"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-small"
                            onClick={() => setModal(s.id)}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {modal && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <button
                      onClick={() => setModal("")}
                      style={{ float: "right", border: 0, background: "none" }}
                    >
                      <X size={18} />
                    </button>
                    <div className="eyebrow">Simulated review</div>
                    <h3>{sitters.find((s) => s.id === modal)?.name}</h3>
                    <p className="subtle">
                      This is a mock record. No identity documents or actual
                      background checks are accessible in the demo.
                    </p>
                    <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                      <button
                        className="btn"
                        onClick={() => {
                          setModal("");
                          ping(
                            "Sample verification status updated to approved in the demo.",
                          );
                        }}
                      >
                        Mark approved
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          setModal("");
                          ping(
                            "Sample verification marked for follow-up in the demo.",
                          );
                        }}
                      >
                        Request follow-up
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
          {section === "users" && role === "admin" && (
            <section className="panel">
              <div className="panel-head">
                <h3>User directory</h3>
                <input
                  className="control"
                  placeholder="Search name or area"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Area</th>
                      <th>Role</th>
                      <th>Sample status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sitters
                      .filter((s) =>
                        `${s.name} ${s.area}`
                          .toLowerCase()
                          .includes(query.toLowerCase()),
                      )
                      .map((s) => (
                        <tr key={s.id}>
                          <td>
                            <b>{s.name}</b>
                          </td>
                          <td>{s.area}</td>
                          <td>Sitter</td>
                          <td>
                            <span className="status green">Active demo</span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline btn-small"
                              onClick={() => setModal(s.id)}
                            >
                              View / manage
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {modal && (
                <div className="notice-bar">
                  {sitters.find((s) => s.id === modal)?.name} · sample account
                  management{" "}
                  <button
                    className="btn btn-small"
                    onClick={() => {
                      setModal("");
                      ping("Demo account status changed locally.");
                    }}
                  >
                    Suspend demo user
                  </button>{" "}
                  <button
                    onClick={() => setModal("")}
                    style={{ border: 0, background: "none" }}
                  >
                    Close
                  </button>
                </div>
              )}
            </section>
          )}
          {section === "reports" && role === "admin" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Reports & complaints</h3>
                <button
                  className="btn btn-small"
                  onClick={() => setModal("new-report")}
                >
                  <Plus size={13} /> New demo case
                </button>
              </div>
              {[
                ["RP-041", "Care concern", "Listing · sample report", "Open"],
                [
                  "RP-039",
                  "Communication issue",
                  "Booking · sample report",
                  "In review",
                ],
                [
                  "RP-033",
                  "Profile information",
                  "User · sample report",
                  "Resolved",
                ],
              ].map(([id, type, desc, status]) => (
                <div className="list-row" key={id}>
                  <span className="note-icon">
                    <ClipboardList size={17} />
                  </span>
                  <div className="row-info">
                    <strong>
                      {id} · {type}
                    </strong>
                    <small>{desc}</small>
                  </div>
                  <span
                    className={`status ${status === "Resolved" ? "green" : ""}`}
                  >
                    {status}
                  </span>
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => setModal(id)}
                  >
                    Manage
                  </button>
                </div>
              ))}
              {modal && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <button
                      onClick={() => setModal("")}
                      style={{ float: "right", border: 0, background: "none" }}
                    >
                      <X size={18} />
                    </button>
                    <h3>
                      {modal === "new-report" ? "Create sample report" : modal}
                    </h3>
                    <p className="subtle">
                      Update a simulated case. Do not enter sensitive
                      real-person information.
                    </p>
                    <div className="form-control">
                      <label>Internal resolution note</label>
                      <textarea placeholder="Record a short demo note…" />
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn btn-outline"
                        onClick={() => setModal("")}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setModal("");
                          ping("Demo case updated locally.");
                        }}
                      >
                        Save case
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
          {section === "settings" && (
            <section className="panel">
              <div className="panel-head">
                <h3>Preferences & account</h3>
                <span className="tag">LOCAL DEMO</span>
              </div>
              <div className="form-grid">
                <div className="form-control">
                  <label>Display name</label>
                  <input
                    defaultValue={
                      role === "sitter" ? "Maya Shah" : "Pet Parent"
                    }
                  />
                </div>
                <div className="form-control">
                  <label>Email (example)</label>
                  <input type="email" defaultValue="hello@example.test" />
                </div>
                <div className="form-control">
                  <label>Preferred contact</label>
                  <select>
                    <option>In-app messages</option>
                    <option>Email (demo only)</option>
                  </select>
                </div>
                <div className="form-control">
                  <label>Updates</label>
                  <select>
                    <option>Booking and stay updates</option>
                    <option>Booking updates only</option>
                    <option>Essential only</option>
                  </select>
                </div>
              </div>
              <div className="notice">
                These are sample account preferences. No email, SMS or push
                notification is sent.
              </div>
              <div className="form-actions">
                <button
                  className="btn"
                  onClick={() => ping("Preferences saved in the demo view.")}
                >
                  <Save size={14} /> Save preferences
                </button>
              </div>
            </section>
          )}
          {section === "dashboard" && role === "admin" && (
            <section className="panel">
              <h3>Booking status breakdown</h3>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 16,
                }}
              >
                {["Pending", "Upcoming", "Completed"].map((x) => (
                  <div
                    key={x}
                    style={{
                      padding: 18,
                      background: "var(--ivory)",
                      borderRadius: 10,
                      flex: 1,
                      minWidth: 100,
                    }}
                  >
                    <span className="subtle">{x}</span>
                    <div className="metric-value">
                      {bookings.filter((b) => b.status === x).length}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {![
            "dashboard",
            "pets",
            "new",
            "bookings",
            "favorites",
            "messages",
            "stay-updates",
            "availability",
            "profile",
            "earnings",
            "verifications",
            "users",
            "reports",
            "settings",
          ].includes(section) && (
            <section className="panel">
              <div className="panel-head">
                <h3>{title}</h3>
                <span className="tag">DEMO WORKSPACE</span>
              </div>
              <p className="subtle">
                This workspace is ready for the core PetCare demo flow. Use the
                navigation to manage your pets, bookings, profile and messages.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {cfg.links.map(([label, url, Icon]) => (
                  <Link className="btn btn-outline" href={url} key={url}>
                    <Icon size={14} />
                    {label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
      <nav className="mobile-bottom">
        <Link href="/">
          <PawPrint />
          <span>Home</span>
        </Link>
        <Link href="/sitters">
          <Search />
          <span>Explore</span>
        </Link>
        <Link href={linkTo("Overview")}>
          <LayoutDashboard />
          <span>Dashboard</span>
        </Link>
        <Link href={linkTo("Settings")}>
          <Settings />
          <span>Settings</span>
        </Link>
      </nav>
    </>
  );
}
