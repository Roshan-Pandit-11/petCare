"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PawPrint, Eye, EyeOff, ArrowRight } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register" | "forgot";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  // Form State Fields
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("OWNER");

  // UI Status Managers
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Submission Async Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === "forgot") {
      setIsSubmitted(true);
      return;
    }

    if (mode === "login") {
      if (!email.includes("@") || password.length < 6) {
        setErrorMessage("Please check your email and password constraints.");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        router.push("/owner/dashboard");
      }, 650);
      return;
    }

    if (mode === "register") {
      if (name.trim().length < 2)
        return setErrorMessage("Name must be at least 2 characters.");
      if (!email.includes("@"))
        return setErrorMessage("Please enter a valid email address.");
      if (password.length < 6)
        return setErrorMessage("Password must be at least 6 characters.");

      setIsSubmitting(true);

      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(
            data.error || "Registration failed. Please try again.",
          );
          setIsSubmitting(false);
          return;
        }

        setIsSubmitting(false);
        setIsSubmitted(true);

        setTimeout(() => {
          router.push(
            data.user.role === "sitter"
              ? "/sitter/dashboard"
              : "/owner/dashboard",
          );
        }, 650);
      } catch (error) {
        console.error("Network execution error:", error);
        setErrorMessage("A network error occurred. Please try again later.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="auth-layout">
      {renderVisualSide()}
      <div className="auth-form-side">
        <div className="auth-form">
          {renderFormHeader()}
          {errorMessage && renderErrorAlert()}
          {isSubmitted ? renderSuccessState() : renderActiveForm()}
          {renderFooterLinks()}
        </div>
      </div>
    </main>
  );

  // --- Sub-Render Functional Sections ---

  function renderVisualSide() {
    return (
      <div className="auth-visual">
        <Link className="brand" href="/">
          <span className="brandmark">
            <PawPrint size={19} />
          </span>
          petcare.
        </Link>
        <h2
          className="serif"
          style={{ fontSize: 43, color: "var(--deep)", marginTop: 35 }}
        >
          Care that feels
          <br />
          like coming home.
        </h2>
        <p className="subtle">
          A little peace of mind, for you and your best friend.
        </p>
        <img
          src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=85"
          alt="Happy dog"
        />
      </div>
    );
  }

  function renderFormHeader() {
    return (
      <>
        <div className="eyebrow">
          {mode === "login" && "Welcome back"}
          {mode === "register" && "A lovely place to begin"}
          {mode === "forgot" && "Account support"}
        </div>
        <h1 className="serif">
          {mode === "login" && "Good to see you."}
          {mode === "register" && "Join the family."}
          {mode === "forgot" && "Reset your password."}
        </h1>
        <p className="subtle">
          {mode === "login" && "Sign in to explore your personal workspace."}
          {mode === "register" &&
            "Create your application account credentials."}
          {mode === "forgot" && "We’ll show a local demo confirmation."}
        </p>
      </>
    );
  }

  function renderErrorAlert() {
    return (
      <div
        className="notice"
        style={{
          borderColor: "#a34c43",
          color: "#a34c43",
          background: "#fdf3f2",
          marginBottom: 20,
        }}
      >
        <b>Submission Error</b>
        <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{errorMessage}</p>
      </div>
    );
  }

  function renderSuccessState() {
    return (
      <div className="notice">
        <b>
          {mode === "forgot"
            ? "Reset request simulated."
            : "Account registration successful!"}
        </b>
        <p style={{ margin: "8px 0 0" }}>
          {mode === "forgot"
            ? "No email was sent."
            : "Your account profile has been generated. Forwarding..."}
        </p>
        <Link
          href={
            mode === "forgot"
              ? "/auth/login"
              : role === "sitter"
                ? "/sitter/dashboard"
                : "/owner/dashboard"
          }
          className="btn"
          style={{ marginTop: 14 }}
        >
          Continue to Dashboard <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  function renderActiveForm() {
    return (
      <form onSubmit={handleSubmit} noValidate>
        {mode === "register" && (
          <>
            <div className="form-control">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                minLength={2}
              />
            </div>
            <div className="form-control">
              <label htmlFor="role">I’m here as a</label>
              <select
                id="role"
                value={role}
                disabled={isSubmitting}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="OWNER">Pet owner</option>
                <option value="SITTER">Pet sitter</option>
              </select>
            </div>
          </>
        )}

        <div className="form-control">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            required
            disabled={isSubmitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {mode !== "forgot" && (
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <div
              style={{
                display: "flex",
                border: "1px solid var(--line)",
                borderRadius: 8,
                background: "white",
                paddingRight: 10,
              }}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isSubmitting}
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{ border: 0, flex: 1, minWidth: 0 }}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide" : "Show"}
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "var(--muted)",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && password.length < 6 && (
              <small style={{ color: "#a34c43" }}>
                Use at least 6 characters.
              </small>
            )}
          </div>
        )}

        {mode === "login" && (
          <div style={{ textAlign: "right", margin: "-5px 0 18px" }}>
            <Link className="subtle" href="/auth/forgot-password">
              Forgot password?
            </Link>
          </div>
        )}

        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              {mode === "login"
                ? "Log into account"
                : mode === "register"
                  ? "Create your account"
                  : "Simulate reset request"}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    );
  }

  function renderFooterLinks() {
    return (
      <p className="subtle" style={{ marginTop: 22 }}>
        {mode === "login" && (
          <>
            New to PetCare?{" "}
            <Link
              href="/auth/register"
              style={{ color: "var(--green)", fontWeight: 800 }}
            >
              Create an account
            </Link>
          </>
        )}
        {mode === "register" && (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              style={{ color: "var(--green)", fontWeight: 800 }}
            >
              Log in
            </Link>
          </>
        )}
        {mode === "forgot" && (
          <>
            Remembered your access?{" "}
            <Link
              href="/auth/login"
              style={{ color: "var(--green)", fontWeight: 800 }}
            >
              Back to login
            </Link>
          </>
        )}
      </p>
    );
  }
}
