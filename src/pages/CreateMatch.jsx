import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import matchService from '../services/matchService';
import { axiosClient } from '../services/axiosClient';

const InputField = ({ label, type = "text", placeholder, options, icon, value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1 w-full">
      <label className={`text-[9px] font-black tracking-widest uppercase px-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400">{icon}</div>}
        {options ? (
          <select value={value} onChange={onChange} className={`w-full bg-surface-bg border text-gray-700 font-semibold text-sm rounded-xl py-2.5 appearance-none focus:outline-none focus:ring-2 transition-all ${icon ? 'pl-9 pr-8' : 'px-4 pr-8'} cursor-pointer ${error ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:ring-brand-primary/20'}`}>
             <option value="" disabled className="text-gray-400">{placeholder}</option>
             {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full bg-surface-white border text-gray-800 font-semibold text-sm rounded-xl py-2.5 focus:outline-none focus:ring-2 transition-all ${icon ? 'pl-9 pr-4' : 'px-4'} ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : 'border-gray-200 focus:border-brand-primary'}`}
          />
        )}
        {options && (
          <div className="absolute right-3 pointer-events-none text-gray-400">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        )}
      </div>
      {error && <span className="text-[10px] text-red-500 font-bold px-1">{error}</span>}
    </div>
  )
}

export default function CreateMatch() {
  const navigate = useNavigate();

  // --- THIẾT LẬP STATE LƯU TRỮ DỮ LIỆU ĐỂ GỬI API ---
  const [teamA, setTeamA] = useState('')
  const [teamB, setTeamB] = useState('')
  const [matchTitle, setMatchTitle] = useState('')
  const [arena, setArena] = useState('')
  const [kickoffDate, setKickoffDate] = useState('')
  const [kickoffTime, setKickoffTime] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [teamList, setTeamList] = useState([])

  // Lấy danh sách đội bóng có sẵn từ Backend API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosClient.get('/teams');
        const data = response.data || response || [];
        if (!data || data.length === 0) {
           throw new Error("No teams from backend");
        }
        setTeamList(data);
      } catch (err) {
        console.warn("Backend trắng, tự động thêm 3 đội mẫu vào cho bạn test:", err.message);
        setTeamList([
          { id: 't1', name: "TEAM ZETA" },
          { id: 't2', name: "TEAM OMEGA" },
          { id: 't3', name: "TEAM NEON" }
        ]);
      }
    };
    fetchTeams();
  }, []);

  // Bắt lỗi Validation
  const validateForm = () => {
    let newErrors = {};
    if (!teamA) newErrors.teamA = "Vui lòng chọn Đội chủ nhà";
    if (!teamB) newErrors.teamB = "Vui lòng chọn Đội khách";
    if (teamA && teamB && teamA === teamB) newErrors.teamB = "Đội khách không được trùng Đội nhà";
    if (!matchTitle.trim()) newErrors.matchTitle = "Tên trận đấu không được để trống";
    if (!arena) newErrors.arena = "Vui lòng chọn sân thi đấu";
    if (!kickoffDate) newErrors.kickoffDate = "Vui lòng chọn ngày đá / Date Picker";
    if (!kickoffTime) newErrors.kickoffTime = "Vui lòng chọn giờ đá / Time Picker";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Gọi API [POST /matches] (Dựa theo chuẩn REST hoặc quy tắc của BE để TẠO MỚI)
  const handleCreateMatch = async () => {
    if (!validateForm()) {
      return; // Dừng lại không gọi API nếu có lỗi
    }

    try {
      // 1. Chuyển đổi Date + Time thành định dạng ISO 8601 (có Timezone cục bộ)
      // Giả sử lấy timezone local hiện tại
      const localDateObj = new Date(`${kickoffDate}T${kickoffTime}:00`);
      // Đổ timezone bù giờ vào cho chuẩn với Backend
      const offset = -localDateObj.getTimezoneOffset();
      const sign = offset >= 0 ? '+' : '-';
      const pad = (num) => String(num).padStart(2, '0');
      const isoWithTimezone = localDateObj.getFullYear() +
        '-' + pad(localDateObj.getMonth() + 1) +
        '-' + pad(localDateObj.getDate()) +
        'T' + pad(localDateObj.getHours()) +
        ':' + pad(localDateObj.getMinutes()) +
        ':' + pad(localDateObj.getSeconds()) +
        sign + pad(Math.floor(Math.abs(offset) / 60)) + ':' + pad(Math.abs(offset) % 60);

      const newMatchData = {
        tournamentId: 1, // Fix cứng tạm hoặc lấy từ store
        title: matchTitle,
        homeTeamId: teamA, // Lúc này teamA sẽ đang lưu ID thay vì Name
        awayTeamId: teamB,
        startTime: isoWithTimezone,
        venue: {
          name: arena,
          city: "Unknown City",
          country: "Unknown Country"
        },
        round: "Round 1",
        notes: notes,
        refereeName: "TBD",
        status: 'SCHEDULED'
      }
      
      const response = await matchService.createMatch({
        url: '/matches',
        data: newMatchData
      });
      console.log("Response Tạo trận:", response)
      alert("Tạo trận đấu thành công (API POST matches)!")
      navigate('/matches') // Quay về danh sách sau khi tạo xong
    } catch (error) {
      console.error("Lỗi khi tạo trận:", error)
      alert("Lỗi kết nối Backend. Hãy đảm bảo Server đang mở và không bị chặn CORS!")
    }
  }

  return (
    <div className="h-full font-[var(--font-body)] flex justify-center items-start pb-10">
      <div className="bg-surface-white rounded-3xl p-7 max-w-4xl w-full" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
        
        {/* HEADER */}
        <div className="mb-4">
          <div className="bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] w-max mb-3">
             STRATEGIC PAIRING INTERFACE V2.4
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">CREATE <span className="text-brand-primary">TACTICAL</span> MATCH</h1>
        </div>

        {/* TEAM PAIRING */}
        <div className="flex items-center justify-center gap-6 mb-6 pt-2">
          <div className="flex flex-col items-center gap-3 flex-1 max-w-[200px]">
             <div className="w-16 h-16 rounded-full border-[3px] border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-300">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
               <div className="w-full">
               <div className="text-center text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2">Team A (Home)</div>
               <select value={teamA} onChange={(e) => {setTeamA(e.target.value); setErrors({...errors, teamA: null})}} className={`w-full bg-surface-bg border text-gray-700 font-bold text-sm rounded-xl py-3 px-4 appearance-none text-center cursor-pointer focus:outline-none ${errors.teamA ? 'border-red-400 ring-2 ring-red-500/20' : 'border-gray-100'}`}>
                 <option value="" disabled>Select Team Alpha</option>
                 {teamList.map((t) => (
                   <option key={t.id} value={t.id}>{t.name}</option>
                 ))}
               </select>
               {errors.teamA && <div className="text-[10px] text-red-500 font-bold mt-1 text-center">{errors.teamA}</div>}
             </div>
          </div>

          <div className="text-3xl font-black text-gray-200 mb-8 select-none">VS</div>

          <div className="flex flex-col items-center gap-3 flex-1 max-w-[200px]">
             <div className="w-16 h-16 rounded-full border-[3px] border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-300">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
             <div className="w-full">
               <div className={`text-center text-[10px] uppercase font-black tracking-widest mb-2 ${errors.teamB ? 'text-red-500' : 'text-gray-400'}`}>Team B (Away)</div>
               <select value={teamB} onChange={(e) => {setTeamB(e.target.value); setErrors({...errors, teamB: null})}} className={`w-full bg-brand-primary/10 border text-gray-800 font-bold text-sm rounded-xl py-3 px-4 appearance-none text-center cursor-pointer focus:outline-none ${errors.teamB ? 'border-red-400 ring-2 ring-red-500/20' : 'border-brand-primary/20'}`}>
                 <option value="" disabled>Team B</option>
                 {teamList.map((t) => (
                   <option key={t.id} value={t.id}>{t.name}</option>
                 ))}
               </select>
               {errors.teamB && <div className="text-[10px] text-red-500 font-bold mt-1 text-center">{errors.teamB}</div>}
             </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <InputField 
              label="Match Title" 
              placeholder="Neon Strike Cup - Match #042" 
              value={matchTitle} 
              onChange={(e) => {setMatchTitle(e.target.value); setErrors({...errors, matchTitle: null})}} 
              error={errors.matchTitle}
            />
            <InputField 
              label="Arena Selection" 
              placeholder="Select Arena"
              options={["The Grid", "Stadium Prime", "Wembley", "Santiago Bernabéu"]}
              value={arena}
              onChange={(e) => {setArena(e.target.value); setErrors({...errors, arena: null})}}
              error={errors.arena}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            />
          </div>
          
          <div className="flex gap-4 pr-3">
             <InputField 
               label="Kickoff Date" 
               type="date"
               value={kickoffDate}
               onChange={(e) => {setKickoffDate(e.target.value); setErrors({...errors, kickoffDate: null})}}
               error={errors.kickoffDate}
             />
             <InputField 
               label="Kickoff Time" 
               type="time"
               value={kickoffTime}
               onChange={(e) => {setKickoffTime(e.target.value); setErrors({...errors, kickoffTime: null})}}
               error={errors.kickoffTime}
             />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
             <label className="text-[9px] font-black tracking-widest text-gray-500 uppercase px-1">Match Intensity Notes</label>
             <textarea 
               placeholder="Define tactical constraints, referee assignments, or special broadcast requirements..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className="w-full bg-surface-bg border border-transparent text-gray-700 font-medium text-sm rounded-2xl p-4 min-h-[70px] focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none placeholder-gray-400"
             ></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-4 pt-2">
          <button onClick={handleCreateMatch} className="flex items-center justify-center gap-2 px-10 py-3 rounded-xl text-white font-black text-[11px] tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98] bg-[linear-gradient(135deg,#ff4444,#ff8c00)] shadow-lg shadow-brand-primary/30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            CREATE MATCH
          </button>
          <button onClick={() => navigate('/matches')} className="px-10 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-black text-[11px] tracking-widest uppercase hover:bg-gray-50 transition-colors">
            CANCEL
          </button>
        </div>

      </div>
    </div>
  );
}
