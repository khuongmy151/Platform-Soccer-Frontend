import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import matchService from '../services/matchService'

/* ─── SHARED UI COMPONENTS (Match) ────────────────────────────── */
function TeamLogo({ letter, bgColor = '#1a1a2e', size = 80 }) {
  return (
    <div style={{ width: size, height: size }} className="relative mx-auto">
      <div className="absolute inset-0 rounded-full" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
      <div className="absolute inset-1.5 rounded-full flex items-center justify-center" style={{ background: bgColor }}>
        <span className="text-white font-black text-2xl" style={{ fontSize: size * 0.3 }}>{letter}</span>
      </div>
    </div>
  )
}

function Stepper({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg transition-colors active:scale-95" style={{ lineHeight: 1 }}>−</button>
      <span className="text-5xl font-black text-gray-900 min-w-[2ch] text-center leading-none">{value}</span>
      <button onClick={() => onChange(value + 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg transition-colors active:scale-95" style={{ lineHeight: 1 }}>+</button>
    </div>
  )
}

function MiniStepper({ value, onChange, emoji }) {
  return (
    <div className="flex-1 bg-white rounded-2xl px-3 py-3 flex flex-col items-center gap-2" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-1.5"><span className="text-lg">{emoji}</span><span className="font-bold text-gray-800 text-lg">{value}</span></div>
      <div className="flex items-center gap-2">
        <button onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold transition-colors active:scale-95">−</button>
        <button onClick={() => onChange(value + 1)} className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold transition-colors active:scale-95">+</button>
      </div>
    </div>
  )
}

function TeamCard({ team, score, onScore, yellowCards, onYellow, redCards, onRed }) {
  return (
    <div className="flex-1 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(170deg, #fde8e8 0%, #fdf0f0 45%, #f7f7fc 100%)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minWidth: 0 }}>
      <div className="px-6 pt-6 pb-4 flex flex-col items-center gap-3">
        <TeamLogo letter={team.letter} bgColor={team.color} size={72} />
        <h2 className="font-black text-xl tracking-wider text-gray-900 text-center">{team.name}</h2>
        <Stepper value={score} onChange={onScore} />
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400">Match Score</p>
      </div>
      <div className="mx-5 border-t border-gray-200/70" />
      <div className="px-5 py-5 flex gap-3">
        <MiniStepper value={yellowCards} onChange={onYellow} emoji="🟨" />
        <MiniStepper value={redCards} onChange={onRed} emoji="🟥" />
      </div>
    </div>
  )
}

function StatBox({ label, value }) {
  return (
    <div className="flex-1 rounded-2xl flex flex-col items-center justify-center py-3 px-4 bg-surface-card shadow-inner">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-4xl font-black text-gray-900">{value}</p>
    </div>
  )
}

/* ─── THE MATCH COMPONENT ───────────────────────────────────────── */
export default function MatchPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()

  const [finished, setFinished] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // NOTE: Thay đổi các giá trị khởi tạo này thành data lấy từ API
  const [homeScore, setHomeScore] = useState(2)
  const [awayScore, setAwayScore] = useState(1)
  const [homeYellow, setHomeYellow] = useState(3)
  const [homeRed, setHomeRed] = useState(0)
  const [awayYellow, setAwayYellow] = useState(2)
  const [awayRed, setAwayRed] = useState(1)

  const totalGoals = homeScore + awayScore
  const totalYellow = homeYellow + awayYellow
  const totalRed = homeRed + awayRed


  useEffect(() => {
    const fetchMatchDetails = async () => {
      if (!matchId) return
      try {
        const response = await matchService.getMatchDetail({
          url: `/matches/${matchId}`
        })

        if (response) {
          console.log("Đã lấy được dữ liệu:", response);
          if (response.status === 'FINISHED') {
            setFinished(true); // Khoá vĩnh viễn nút chỉnh sửa Tỉ số
          }
          if (response.homeScore !== undefined) setHomeScore(response.homeScore);
          if (response.awayScore !== undefined) setAwayScore(response.awayScore);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ Backend:", error)
      }
    }
    fetchMatchDetails()
  }, [matchId])



  const handleFinish = async () => {
    try {
      await matchService.updateMatchStatus({
        url: `/matches/${matchId}/status`,
        data: { status: 'FINISHED' }
      })

      await matchService.submitMatchResult({
        url: `/matches/${matchId}/result`,
        data: { homeScore, awayScore }
      })

      await matchService.submitMatchStats({
        url: `/matches/${matchId}/stats`,
        data: { homeYellow, awayYellow, homeRed, awayRed }
      })

      setShowConfirm(false)
      setFinished(true)
    } catch (error) {
      console.error("Lỗi khi kết thúc trận đấu", error)
      alert("Kết nối đến Backend bị lỗi! \nVui lòng bật Server Backend trên port 8080 hoặc sửa lại link trong file.")
    }
  }

  return (
    <div className="h-full pb-10 font-[var(--font-body)]">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate('/matches')} className="text-gray-500 hover:bg-gray-100 p-2 rounded-xl transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-2xl font-black tracking-wide text-gray-900">MATCH #{matchId}</h1>
      </div>
      {finished ? (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <div className="text-6xl">🏆</div>
          <h2 className="text-3xl font-black text-gray-900">Trận Đấu Kết Thúc!</h2>
          <div className="flex items-center gap-8 text-center mt-3">
             <div><p className="text-gray-500 font-semibold text-sm">TITANS FC</p><p className="text-6xl font-black text-gray-900">{homeScore}</p></div>
             <p className="text-3xl font-black text-brand-primary">VS</p>
             <div><p className="text-gray-500 font-semibold text-sm">STORM UNITED</p><p className="text-6xl font-black text-gray-900">{awayScore}</p></div>
          </div>
          <button onClick={() => navigate('/matches')} className="mt-4 px-10 py-3 rounded-full font-bold text-sm tracking-widest text-white transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_6px_24px_rgba(200,16,46,0.4)]">TRỞ VỀ DANH SÁCH</button>
        </div>
      ) : (
        <>
          <div className="flex items-stretch gap-6">
            <TeamCard team={{ name: 'TITANS FC', letter: 'A', color: 'var(--color-surface-nav)' }} score={homeScore} onScore={setHomeScore} yellowCards={homeYellow} onYellow={setHomeYellow} redCards={homeRed} onRed={setHomeRed} />
            <div className="flex items-center justify-center px-2"><span className="font-black text-4xl select-none text-brand-primary drop-shadow-md">VS</span></div>
            <TeamCard team={{ name: 'STORM UNITED', letter: 'B', color: 'var(--color-brand-primary)' }} score={awayScore} onScore={setAwayScore} yellowCards={awayYellow} onYellow={setAwayYellow} redCards={awayRed} onRed={setAwayRed} />
          </div>
          <div className="flex gap-4 mt-4">
            <StatBox label="Total Goals" value={totalGoals} />
            <StatBox label="Yellow Cards" value={totalYellow} />
            <StatBox label="Red Cards" value={totalRed} />
          </div>
          <div className="flex justify-center mt-6">
            <button onClick={() => setShowConfirm(true)} className="px-14 py-4 rounded-full font-black text-sm tracking-[0.15em] uppercase text-white transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_8px_28px_rgba(200,16,46,0.45)]">Finish Match</button>
          </div>
        </>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div className="text-center"><span className="text-5xl">🏁</span><h2 className="font-black text-xl mt-3 text-gray-900">Kết thúc trận đấu?</h2><p className="text-gray-400 text-sm mt-2">Kết quả sẽ được lưu và trạng thái chuyển sang <strong>FINISHED</strong>.</p></div>
            <div className="flex items-center justify-around rounded-2xl py-4 px-6" style={{ background: '#f5f6fa' }}>
              <div className="text-center"><p className="text-xs font-bold text-gray-400 tracking-wider">TITANS FC</p><p className="text-4xl font-black text-gray-900">{homeScore}</p></div>
              <span className="text-xl font-black text-red-400">—</span>
              <div className="text-center"><p className="text-xs font-bold text-gray-400 tracking-wider">STORM UNITED</p><p className="text-4xl font-black text-gray-900">{awayScore}</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">Hủy</button>
              <button onClick={handleFinish} className="flex-1 py-3 rounded-2xl text-white font-black text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 bg-[linear-gradient(160deg,#1a0000,#c8102e)] shadow-[0_4px_16px_rgba(200,16,46,0.4)]">Xác Nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
