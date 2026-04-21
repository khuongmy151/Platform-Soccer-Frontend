import React from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ─────────────────────────────── Components ─────────────────────────────── */

const StatBlock = ({ label, value, color = "#1f2937" }) => (
  <div style={{
    background: "#ffffff",
    borderRadius: 20,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    borderBottom: label === "SHOTS ON GOAL" ? "3px solid #c8102e" : "none"
  }}>
    <span style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{label}</span>
    <span style={{ fontSize: 32, fontWeight: 900, color: color }}>{value}</span>
  </div>
);

const CardStatRow = ({ team1Val, team2Val, icon, label, iconBg }) => (
  <div style={{
    background: "#ffffff",
    borderRadius: 24,
    padding: "24px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    gap: 20
  }}>
    <div style={{ textAlign: "center" }}>
      <span style={{ fontSize: 24, fontWeight: 900, color: "#1f2937" }}>{team1Val}</span>
      <p style={{ fontSize: 9, fontWeight: 700, color: "#d1d5db", margin: 0, marginTop: 4 }}>TEAM 1</p>
    </div>
    
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ width: 32, height: 44, borderRadius: 4, background: iconBg, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
      <span style={{ fontSize: 9, fontWeight: 900, color: "#1f2937", letterSpacing: "0.05em" }}>{label}</span>
    </div>

    <div style={{ textAlign: "center" }}>
      <span style={{ fontSize: 24, fontWeight: 900, color: "#1f2937" }}>{team2Val}</span>
      <p style={{ fontSize: 9, fontWeight: 700, color: "#d1d5db", margin: 0, marginTop: 4 }}>TEAM 2</p>
    </div>
  </div>
);

/* ─────────────────────────────── Main Page ─────────────────────────────── */

export default function MatchList() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  // Mock data theo hình
  const matchData = {
    homeTeam: "RED DRAGONS",
    awayTeam: "SKY EAGLES",
    scoreHome: 2,
    scoreAway: 1,
    date: "AUG 24, 2024",
    time: "20:45 CET",
    arena: "METROPOLIS ARENA",
    yellowHome: 3,
    yellowAway: 2,
    redHome: 0,
    redAway: 1,
    totalShots: 18,
    shotsOnGoal: 7,
    passAccuracy: "82%"
  };

  return (
    <div style={{ paddingBottom: 60, fontFamily: "var(--font-body, 'Inter', sans-serif)" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, color: "#1f2937", marginBottom: 32, letterSpacing: "-0.02em" }}>MATCH</h1>

      {/* ── Main Score Card ── */}
      <div style={{
        background: "#ffffff",
        borderRadius: 32,
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
        marginBottom: 40
      }}>
        <div style={{
          height: 240,
          background: "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000') center/cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          position: "relative"
        }}>
          {/* Home */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
             <div style={{ width: 100, height: 100, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", border: "8px solid rgba(255,255,255,0.3)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: "#c8102e", width: "100%", textAlign: "center" }}>A</span>
             </div>
             <span style={{ color: "#1f2937", fontWeight: 900, fontSize: 13, letterSpacing: "0.05em" }}>{matchData.homeTeam}</span>
          </div>

          {/* Score & Status */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
             <span style={{ background: "#ff4d4d", color: "#fff", padding: "4px 16px", borderRadius: 99, fontSize: 10, fontWeight: 900, letterSpacing: "0.1em" }}>FINISHED</span>
             <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ fontSize: 72, fontWeight: 900, color: "#c8102e" }}>{matchData.scoreHome}</span>
                <span style={{ fontSize: 40, fontWeight: 900, color: "#d1d5db" }}>-</span>
                <span style={{ fontSize: 72, fontWeight: 900, color: "#1f2937" }}>{matchData.scoreAway}</span>
             </div>
          </div>

          {/* Away */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
             <div style={{ width: 100, height: 100, background: "#000", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", overflow: "hidden", border: "8px solid rgba(255,255,255,0.3)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
                <img src="https://api.dicebear.com/7.x/identicon/svg?seed=SkyEagles&backgroundColor=000000" alt="logo" style={{ width: "60%", margin: "0 auto" }} />
             </div>
             <span style={{ color: "#1f2937", fontWeight: 900, fontSize: 13, letterSpacing: "0.05em" }}>{matchData.awayTeam}</span>
          </div>
        </div>

        {/* Bottom Info Row */}
        <div style={{
          background: "#f9fafb",
          padding: "16px 40px",
          display: "flex",
          justifyContent: "center",
          gap: 40,
          borderTop: "1px solid #f3f4f6"
        }}>
           <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#4b5563" }}>
              📅 <span style={{ textTransform: "uppercase" }}>{matchData.date}</span>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#4b5563" }}>
              ⏳ <span style={{ textTransform: "uppercase" }}>{matchData.time}</span>
           </div>
           <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: "#4b5563" }}>
              📍 <span style={{ textTransform: "uppercase" }}>{matchData.arena}</span>
           </div>
        </div>
      </div>

      {/* ── Cards Section ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
           <div style={{ width: 4, height: 24, background: "#c8102e", borderRadius: 4 }} />
           <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1f2937", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Thẻ</h2>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
           <CardStatRow label="YELLOW" iconBg="#ffff00" team1Val={matchData.yellowHome} team2Val={matchData.yellowAway} />
           <CardStatRow label="RED" iconBg="#ff0000" team1Val={matchData.redHome} team2Val={matchData.redAway} />
        </div>
      </div>

      {/* ── Overview Section ── */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
           <div style={{ width: 4, height: 24, background: "#c8102e", borderRadius: 4 }} />
           <h2 style={{ fontSize: 18, fontWeight: 900, color: "#1f2937", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tổng quát</h2>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
           <StatBlock label="TOTAL SHOTS" value={matchData.totalShots} />
           <StatBlock label="SHOTS ON GOAL" value={matchData.shotsOnGoal} color="#c8102e" />
           <StatBlock label="PASS ACCURACY" value={matchData.passAccuracy} />
        </div>
      </div>

      {/* ── Back Button ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
         <button 
           onClick={() => navigate(-1)}
           style={{
             padding: "16px 60px",
             background: "#d1d5db",
             color: "#1f2937",
             border: "none",
             borderRadius: 12,
             fontSize: 14,
             fontWeight: 900,
             letterSpacing: "0.1em",
             cursor: "pointer",
             transition: "background 0.2s"
           }}
           onMouseEnter={(e) => e.currentTarget.style.background = "#9ca3af"}
           onMouseLeave={(e) => e.currentTarget.style.background = "#d1d5db"}
         >
           BACK
         </button>
      </div>
    </div>
  );
}
