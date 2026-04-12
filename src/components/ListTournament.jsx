import { useState, useEffect } from "react";
import { tournamentService } from "../services/tournamentService";
import { Trophy, AlertCircle, Loader2, Calendar, Info } from "lucide-react";

const ListTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await tournamentService.getAllTournaments();
      // Dựa vào JSON bạn cung cấp, response trả về thẳng là một mảng
      const data = response.data || response; 
      
      setTournaments(data);
    } catch (err) {
      setError("Không thể tải danh sách giải đấu. Vui lòng kiểm tra kết nối hoặc thử lại sau.");
      console.error("Fetch tournaments failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Helper Functions ---

  // Format ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  // Map trạng thái sang Tiếng Việt và màu sắc tương ứng
  const getStatusConfig = (status) => {
    switch (status) {
      case "UPCOMING":
        return { label: "Sắp diễn ra", color: "bg-blue-50 text-blue-600 border-blue-200" };
      case "ONGOING":
        return { label: "Đang diễn ra", color: "bg-green-50 text-green-600 border-green-200" };
      case "COMPLETED":
        return { label: "Đã kết thúc", color: "bg-slate-100 text-slate-600 border-slate-200" };
      default:
        return { label: status || "Không rõ", color: "bg-gray-50 text-gray-600 border-gray-200" };
    }
  };

  // Map thể thức thi đấu sang Tiếng Việt
  const getFormatLabel = (format) => {
    switch (format) {
      case "LEAGUE": return "Đấu vòng tròn";
      case "KNOCKOUT": return "Loại trực tiếp";
      case "GROUP_STAGE": return "Chia bảng";
      default: return format || "Chưa xác định";
    }
  };

  // --- Render States ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium">Đang tải dữ liệu giải đấu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 border border-red-100">
        <AlertCircle size={24} />
        <p className="font-bold">{error}</p>
        <button 
          onClick={fetchTournaments}
          className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg font-bold transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
        <Trophy className="mx-auto text-slate-300 mb-4" size={48} />
        <p className="text-slate-500 font-medium">Chưa có giải đấu nào trong hệ thống.</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tournaments.map((tournament) => {
        const statusConfig = getStatusConfig(tournament.status);
        
        return (
          <div 
            key={tournament.id} 
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col h-full"
          >
            {/* Image Section */}
            <div className="w-full h-48 bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
              {tournament.logo_url ? (
                <img 
                  src={tournament.logo_url} 
                  alt={tournament.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback nếu link ảnh bị lỗi
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <Trophy size={48} />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm bg-opacity-90 ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-black text-slate-800 mb-2 line-clamp-1" title={tournament.name}>
                {tournament.name}
              </h3>
              
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                {tournament.description || "Chưa có mô tả cho giải đấu này."}
              </p>
              
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <Info className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Thể thức</p>
                    <p className="text-sm font-bold text-slate-700">
                      {getFormatLabel(tournament.format)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="text-slate-400 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Thời gian</p>
                    <p className="text-sm font-bold text-slate-700">
                      {formatDate(tournament.start_date)}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <button className="w-full py-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 hover:border-primary">
                Xem chi tiết
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListTournament;
