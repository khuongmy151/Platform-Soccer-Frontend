import React, { useEffect } from "react";
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
  SCHEDULED: { bg: "#f3f4f6", color: "#6b7280", dot: null, label: "Scheduled" },
  LIVE: { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444", label: "Live Now" },
  FIRST_HALF: { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444", label: "First Half" },
  HALF_TIME: { bg: "#fef3c7", color: "#d97706", dot: null, label: "Half Time" },
  SECOND_HALF: { bg: "#fff7ed", color: "#ea580c", dot: "#ef4444", label: "Second Half" },
  FINISHED: { bg: "#22c55e", color: "#ffffff", dot: null, label: "Finished" },
  CANCELLED: { bg: "#fee2e2", color: "#ef4444", dot: null, label: "Cancelled" },
};

const Badge = ({ match }) => {
  // Logic xác định status dựa trên dữ liệu thật
  let status = match.status || "SCHEDULED";
  if (match.is_cancelled === 1) status = "CANCELLED";

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
      {style.label || status.replace("_", " ")}
    </span>
  );
};

/* ─────────────────────────────── TeamLogo ─────────────────────────────── */

const TeamLogo = ({ src, dim = 64 }) => (
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
      overflow: "hidden",
    }}
  >
    {src ? (
      <img
        src={src}
        alt="logo"
        style={{ width: "70%", height: "70%", objectFit: "contain" }}
      />
    ) : (
      <ShieldIcon size={26} color="#d1d5db" />
    )}
  </div>
);

/* ─────────────────────────────── MatchCard ─────────────────────────────── */

