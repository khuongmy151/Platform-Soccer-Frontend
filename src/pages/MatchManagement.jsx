import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import matchService from "../services/matchService";
import { setMatches } from "../stores/features/matchSlice";

/* ─────────────────────────────── helpers ─────────────────────────────── */

const ShieldIcon = ({ size = 32, color = "#d1d5db" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PinIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─────────────────────────────── Badge ─────────────────────────────── */

const STATUS_STYLES = {
  // ── Database ENUM matches ──
  SCHEDULED: { bg: "#f3f4f6", color: "#6b7280", dot: null },
  FIRST_HALF: { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444" },
  HALF_TIME: { bg: "#fef3c7", color: "#d97706", dot: null },
  SECOND_HALF: { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444" },
  FINISHED: { bg: "#22c55e", color: "#ffffff", dot: null },
  // ── Fallback for old mock data ──
  "LIVE NOW": { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444" },
  CANCELLED: { bg: "#f97316", color: "#ffffff", dot: null },
};

const Badge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES["SCHEDULED"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: style.bg,
        color: style.color,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {style.dot && (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: style.dot,
            animation: "pulse 1.5s infinite",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      )}
      {status}
    </span>
  );
};

/* ─────────────────────────────── TeamLogo ─────────────────────────────── */

const TeamLogo = ({ dim = 64 }) => (
  <div
    style={{
      width: dim,
      height: dim,
      borderRadius: 16,
      background: "#f9fafb",
      border: "2px solid #f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <ShieldIcon size={26} color="#d1d5db" />
  </div>
);

/* ─────────────────────────────── MatchCard ─────────────────────────────── */

const MatchCard = ({ match, onStart, onCancel, onUpdate, onView }) => {
  const { status } = match;

  /* ---- date / time ---- */
  let dateStr = match.date || "OCT 24, 2024";
  let timeStr = match.time || "19:30 GMT";
  if (match.startTime) {
    const d = new Date(match.startTime);
    if (!isNaN(d)) {
      dateStr = d
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase();
      timeStr = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
  }

  // Supports both camelCase and snake_case from backend
  const homeScore =
    match.score != null
      ? match.score.home
      : match.home_score !== undefined
      ? match.home_score
      : match.homeTeam?.score;
  const awayScore =
    match.score != null
      ? match.score.away
      : match.away_score !== undefined
      ? match.away_score
      : match.awayTeam?.score;

  const isCancelled = status === "CANCELLED";
  // Live matches according to DB ENUM
  const isLive =
    status === "FIRST_HALF" ||
    status === "HALF_TIME" ||
    status === "SECOND_HALF" ||
    status === "LIVE NOW";
  const isFinished = status === "FINISHED";
  const isScheduled = !isLive && !isFinished && !isCancelled;

  const showScore = isFinished || isLive || homeScore !== undefined;

  const arena = match.venue?.name || match.arena || "";

  /* ── score label ── */
  let scoreLabel = "SCORE";
  if (isFinished) scoreLabel = "COMPLETED";
  else if (isLive) scoreLabel = "LIVE";

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 24,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Header row ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <Badge status={status} />
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: isLive ? "#f97316" : "#9ca3af",
              margin: 0,
              marginBottom: 2,
              textTransform: "uppercase",
            }}
          >
            {dateStr}
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: isCancelled ? "#ef4444" : "#1f2937",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {timeStr}
          </p>
        </div>
      </div>

      {/* ── Teams row ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {/* Home team */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          <TeamLogo dim={isCancelled ? 52 : 64} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: isCancelled ? "#9ca3af" : "#1f2937",
              textAlign: "center",
            }}
          >
            {match.homeTeam?.name || "TEAM A"}
          </span>
        </div>

        {/* Middle: score or VS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            flex: "0 0 auto",
            minWidth: 80,
          }}
        >
          {showScore ? (
            <>
              <span
                style={{
                  fontSize: isLive ? 38 : 32,
                  fontWeight: 900,
                  color: "#1f2937",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                }}
              >
                {homeScore ?? 0} - {awayScore ?? 0}
              </span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isFinished ? "#16a34a" : "#f97316",
                  marginTop: 4,
                }}
              >
                {scoreLabel}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#d1d5db",
                letterSpacing: "0.1em",
              }}
            >
              VS
            </span>
          )}
        </div>

        {/* Away team */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            flex: 1,
          }}
        >
          <TeamLogo dim={isCancelled ? 52 : 64} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: isCancelled ? "#9ca3af" : "#1f2937",
              textAlign: "center",
            }}
          >
            {match.awayTeam?.name || "TEAM B"}
          </span>
        </div>
      </div>

      {/* ── Venue ── */}
      {arena && !isCancelled && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#9ca3af",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 16,
          }}
        >
          <PinIcon />
          {arena}
        </div>
      )}

      {/* ── Cancellation reason ── */}
      {isCancelled && match.reason && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 0,
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ea580c",
              margin: "0 0 6px",
            }}
          >
            Reason for cancellation
          </p>
          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {match.reason}
          </p>
        </div>
      )}

      {/* ── Action buttons ── */}
      {isScheduled && (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => onStart(match.id)}
            style={{
              flex: 2,
              padding: "13px 0",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#fff",
              background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
              boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.88)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            START MATCH
          </button>
          <button
            onClick={() => onCancel(match.id)}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              border: "2px solid #ef4444",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ef4444",
              background: "transparent",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            CANCEL
          </button>
        </div>
      )}

      {isLive && (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => onView(match.id)}
            style={{
              flex: 1,
              padding: "13px 0",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              background: "#b91c1c",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.88)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            VIEW MATCH DETAILS
          </button>
          <button
            onClick={() => onUpdate(match.id)}
            style={{
              flex: "0 0 auto",
              padding: "13px 20px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fff",
              background: "#1f2937",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.82)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
          >
            UPDATE
          </button>
        </div>
      )}

      {isFinished && (
        <div style={{ display: "flex", gap: 12 }}>
          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              cursor: "not-allowed",
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6b7280",
              background: "#f9fafb",
              opacity: 0.8,
            }}
          >
            MATCH STATS
          </button>
          <button
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              cursor: "not-allowed",
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6b7280",
              background: "#f9fafb",
              opacity: 0.8,
            }}
          >
            HIGHLIGHTS
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function MatchManagement() {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches?.items || []);

  const [mockMatches, setMockMatches] = useState([
    {
      id: "mock1",
      status: "SCHEDULED",
      date: "OCT 24, 2024",
      time: "19:30 GMT",
      homeTeam: { name: "TEAM ALPHA" },
      awayTeam: { name: "TEAM BRAVO" },
      arena: "WEMBLEY STADIUM, LONDON",
    },
    {
      id: "mock2",
      status: "FIRST_HALF",
      date: "72' MINS",
      time: "Match Live",
      homeTeam: { name: "TEAM CRIMSON", score: 3 },
      awayTeam: { name: "TEAM DELTA", score: 2 },
      arena: "SANTIAGO BERNABÉU",
    },
    {
      id: "mock3",
      status: "FINISHED",
      date: "OCT 22, 2024",
      time: "FT Score",
      homeTeam: { name: "TEAM ECHO", score: 2 },
      awayTeam: { name: "TEAM FOXTROT", score: 1 },
      arena: "OLD TRAFFORD, MANCHESTER",
    },
    {
      id: "mock4",
      status: "CANCELLED",
      date: "OCT 26, 2024",
      time: "N/A",
      homeTeam: { name: "TEAM GOLF" },
      awayTeam: { name: "TEAM HOTEL" },
      arena: "",
      reason:
        "Unfavorable weather conditions and pitch flooding. Re-scheduling pending.",
    },
  ]);

  useEffect(() => {
    matchService.getAllMatches({
      url: "/matches",
      dispatch,
      func: setMatches,
    });
  }, [dispatch]);

  const handleStartMatch = async (matchId) => {
    if (String(matchId).startsWith("mock")) {
      setMockMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: "LIVE NOW" } : m))
      );
      return;
    }
    try {
      // Send "FIRST_HALF" – compatible with DB ENUM (SCHEDULED|FIRST_HALF|HALF_TIME|SECOND_HALF|FINISHED)
      await matchService.updateMatchStatus({
        url: `/matches/${matchId}/status`,
        data: { status: "FIRST_HALF" },
      });
      matchService.getAllMatches({
        url: "/matches",
        dispatch,
        func: setMatches,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelMatch = async (matchId) => {
    if (String(matchId).startsWith("mock")) {
      setMockMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? {
                ...m,
                status: "CANCELLED",
                reason:
                  "Match schedule cancelled due to unforeseen circumstances.",
              }
            : m
        )
      );
      return;
    }
    // "CANCELLED" not present in DB ENUM → only update local UI, do not call API
    alert(
      "Match cancellation is not yet supported by the server (CANCELLED is not in DB ENUM)."
    );
  };

  const displayMatches =
    matches.length > 0 ? [...matches].reverse() : mockMatches;

  return (
    <div
      style={{
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
        minHeight: "100%",
        padding: "0 0 32px",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            color: "#1f2937",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Match List
        </h1>

        <button
          onClick={() => navigate(`/match/${tournamentId}/create`)}
          style={{
            padding: "12px 22px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#fff",
            background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
            boxShadow: "0 6px 20px rgba(239,68,68,0.35)",
            transition: "opacity 0.15s, transform 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = 0.9;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          CREATE MATCH
        </button>
      </div>

      {/* ── Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
        }}
      >
        {displayMatches.map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            onStart={handleStartMatch}
            onCancel={handleCancelMatch}
            onUpdate={(id) => navigate(`/match/${id}/update`)}
            onView={(id) => navigate(`/match/${id}`)}
          />
        ))}
      </div>

      {/* ── Load more ── */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            border: "1.5px solid #e5e7eb",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#374151",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)";
            e.currentTarget.style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          Load More Matches
          <ChevronDown />
        </button>
      </div>

      {/* pulse keyframe */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
