import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import matchService from "../services/matchService";

/* ─────────────────────────────── Components ─────────────────────────────── */

const StatBlock = ({ label, value, color = "#1f2937" }) => (
  <div
    style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      borderBottom: label === "TOTAL GOALS" ? "3px solid #c8102e" : "none",
    }}
  >
    <span
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#9ca3af",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 32, fontWeight: 900, color: color }}>{value}</span>
  </div>
);

const TeamAvatar = ({ name, logoUrl, bgColor = "#1a1a2e" }) => {
  const letter = (name || "?").charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "8px solid rgba(255,255,255,0.3)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        overflow: "hidden",
        background: logoUrl ? "#fff" : bgColor,
      }}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          style={{ width: "70%", height: "70%", objectFit: "contain" }}
        />
      ) : (
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: logoUrl ? "#c8102e" : "#fff",
            width: "100%",
            textAlign: "center",
          }}
        >
          {letter}
        </span>
      )}
    </div>
  );
};

/* ─────────────────────────────── Main Page ─────────────────────────────── */

export default function MatchDetail() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!matchId) return;
      try {
        const response = await matchService.getMatchDetail({
          url: `/matches/${matchId}`,
        });

        // BE trả về response.data hoặc response trực tiếp (tuỳ interceptor)
        const data = response?.data || response;
        console.log("MatchDetail API response:", data);

        // Normalize dữ liệu từ BE (hỗ trợ cả camelCase lẫn snake_case)
        const startTime = data.startTime || data.start_time;
        const d = startTime ? new Date(startTime) : null;

        setMatchData({
          homeTeam: data.homeTeam?.name || data.home_team_name || "HOME",
          awayTeam: data.awayTeam?.name || data.away_team_name || "AWAY",
          homeLogoUrl: data.homeTeam?.logoUrl || data.home_team_logo || null,
          awayLogoUrl: data.awayTeam?.logoUrl || data.away_team_logo || null,
          scoreHome: data.score?.home ?? data.home_score ?? 0,
          scoreAway: data.score?.away ?? data.away_score ?? 0,
          date: d
            ? d
                .toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
                .toUpperCase()
            : "N/A",
          time: d
            ? d.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A",
          arena: data.stadium || data.arena || "N/A",
          status: data.status || "SCHEDULED",
          tournamentName:
            data.tournament?.name || data.tournament_name || "",
        });
      } catch (err) {
        console.error("Error fetching match detail:", err);
        setError(
          err.response?.data?.message || err.message || "Lỗi không xác định"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [matchId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <p style={{ color: "#9ca3af", fontWeight: 600 }}>
          Đang tải dữ liệu trận đấu...
        </p>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 16,
        }}
      >
        <p style={{ color: "#ef4444", fontWeight: 700, fontSize: 16 }}>
          ⚠️ {error || "Không tải được dữ liệu trận đấu"}
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "12px 40px",
            background: "#d1d5db",
            color: "#1f2937",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          BACK
        </button>
      </div>
    );
  }

  // Xác định trạng thái badge
  const isLive = matchData.status === "LIVE" || matchData.status === "FIRST_HALF" || matchData.status === "SECOND_HALF";
  const isFinished = matchData.status === "FINISHED" || matchData.status === "COMPLETED";
  const statusLabel = isLive ? "LIVE" : isFinished ? "FINISHED" : "SCHEDULED";
  const statusColor = isLive ? "#f97316" : isFinished ? "#ff4d4d" : "#6b7280";

  const totalGoals = (matchData.scoreHome || 0) + (matchData.scoreAway || 0);

  return (
    <div
      style={{
        paddingBottom: 60,
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
      }}
    >
      <h1
        style={{
          fontSize: 40,
          fontWeight: 900,
          color: "#1f2937",
          marginBottom: 32,
          letterSpacing: "-0.02em",
        }}
      >
        MATCH
      </h1>

      {/* ── Main Score Card ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            height: 240,
            background:
              "linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000') center/cover",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 80px",
            position: "relative",
          }}
        >
          {/* Home */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <TeamAvatar
              name={matchData.homeTeam}
              logoUrl={matchData.homeLogoUrl}
              bgColor="#c8102e"
            />
            <span
              style={{
                color: "#1f2937",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: "0.05em",
              }}
            >
              {matchData.homeTeam}
            </span>
          </div>

          {/* Score & Status */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                background: statusColor,
                color: "#fff",
                padding: "4px 16px",
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              {statusLabel}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: "#c8102e" }}>
                {matchData.scoreHome}
              </span>
              <span style={{ fontSize: 40, fontWeight: 900, color: "#d1d5db" }}>
                -
              </span>
              <span style={{ fontSize: 72, fontWeight: 900, color: "#1f2937" }}>
                {matchData.scoreAway}
              </span>
            </div>
          </div>

          {/* Away */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <TeamAvatar
              name={matchData.awayTeam}
              logoUrl={matchData.awayLogoUrl}
              bgColor="#1a1a2e"
            />
            <span
              style={{
                color: "#1f2937",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: "0.05em",
              }}
            >
              {matchData.awayTeam}
            </span>
          </div>
        </div>

        {/* Bottom Info Row */}
        <div
          style={{
            background: "#f9fafb",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "center",
            gap: 40,
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#4b5563",
            }}
          >
            📅{" "}
            <span style={{ textTransform: "uppercase" }}>
              {matchData.date}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#4b5563",
            }}
          >
            ⏳{" "}
            <span style={{ textTransform: "uppercase" }}>
              {matchData.time}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              color: "#4b5563",
            }}
          >
            📍{" "}
            <span style={{ textTransform: "uppercase" }}>
              {matchData.arena}
            </span>
          </div>
          {matchData.tournamentName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 11,
                fontWeight: 700,
                color: "#4b5563",
              }}
            >
              🏆{" "}
              <span style={{ textTransform: "uppercase" }}>
                {matchData.tournamentName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Overview Section ── */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 4,
              height: 24,
              background: "#c8102e",
              borderRadius: 4,
            }}
          />
          <h2
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: "#1f2937",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Tổng quát
          </h2>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <StatBlock
            label="TOTAL GOALS"
            value={totalGoals}
            color="#c8102e"
          />
          <StatBlock
            label={matchData.homeTeam}
            value={matchData.scoreHome}
          />
          <StatBlock
            label={matchData.awayTeam}
            value={matchData.scoreAway}
          />
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
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#9ca3af")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#d1d5db")}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
