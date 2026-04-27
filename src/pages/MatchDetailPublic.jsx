import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK = {
  league: "Neon Strike Premier League 2024",
  leagueLogo: "https://api.dicebear.com/7.x/identicon/svg?seed=NeonLeague&backgroundColor=c8102e",
  status: "FT (KẾT THÚC)",
  home: {
    name: "LEVANTE",
    score: 1,
    formation: "4-4-2",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Levante&backgroundColor=1a73e8",
    players: [
      { name: "Aitor Fernández", pos: "GK" },
      { name: "Roger Marti", pos: "FW" },
      { name: "Dani Gómez", pos: "FW" },
      { name: "Carlos Clerc", pos: "DF" },
      { name: "Rubén Vezo", pos: "DF" },
    ],
  },
  away: {
    name: "GETAFE",
    score: 0,
    formation: "4-2-3-1",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=Getafe&backgroundColor=1565c0",
    players: [
      { name: "David Soria", pos: "GK" },
      { name: "Cucho Hernández", pos: "FW" },
      { name: "Mauro Arambarri", pos: "MF" },
      { name: "Djené Dakonam", pos: "DF" },
      { name: "Stefan Mitrovic", pos: "DF" },
    ],
  },
  events: [
    { minute: 10, type: "goal",   team: "home", player: "Roger Marti",      detail: "BÀN THẮNG (KIẾN TẠO: MELERO)" },
    { minute: 55, type: "yellow", team: "away", player: "Mauro Arambarri",  detail: "THẺ VÀNG" },
    { minute: 61, type: "sub",    team: "home", player: "Dani Gómez",       detail: "VÀO SÂN (RP: SERGIO LEON)" },
  ],
  stats: [
    { label: "KIỂM SOÁT BÓNG", home: 52, away: 48, homeLabel: "52%", awayLabel: "48%" },
    { label: "DỨT ĐIỂM",       home: 14, away: 9,  homeLabel: "14",  awayLabel: "9"  },
    { label: "TRÚNG ĐÍCH",      home: 5,  away: 2,  homeLabel: "5",   awayLabel: "2"  },
    { label: "PHẠT GÓC",        home: 6,  away: 4,  homeLabel: "6",   awayLabel: "4"  },
  ],
};

// ─── Position badge color ─────────────────────────────────────────────────────
const POS_COLOR = { GK: "#f59e0b", DF: "#3b82f6", MF: "#10b981", FW: "#ef4444" };

// ─── Event icon by type ───────────────────────────────────────────────────────
const EVENT_ICON = { goal: "⚽", yellow: "🟨", red: "🟥", sub: "🔄" };

// ─── Sub-components ───────────────────────────────────────────────────────────
function Hero({ home, away, status }) {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 0,
      height: 220,
      background: "linear-gradient(160deg, #1a0000 0%, #8b0000 40%, #c8102e 100%)",
    }}>
      {/* Stadium overlay */}
      <img
        src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=60"
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, mixBlendMode: "overlay" }}
      />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 32px" }}>
        {/* Status badge */}
        <span style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", padding: "4px 14px", borderRadius: 99 }}>
          FT (KẾT THÚC)
        </span>

        {/* Teams + Score row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 480 }}>
          {/* Home */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={home.logo} alt={home.name} style={{ width: "80%", height: "80%" }} />
            </div>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "0.08em" }}>{home.name}</span>
          </div>

          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{home.score}</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>-</span>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{away.score}</span>
          </div>

          {/* Away */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={away.logo} alt={away.name} style={{ width: "80%", height: "80%" }} />
            </div>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "0.08em" }}>{away.name}</span>
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c8102e" }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        </div>
      </div>
    </div>
  );
}