const MatchCard = ({ match, onStart, onCancel, onUpdate, onView }) => {
  // Sửa field dựa trên image: away_score, home_score, home_team_name, away_team_name, v.v.
  const {
    home_score,
    away_score,
    home_team_name,
    away_team_name,
    home_team_logo,
    away_team_logo,
    start_time,
    stadium,
    is_cancelled,
    status,
  } = match;

  /* ---- date / time ---- */
  let dateStr = "N/A";
  let timeStr = "N/A";
  if (start_time) {
    const d = new Date(start_time);
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

  const isLive = status === "FIRST_HALF" || status === "SECOND_HALF" || status === "LIVE";
  const isFinished = status === "FINISHED";
  const isCancelled = Number(is_cancelled) === 1;
  const isScheduled = !isLive && !isFinished && !isCancelled;

  // Chỉ hiện tỉ số khi trận đang đá hoặc đã kết thúc (không hiện cho trận chưa bắt đầu)
  const showScore = isFinished || isLive;
  const arena = stadium || "";

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <Badge match={match} />
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
          <TeamLogo src={home_team_logo} dim={isCancelled ? 52 : 64} />
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
            {home_team_name || "TEAM A"}
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
                {home_score ?? 0} - {away_score ?? 0}
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
                {isFinished ? "COMPLETED" : "LIVE"}
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
          <TeamLogo src={away_team_logo} dim={isCancelled ? 52 : 64} />
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
            {away_team_name || "TEAM B"}
          </span>
        </div>
      </div>

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
          <PinIcon /> {arena}
        </div>
      )}

      {/* Buttons - Keep your original logic */}
      {isScheduled && (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onStart(match.id)} style={btnPrimary}>
            START MATCH
          </button>
          <button onClick={() => onCancel(match.id)} style={btnSecondary}>
            CANCEL
          </button>
        </div>
      )}

      {isLive && (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onView(match.id)} style={btnLiveView}>
            VIEW MATCH DETAILS
          </button>
          <button onClick={() => onUpdate(match.id)} style={btnUpdate}>
            UPDATE
          </button>
        </div>
      )}

      {isFinished && (
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onView(match.id)} style={btnLiveView}>
            VIEW MATCH DETAILS
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────── Styles ─────────────────────────────── */
const btnPrimary = {
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
};
const btnSecondary = {
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
};
const btnLiveView = {
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
};
const btnUpdate = {
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
};
const btnDisabled = {
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
};

/* ───────────────── Normalize BE → FE data ───────────────── */
function normalizeMatch(raw) {
  if (raw.homeTeam) return raw; // Nếu đã có homeTeam thì không cần chuyển đổi

  // Debug: In ra dữ liệu thô từ BE để kiểm tra
  console.log("[normalizeMatch] raw data:", { id: raw.id, is_active: raw.is_active, is_cancelled: raw.is_cancelled, ended_at: raw.ended_at, home_score: raw.home_score });
  
  let status = "SCHEDULED";
  const now = new Date();
  const startTime = raw.start_time ? new Date(raw.start_time) : null;
  const matchAlreadyStarted = startTime ? startTime <= now : true;

  if (Number(raw.is_cancelled) === 1 || raw.is_cancelled === true) {
    status = "CANCELLED";
  } else if (raw.ended_at) {
    // Có ended_at → đã kết thúc chắc chắn
    status = "FINISHED";
  } else if ((Number(raw.is_active) === 1 || raw.is_active === true) && matchAlreadyStarted) {
    // is_active=1 VÀ đã qua giờ bắt đầu → đang thi đấu thật
    status = "LIVE";
  } else if (!raw.ended_at && Number(raw.is_active) === 0 && raw.home_score > 0) {
    // Có bàn thắng nhưng is_active=0 và chưa có ended_at → cũng FINISHED
    status = "FINISHED";
  }
  // Còn lại (kể cả is_active=1 mà chưa đến giờ) → giữ SCHEDULED

  return {
    ...raw,
    status,
    homeTeam: {
      id: raw.home_team_id,
      name: raw.home_team_name || "TEAM A",
      logoUrl: raw.home_team_logo,
    },
    awayTeam: {
      id: raw.away_team_id,
      name: raw.away_team_name || "TEAM B",
      logoUrl: raw.away_team_logo,
    },
    startTime: raw.start_time || raw.startTime,
    arena: raw.stadium || raw.arena || "",
  };
}

/* ─────────────────────────────── Page ─────────────────────────────── */

export default function MatchManagement() {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches?.items || []);

  useEffect(() => {
    matchService.getAllMatches({
      url: `/matches?tournament_id=${tournamentId}`,
      dispatch,
      func: setMatches,
    });
  }, [dispatch, tournamentId]);

  const handleStartMatch = async (matchId) => {
    try {
      await matchService.updateMatchStatus({
        url: `/matches/${matchId}/status`,
        data: { status: "LIVE" },
      });
      // Tự động reload lại danh sách sau khi start
      matchService.getAllMatches({
        url: `/matches?tournament_id=${tournamentId}`,
        dispatch,
        func: setMatches,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelMatch = () => {
    alert("Chức năng hủy trận cần API hỗ trợ field CANCELLED.");
  };

  // Hiển thị matches từ API, nếu trống thì không hiển thị gì (đã loại bỏ mockup)
  const displayMatches = [...matches].reverse().map(normalizeMatch);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100%",
        padding: "0 0 32px",
      }}
    >
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
        {/* SỬA TẠI ĐÂY: Thêm width: "fit-content" và bỏ flex */}
        <button
          onClick={() => navigate(`/match/${tournamentId}/create`)}
          style={{
            ...btnPrimary,
            flex: "none", // Không cho nó co giãn
            width: "fit-content", // Ôm sát nội dung chữ
            padding: "13px 25px", // Padding ngang cho đẹp
          }}
        >
          CREATE MATCH
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 24,
        }}
      >
        {displayMatches.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "#6b7280", background: "#f9fafb", borderRadius: 24, border: "2px dashed #e5e7eb" }}>
            <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Chưa có trận đấu nào!</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Vui lòng bấm nút CREATE MATCH để tạo trận đấu đầu tiên cho giải này.</p>
          </div>
        ) : (
          displayMatches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onStart={handleStartMatch}
              onCancel={handleCancelMatch}
              onUpdate={(id) => navigate(`/match/${id}/update`)}
              onView={(id) => navigate(`/match/${id}`)}
            />
          ))
        )}
      </div>

      {displayMatches.length > 6 && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 36 }}
        >
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
              color: "#374151",
            }}
          >
            Load More Matches <ChevronDown />
          </button>
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
