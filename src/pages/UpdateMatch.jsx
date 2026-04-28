import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchService from "../services/matchService";

/* ─── SHARED UI COMPONENTS (Match) ────────────────────────────── */
function TeamLogo({ letter, bgColor = "#1a1a2e", size = 80, logoUrl }) {
  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      />
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="logo"
          className="absolute inset-1.5 rounded-full object-cover"
          style={{ width: size - 12, height: size - 12 }}
        />
      ) : (
        <div
          className="absolute inset-1.5 rounded-full flex items-center justify-center"
          style={{ background: bgColor }}
        >
          <span
            className="text-white font-black text-2xl"
            style={{ fontSize: size * 0.3 }}
          >
            {letter}
          </span>
        </div>
      )}
    </div>
  );
}

function Stepper({ value, onChange }) {
  return (
    <div
      className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
    >
      <span className="text-5xl font-black text-gray-900 min-w-[2ch] text-center leading-none">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg transition-colors active:scale-95"
        style={{ lineHeight: 1 }}
      >
        +
      </button>
    </div>
  );
}

function TeamCard({ team, score, onScore }) {
  return (
    <div
      className="flex-1 rounded-3xl overflow-hidden"
      style={{
        background:
          "linear-gradient(170deg, #fde8e8 0%, #fdf0f0 45%, #f7f7fc 100%)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: 0,
      }}
    >
      <div className="px-6 pt-6 pb-6 flex flex-col items-center gap-3">
        <TeamLogo letter={team.letter} bgColor={team.color} size={72} logoUrl={team.logoUrl} />
        <h2 className="font-black text-xl tracking-wider text-gray-900 text-center">
          {team.name}
        </h2>
        <Stepper value={score} onChange={onScore} />
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">
          Match Score
        </p>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="flex-1 rounded-2xl flex flex-col items-center justify-center py-3 px-4 bg-surface-card shadow-inner">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
  );
}

/* ─── THE MATCH COMPONENT ───────────────────────────────────────── */
export default function MatchPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [finished, setFinished] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Score
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  // Dữ liệu đội bóng thật từ API
  const [homeTeam, setHomeTeam] = useState({ name: "HOME", letter: "A", color: "var(--color-surface-nav)", logoUrl: null });
  const [awayTeam, setAwayTeam] = useState({ name: "AWAY", letter: "B", color: "var(--color-brand-primary)", logoUrl: null });

  const totalGoals = homeScore + awayScore;

  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return;
      try {
        const response = await matchService.getMatchDetail({
          url: `/matches/${matchId}`,
        });

        if (response) {
          console.log("Data retrieved successfully:", response);

          // Lấy thông tin thật từ API (BE trả về dạng response.data hoặc response trực tiếp)
          const data = response.data || response;

          // Khoá UI khi trận đã kết thúc
          if (data.status === "FINISHED" || data.status === "COMPLETED") setFinished(true);

          // Load tỉ số từ BE (hỗ trợ cả camelCase lẫn snake_case)
          const hs = data.score?.home ?? data.homeScore ?? data.home_score;
          const as = data.score?.away ?? data.awayScore ?? data.away_score;
          if (hs !== undefined && hs !== null) setHomeScore(hs);
          if (as !== undefined && as !== null) setAwayScore(as);

          // Load tên đội bóng thật từ API
          if (data.homeTeam) {
            setHomeTeam({
              name: data.homeTeam.name || "HOME",
              letter: (data.homeTeam.name || "A").charAt(0).toUpperCase(),
              color: "var(--color-surface-nav)",
              logoUrl: data.homeTeam.logoUrl || null,
            });
          }
          if (data.awayTeam) {
            setAwayTeam({
              name: data.awayTeam.name || "AWAY",
              letter: (data.awayTeam.name || "B").charAt(0).toUpperCase(),
              color: "var(--color-brand-primary)",
              logoUrl: data.awayTeam.logoUrl || null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data from Backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetails();
  }, [matchId]);

  const handleFinish = async () => {
    try {
      // Backend yêu cầu action="END" để kết thúc trận đấu, cập nhật score và set ended_at = NOW()
      await matchService.submitMatchResult({
        url: `/matches/${matchId}/result`,
        data: { action: "END", homeScore, awayScore },
      });

      setShowConfirm(false);
      setFinished(true);
    } catch (error) {
      console.error("Error finalizing match", error);
      const msg = error.response?.data?.message || error.message || "Lỗi không xác định";
      alert(`Lỗi từ Server: ${msg}`);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400 font-semibold">Đang tải dữ liệu trận đấu...</p>
      </div>
    );
  }

  return (
    <div className="h-full pb-10 font-[var(--font-body)]">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-xl transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-black tracking-wide text-gray-900">
          {homeTeam.name} vs {awayTeam.name}
        </h1>
      </div>
      {finished ? (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-black text-gray-900">Match Finished!</h2>
          <div className="flex items-center gap-8 text-center mt-3">
            <div>
              <p className="text-gray-500 font-semibold text-sm">{homeTeam.name}</p>
              <p className="text-6xl font-black text-gray-900">{homeScore}</p>
            </div>
            <p className="text-3xl font-black text-brand-primary">VS</p>
            <div>
              <p className="text-gray-500 font-semibold text-sm">{awayTeam.name}</p>
              <p className="text-6xl font-black text-gray-900">{awayScore}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-10 py-3 rounded-full font-bold text-sm tracking-widest text-white transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_6px_24px_rgba(200,16,46,0.4)]"
          >
            BACK TO LIST
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-stretch gap-6">
            <TeamCard
              team={homeTeam}
              score={homeScore}
              onScore={setHomeScore}
            />
            <div className="flex items-center justify-center px-2">
              <span className="font-black text-4xl select-none text-brand-primary drop-shadow-md">
                VS
              </span>
            </div>
            <TeamCard
              team={awayTeam}
              score={awayScore}
              onScore={setAwayScore}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <StatBox label="Total Goals" value={totalGoals} />
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-14 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase text-white transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_8px_28px_rgba(200,16,46,0.45)]"
            >
              Finish Match
            </button>
          </div>
        </>
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-5xl">🏁</span>
              <h2 className="font-black text-xl mt-3 text-gray-900">
                End this match?
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                The result will be saved and status changed to{" "}
                <strong>FINISHED</strong>.
              </p>
            </div>
            <div
              className="flex items-center justify-around rounded-2xl py-4 px-6"
              style={{ background: "#f5f6fa" }}
            >
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 tracking-wider">
                  {homeTeam.name}
                </p>
                <p className="text-4xl font-black text-gray-900">{homeScore}</p>
              </div>
              <span className="text-xl font-black text-red-400">—</span>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 tracking-wider">
                  {awayTeam.name}
                </p>
                <p className="text-4xl font-black text-gray-900">{awayScore}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-2xl text-white font-black text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_4px_16px_rgba(200,16,46,0.4)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
