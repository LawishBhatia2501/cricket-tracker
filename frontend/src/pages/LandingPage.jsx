import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

/* ─── Static style constants ─────────────────────────────────────────────── */
const MAIN_CONTAINER_STYLE = {
  minHeight: "100vh",
  background: "#0d1117",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  overflowX: "hidden",
};

const HERO_SECTION_STYLE = {
  position: "relative",
  minHeight: "88vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px 80px",
  textAlign: "center",
  overflow: "hidden",
};

const SPINNING_CIRCLE_STYLE = {
  position: "absolute",
  width: 440,
  height: 440,
  borderRadius: "50%",
  border: "1px dashed rgba(249,115,22,0.1)",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  pointerEvents: "none",
};

const SECTION_STYLE = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "64px 20px",
};

const SECTION_HEADER_STYLE = {
  textAlign: "center",
  marginBottom: 40,
};

const SUGGESTIONS_BOX_STYLE = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 20,
  padding: "28px 24px",
  position: "relative",
  overflow: "hidden",
  maxWidth: 560,
  margin: "0 auto",
};

const SUGGESTIONS_OVERLAY_STYLE = {
  position: "absolute",
  inset: 0,
  borderRadius: 24,
  background:
    "radial-gradient(ellipse at 50% 110%, rgba(99,102,241,0.06), transparent 65%)",
  pointerEvents: "none",
};

const FOOTER_STYLE = {
  borderTop: "1px solid rgba(255,255,255,0.05)",
  padding: "24px 20px",
  textAlign: "center",
};

const FOOTER_LOGO_CONTAINER_STYLE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginBottom: 8,
};