function Tabs({ active, onChange }) {
  const tabs = ["DIỄN BIẾN", "ĐỘI HÌNH", "CHỈ SỐ"];
  return (
    <div style={{ display: "flex", gap: 4, padding: "12px 20px", background: "#fff", justifyContent: "center", borderBottom: "1px solid #f3f4f6" }}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: "8px 22px",
            borderRadius: 99,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.08em",
            transition: "all 0.2s",
            background: active === t ? "#c8102e" : "transparent",
            color: active === t ? "#fff" : "#9ca3af",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── Tab 1: Diễn Biến ─────────────────────────────────────────────────────────
function DienBien({ events }) {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 4, height: 24, background: "#c8102e", borderRadius: 4 }} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#1f2937", letterSpacing: "0.05em" }}>DIỄN BIẾN</h2>
      </div>

      <div style={{ position: "relative" }}>
        {/* Vertical center line */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#f3f4f6", transform: "translateX(-50%)", zIndex: 0 }} />

        {events.map((ev, i) => {
          const isHome = ev.team === "home";
          const circleColor = ev.type === "yellow" ? "#6b7280" : "#c8102e";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, position: "relative", zIndex: 1 }}>
              {/* Home side (left) */}
              <div style={{ flex: 1, textAlign: "right", paddingRight: 20 }}>
                {isHome && (
                  <>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#c8102e" }}>{ev.player}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{ev.detail}</p>
                  </>
                )}
              </div>

              {/* Minute circle */}
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: circleColor,
                color: "#fff",
                fontSize: 10, fontWeight: 900,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 4px 12px ${circleColor}55`,
                zIndex: 2,
              }}>
                {ev.minute}'
              </div>

              {/* Away side (right) */}
              <div style={{ flex: 1, textAlign: "left", paddingLeft: 20 }}>
                {!isHome && (
                  <>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: "#1f2937" }}>{ev.player}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>{ev.detail}</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab 2: Đội Hình ──────────────────────────────────────────────────────────
function DoiHinh({ home, away }) {
  const PlayerRow = ({ player, seed, reverse }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: reverse ? "row-reverse" : "row", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #f3f4f6" }}>
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={player.name} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#1f2937" }}>{player.name}</p>
        <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: POS_COLOR[player.pos] || "#6b7280", padding: "1px 6px", borderRadius: 3 }}>{player.pos}</span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 24, background: "#c8102e", borderRadius: 4 }} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#1f2937", letterSpacing: "0.05em" }}>ĐỘI HÌNH</h2>
      </div>

      {/* Team headers */}
      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#c8102e", letterSpacing: "0.05em" }}>🔴 {home.name} ({home.formation})</span>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: "0.05em" }}>{away.name} ({away.formation}) ⚫</span>
        </div>
      </div>

      {/* Players side by side */}
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {home.players.map((p, i) => <PlayerRow key={i} player={p} seed={p.name} reverse={false} />)}
        </div>
        <div style={{ flex: 1 }}>
          {away.players.map((p, i) => <PlayerRow key={i} player={p} seed={p.name} reverse={true} />)}
        </div>
      </div>
    </div>
  );
}

// ── Tab 3: Chỉ Số ────────────────────────────────────────────────────────────
function ChiSo({ stats }) {
  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 4, height: 24, background: "#c8102e", borderRadius: 4 }} />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: "#1f2937", letterSpacing: "0.05em" }}>CHỈ SỐ TRẬN ĐẤU</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {stats.map((s, i) => {
          const total = s.home + s.away;
          const homePercent = Math.round((s.home / total) * 100);
          return (
            <div key={i}>
              {/* Values + Label */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#1f2937" }}>{s.homeLabel}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.1em" }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#1f2937" }}>{s.awayLabel}</span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${homePercent}%`,
                  background: "linear-gradient(90deg, #c8102e, #ff4d4d)",
                  borderRadius: 99,
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MatchDetailPublic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("DIỄN BIẾN");
  const { home, away, events, stats } = MOCK;

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "'Inter', 'Roboto', sans-serif", paddingBottom: 40 }}>
      {/* Back + League header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#374151", padding: "6px 0" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          BACK
        </button>
      </div>

      {/* League name bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={MOCK.leagueLogo} alt="league" style={{ width: "100%", height: "100%" }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>{MOCK.league}</span>
      </div>

      {/* Main card */}
      <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
        <Hero home={home} away={away} status={MOCK.status} />
        <Tabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "DIỄN BIẾN" && <DienBien events={events} />}
        {activeTab === "ĐỘI HÌNH"  && <DoiHinh home={home} away={away} />}
        {activeTab === "CHỈ SỐ"    && <ChiSo stats={stats} />}
      </div>
    </div>
  );
}