function FloatingBall({ style, size = 80, opacity = 0.06 }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #f97316, #7c2d12)",
        opacity,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

function PerfectForCard({ emoji, label, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 22px",
        borderRadius: 20,
        border: `1.5px solid ${hovered ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.06)"}`,
        background: hovered
          ? "rgba(249,115,22,0.06)"
          : "rgba(255,255,255,0.02)",
        transition: "all 0.18s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <p
        style={{
          marginTop: 12,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: hovered ? "#f97316" : "#e2e8f0",
          transition: "color 0.18s",
        }}
      >
        {label}
      </p>
      <p
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function DifferentCard({ icon, title, desc, accent = "#f97316" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 24px",
        borderRadius: 20,
        border: `1.5px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.06)"}`,
        background: hovered ? accent + "08" : "rgba(255,255,255,0.02)",
        transition: "all 0.18s ease",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <span style={{ fontSize: 32 }}>{icon}</span>
      <p
        style={{
          marginTop: 14,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 20,
          fontWeight: 900,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: hovered ? accent : "#e2e8f0",
          transition: "color 0.18s",
        }}
      >
        {title}
      </p>
      <p
        style={{
          marginTop: 6,
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>
      <p
        style={{
          marginTop: 10,
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: accent + "80",
        }}
      >
        No other app does this
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "20px 18px",
      }}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <p
        style={{
          marginTop: 10,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#e2e8f0",
        }}
      >
        {title}
      </p>
      <p
        style={{
          marginTop: 5,
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [emailHovered, setEmailHovered] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);
  const [activeGroupName, setActiveGroupName] = useState(
    () => localStorage.getItem("crictrack_active_group_name") || "",
  );

  useEffect(() => {
    const sync = () =>
      setActiveGroupName(
        localStorage.getItem("crictrack_active_group_name") || "",
      );
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    setProfileImgError(false);
  }, [user?.photoUrl]);

  const profileInitials =
    (user?.name || "U")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const perfectFor = [
    {
      emoji: "🏘️",
      label: "Gully Cricket",
      desc: "Street games with friends — no fixed rules, no problem.",
    },
    {
      emoji: "🏟️",
      label: "Turf Cricket",
      desc: "Weekend warrior groups who take it seriously but keep it fun.",
    },
    {
      emoji: "🎓",
      label: "College Cricket",
      desc: "Tournaments, rivalries, and career stats that actually matter.",
    },
  ];

  const different = [
    {
      icon: "🃏",
      title: "Joker Player",
      desc: "One player bats for one team and bowls for the other — in the same match. Stats tracked correctly for both sides.",
      accent: "#f97316",
    },
    {
      icon: "⚙️",
      title: "Mid-Match Flexibility",
      desc: "Change overs mid-game. Add a player who just arrived. Reshuffle teams at over break. No restarts needed.",
      accent: "#38bdf8",
    },
    {
      icon: "🪑",
      title: "Bench & Return",
      desc: "Retire a batter, bring them back later. Real turf cricket rules — not just official format rules.",
      accent: "#a78bfa",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Create your group & add players",
      desc: "Invite your squad with a 6-character code. Add player photos. Everyone's in under a minute.",
    },
    {
      num: "02",
      title: "Start a match, do the toss",
      desc: "Set teams, pick overs, flip the coin. Animated toss, bat or bowl choice — match starts live.",
    },
    {
      num: "03",
      title: "Score live — everyone watches",
      desc: "Every ball updates instantly on every device. Open the scoreboard link on any phone. No refresh, no lag.",
    },
  ];

  const features = [
    {
      icon: "📡",
      title: "Live Scoring",
      desc: "Ball-by-ball updates — runs, extras, wickets, strike rotation. All automatic.",
    },
    {
      icon: "📊",
      title: "The Dugout",
      desc: "Career batting and bowling stats per group. Flip card per player. Full history.",
    },
    {
      icon: "📜",
      title: "Match History",
      desc: "Every match ever played — full scorecard, fall of wickets, both innings.",
    },
    {
      icon: "🏆",
      title: "Match Summary",
      desc: "Man of the Match, top scorer, best economy, best strike rate. Auto-calculated.",
    },
    {
      icon: "🔄",
      title: "Over Break Controls",
      desc: "New bowler, change overs, add players, set joker — all from one drawer.",
    },
    {
      icon: "👥",
      title: "Group Management",
      desc: "Multiple groups, invite codes, admin roles. Each group has its own player pool and stats.",
    },
  ];

  return (
    <div style={MAIN_CONTAINER_STYLE}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Barlow+Condensed:wght@500;600;700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spinSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.15s; }
        .fade-up-3 { animation-delay: 0.25s; }
        .fade-up-4 { animation-delay: 0.35s; }
        .fade-up-5 { animation-delay: 0.45s; }
        .fade-up-6 { animation-delay: 0.55s; }
        .spin-slow { animation: spinSlow 18s linear infinite; }
        .divider { border: none; height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent); margin: 0; }
        * { box-sizing: border-box; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          background: scrolled ? "rgba(13,17,23,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 900, color: "#0d1117" }}>
                C
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              CricTrack
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    overflow: "hidden",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)";
                    e.currentTarget.style.color = "#f97316";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#cbd5e1";
                  }}
                >
                  {user?.photoUrl && !profileImgError ? (
                    <img
                      src={user.photoUrl}
                      alt={user?.name || "Profile"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={() => setProfileImgError(true)}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {profileInitials}
                    </span>
                  )}
                </button>
                {activeGroupName && (
                  <button
                    onClick={() => navigate("/groups")}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 99,
                      border: "1px solid rgba(249,115,22,0.35)",
                      background: "rgba(249,115,22,0.08)",
                      color: "#f97316",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      transition: "all 0.15s",
                      maxWidth: 140,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(249,115,22,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(249,115,22,0.08)";
                    }}
                    title={activeGroupName}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#f97316",
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    {activeGroupName}
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "7px 16px",
                    borderRadius: 99,
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#cbd5e1",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#cbd5e1";
                  }}
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={{
                    all: "unset",
                    cursor: "pointer",
                    padding: "7px 16px",
                    borderRadius: 99,
                    border: "1px solid rgba(249,115,22,0.5)",
                    background: "#f97316",
                    color: "#0d1117",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ea6c0a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f97316";
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={HERO_SECTION_STYLE}>
        <FloatingBall
          style={{ top: "8%", left: "6%", filter: "blur(8px)" }}
          size={120}
          opacity={0.08}
        />
        <FloatingBall
          style={{ top: "20%", right: "8%", filter: "blur(4px)" }}
          size={60}
          opacity={0.1}
        />
        <FloatingBall
          style={{ bottom: "15%", left: "15%", filter: "blur(12px)" }}
          size={200}
          opacity={0.05}
        />
        <FloatingBall
          style={{ bottom: "10%", right: "5%", filter: "blur(6px)" }}
          size={90}
          opacity={0.07}
        />
        <div aria-hidden className="spin-slow" style={SPINNING_CIRCLE_STYLE} />

        <div
          className="fade-up fade-up-1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 14px",
            borderRadius: 99,
            border: "1px solid rgba(249,115,22,0.3)",
            background: "rgba(249,115,22,0.08)",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 12 }}>🏏</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#f97316",
            }}
          >
            For Gully. For College. For Everyone.
          </span>
        </div>

        <h1
          className="fade-up fade-up-2"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(52px, 12vw, 100px)",
            fontWeight: 900,
            lineHeight: 0.95,
            textTransform: "uppercase",
            maxWidth: 780,
          }}
        >
          <span style={{ color: "#fff" }}>Cricket,</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f97316, #fb923c, #fdba74)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Way
          </span>
        </h1>

        <p
          className="fade-up fade-up-3"
          style={{
            marginTop: 20,
            fontSize: 16,
            color: "#64748b",
            maxWidth: 360,
            lineHeight: 1.6,
          }}
        >
          From gully to glory — track every ball.
          <br />
          <span style={{ color: "#475569" }}>
            Live scores. Player stats. Match history.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className="fade-up fade-up-4"
          style={{
            marginTop: 40,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "14px 32px",
              borderRadius: 14,
              background: "#f97316",
              color: "#0d1117",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ea6c0a";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f97316";
              e.currentTarget.style.transform = "none";
            }}
          >
            🏏 Start Playing
          </button>
          <button
            onClick={() => navigate("/login?demo=1")}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "14px 32px",
              borderRadius: 14,
              border: "1.5px solid rgba(249,115,22,0.4)",
              background: "rgba(249,115,22,0.08)",
              color: "#f97316",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            Try Demo
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="fade-up fade-up-5"
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: 0.25,
          }}
        >
          <div
            style={{
              width: 1,
              height: 32,
              background: "linear-gradient(to bottom, transparent, #f97316)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            scroll
          </span>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ PERFECT FOR ═══ */}
      <section style={SECTION_STYLE}>
        <div style={SECTION_HEADER_STYLE}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f97316",
              marginBottom: 10,
            }}
          >
            Perfect For
          </p>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            Your cricket. Your rules.
          </h2>
          <p
            style={{
              marginTop: 12,
              color: "#64748b",
              fontSize: 14,
              maxWidth: 400,
              margin: "12px auto 0",
            }}
          >
            Not just for official formats. Built for how cricket actually
            happens.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {perfectFor.map((c) => (
            <PerfectForCard key={c.label} {...c} />
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ WHAT MAKES CRICTRACK DIFFERENT ═══ */}
      <section style={SECTION_STYLE}>
        <div style={SECTION_HEADER_STYLE}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f97316",
              marginBottom: 10,
            }}
          >
            Only on CricTrack
          </p>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            Features no other app has
          </h2>
          <p
            style={{
              marginTop: 12,
              color: "#64748b",
              fontSize: 14,
              maxWidth: 440,
              margin: "12px auto 0",
            }}
          >
            Built specifically for the situations every local cricket player
            actually faces.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {different.map((c) => (
            <DifferentCard key={c.title} {...c} />
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ UP AND RUNNING IN 3 STEPS ═══ */}
      <section style={SECTION_STYLE}>
        <div style={{ ...SECTION_HEADER_STYLE, marginBottom: 48 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f97316",
              marginBottom: 10,
            }}
          >
            Dead Simple
          </p>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            Up and running in 3 steps
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.num}
              style={{
                padding: "28px 24px",
                borderLeft:
                  i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 64,
                  fontWeight: 900,
                  color: "rgba(249,115,22,0.12)",
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {s.num}
              </p>
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#e2e8f0",
                  marginBottom: 8,
                }}
              >
                {s.title}
              </p>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ WHAT'S INSIDE ═══ */}
      <section style={SECTION_STYLE}>
        <div style={SECTION_HEADER_STYLE}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f97316",
              marginBottom: 10,
            }}
          >
            What's Inside
          </p>
          <h2
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            Everything your match needs
          </h2>
          <p
            style={{
              marginTop: 12,
              color: "#64748b",
              fontSize: 14,
              maxWidth: 400,
              margin: "12px auto 0",
            }}
          >
            Built for the chaos of casual cricket — with the discipline of
            proper scoring.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ FINAL CTA ═══ */}
      <section
        style={{
          ...SECTION_STYLE,
          textAlign: "center",
          padding: "32px 20px 64px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(36px, 7vw, 64px)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1.05,
          }}
        >
          Your next match is
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f97316, #fdba74)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            one tap away.
          </span>
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "#475569",
            maxWidth: 320,
            margin: "12px auto 0",
          }}
        >
          Free forever. No installs. Works on any phone.
        </p>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "14px 32px",
              borderRadius: 14,
              background: "#f97316",
              color: "#0d1117",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ea6c0a";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f97316";
              e.currentTarget.style.transform = "none";
            }}
          >
            Start Playing →
          </button>
          <button
            onClick={() => navigate("/login?demo=1")}
            style={{
              all: "unset",
              cursor: "pointer",
              padding: "14px 32px",
              borderRadius: 14,
              border: "1.5px solid rgba(249,115,22,0.4)",
              background: "rgba(249,115,22,0.08)",
              color: "#f97316",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(249,115,22,0.08)";
              e.currentTarget.style.transform = "none";
            }}
          >
            🎮 Try Demo
          </button>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ SUGGESTIONS ═══ */}
      <section
        style={{ ...SECTION_STYLE, textAlign: "center", padding: "40px 20px" }}
      >
        <div style={SUGGESTIONS_BOX_STYLE}>
          <div style={SUGGESTIONS_OVERLAY_STYLE} />
          <span style={{ fontSize: 28 }}>💡</span>
          <h2
            style={{
              marginTop: 16,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(20px, 4vw, 28px)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.1,
              color: "#e2e8f0",
            }}
          >
            Got a suggestion?
          </h2>
          <p
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "#64748b",
              maxWidth: 340,
              margin: "12px auto 0",
              lineHeight: 1.8,
            }}
          >
            CricTrack is built for players like you. Have an idea, a feature
            request, or just want to say what works and what doesn't?{" "}
            <span style={{ color: "#94a3b8" }}>
              We'd love to hear from you.
            </span>
          </p>
          <a
            href="mailto:lawishbhatia5@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 12,
              border: "1px solid rgba(249,115,22,0.35)",
              background: emailHovered ? "#f97316" : "rgba(249,115,22,0.09)",
              color: emailHovered ? "#0d1117" : "#f97316",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={() => setEmailHovered(true)}
            onMouseLeave={() => setEmailHovered(false)}
          >
            ✉️ lawishbhatia5@gmail.com
          </a>
          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: "#2d3748",
              letterSpacing: "0.05em",
            }}
          >
            Every message gets read. No spam, ever.
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={FOOTER_STYLE}>
        <div style={FOOTER_LOGO_CONTAINER_STYLE}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 900, color: "#0d1117" }}>
              C
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#475569",
            }}
          >
            CricTrack
          </span>
        </div>
        <p style={{ fontSize: 11, color: "#334155" }}>
          From gully to glory — track every ball. 🏏
        </p>
      </footer>

      <BottomNav />
    </div>
  );
}
