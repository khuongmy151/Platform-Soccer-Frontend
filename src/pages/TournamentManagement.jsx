import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tournamentService } from "../services/tournamentService";
import { setTournaments } from "../stores/features/tournamentSlice";
import { Upload, Calendar as CalendarIcon } from "lucide-react";

const TournamentManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state.tournaments.items);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data for create/edit
  const [formData, setFormData] = useState({
    name: "",
    format: "",
    description: "",
    start_date: "",
    end_date: "",
    logo_url: "",
    status: "UPCOMING",
  });

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  // Update selectedTournament when tournaments change
  useEffect(() => {
    if (tournaments.length > 0) {
      if (id) {
        const selected = tournaments.find(
          (t) => t.id === id || t.id === parseInt(id)
        );
        setSelectedTournament(selected || tournaments[0]);
      } else {
        setSelectedTournament(tournaments[0]);
      }
    }
  }, [tournaments, id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      await tournamentService.getAllTournament({
        url: "/tournaments",
        dispatch,
        func: setTournaments,
      });
    } catch (error) {
      console.error("Fetch data failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleEdit = () => {
    if (selectedTournament) {
      setFormData({
        name: selectedTournament.name || "",
        format: selectedTournament.format || "",
        description: selectedTournament.description || "",
        start_date: selectedTournament.start_date || "",
        end_date: selectedTournament.end_date || "",
        logo_url: selectedTournament.logo_url || "",
        status: selectedTournament.status || "UPCOMING",
      });
      setShowEditModal(true);
    }
  };
  
  const handleCreate = () => {
    setFormData({
      name: "",
      format: "",
      description: "",
      start_date: "",
      end_date: "",
      logo_url: "",
      status: "UPCOMING",
    });
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await tournamentService.createTournament(formData);
      alert("Tạo giải đấu thành công!");
      setShowCreateModal(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Create failed:", err);
      alert("Lỗi khi tạo giải đấu. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await tournamentService.updateTournament(selectedTournament.id, formData);
      alert("Cập nhật giải đấu thành công!");
      setShowEditModal(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Update failed:", err);
      alert("Lỗi khi cập nhật. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTournament = (tournament) => {
    setSelectedTournament(tournament);
  };

  if (isLoading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (!selectedTournament) {
    return <div className="text-center py-20">Không tìm thấy giải đấu</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Tournament Detail */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start">
          {/* Logo */}
          <div className="w-64 h-64 bg-[#1a202c] rounded-[2rem] shadow-xl mb-6 mx-auto overflow-hidden flex-shrink-0">
            {selectedTournament.logo_url ? (
              <img
                src={selectedTournament.logo_url}
                alt={selectedTournament.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/300x300/1a202c/ffffff?text=No+Logo";
                }}
              />
            ) : (
              <div className="w-full h-full bg-[#1a202c]"></div>
            )}
          </div>

          <h1 className="text-4xl font-black text-slate-800 mb-10 tracking-tight text-center w-full">
            {selectedTournament.name}
          </h1>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-4 mb-8 w-full justify-center lg:justify-start">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 flex-1 min-w-[140px] text-center">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">
                Start Date
              </p>
              <p className="text-lg font-black text-slate-800">
                {formatDate(selectedTournament.start_date)}
              </p>
              <div className="h-1 w-full bg-red-600 mt-3 rounded-full"></div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 flex-1 min-w-[140px] text-center">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">
                End Date
              </p>
              <p className="text-lg font-black text-slate-800">
                {formatDate(selectedTournament.end_date)}
              </p>
              <div className="h-1 w-full bg-amber-700 mt-3 rounded-full"></div>
            </div>
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 flex-1 min-w-[140px] text-center">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">
                Format
              </p>
              <p className="text-lg font-black text-slate-800">
                {selectedTournament.format}
              </p>
              <div className="h-1 w-full bg-emerald-600 mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Rules Box */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 w-full min-h-[200px] mb-8">
            <h3 className="text-2xl font-black text-slate-800 mb-3">Mô tả</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              {selectedTournament.description ||
                "Chưa có mô tả cho giải đấu này."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 w-full justify-center">
            <button
              onClick={handleEdit}
              className="flex-1 py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-red-500 to-yellow-400 hover:from-red-600 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"            >
              EDIT
            </button>
            <button className="flex-1 py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-red-500 to-yellow-400 hover:from-red-600 hover:to-yellow-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              CREATE MATCH
            </button>
            <button 
            className="flex-1 py-4 rounded-xl font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all shadow-sm">
              REMOVE
            </button>
          </div>
        </div>

        {/* Right Column - Tournament List */}
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
            TOURNAMENT
          </h2>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[600px]">
            {tournaments.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                Không có giải đấu nào
              </p>
            ) : (
              tournaments.map((tournament) => (
                <div
                  onClick={() => handleSelectTournament(tournament)}
                  key={tournament.id}
                  className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border border-slate-100 shadow-sm hover:shadow-md ${
                    selectedTournament?.id === tournament.id
                      ? "bg-[#c8102e] border-[#c8102e] text-white"
                      : "bg-white text-slate-800 hover:bg-[#c8102e] hover:border-[#c8102e]"
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                    {tournament.logo_url ? (
                      <img
                        src={tournament.logo_url}
                        alt={tournament.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/64x64/e2e8f0/64748b?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black tracking-wider transition-colors truncate ${
                        selectedTournament?.id === tournament.id
                          ? "text-white"
                          : "text-slate-800 group-hover:text-white"
                      }`}
                    >
                      {tournament.name}
                    </p>
                    <p
                      className={`text-xs font-bold mt-1 transition-colors truncate ${
                        selectedTournament?.id === tournament.id
                          ? "text-white"
                          : "text-slate-500 group-hover:text-white"
                      }`}
                    >
                      {tournament.format}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCreate}
              className="px-8 py-4 rounded-xl font-bold text-white bg-[#c8102e] hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              CREATE TOURNAMENT
            </button>
          </div>
        </div>
      </div>
      
      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-center mb-10 text-gray-900">
              Create Tournament
            </h2>
            <TournamentForm 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmitCreate}
              handleClose={handleCloseModal}
              isSaving={isSaving}
              submitLabel="CREATE"
            />
          </div>
        </div>
      )}
      
      {/* Edit Tournament Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-center mb-10 text-gray-900">
              Edit Tournament
            </h2>
            <TournamentForm 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmitEdit}
              handleClose={handleCloseModal}
              isSaving={isSaving}
              submitLabel="UPDATE"
            />
          </div>
        </div>
      )}
    </>
  );
};

// Helper component for form
const TournamentForm = ({ formData, handleChange, handleSubmit, handleClose, isSaving, submitLabel }) => (
  <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 md:gap-12">
    {/* Left Column: Logo Upload */}
    <div className="w-full md:w-[350px] flex-shrink-0 mx-auto md:mx-0">
      <div className="bg-white rounded-[2rem] p-4 shadow-[0_0_40px_rgba(204,29,36,0.1)] border border-red-50">
        <div
          onClick={() => document.getElementById('logo-upload').click()}
          className="aspect-square rounded-3xl bg-[#131c2e] overflow-hidden relative group mb-4 flex items-center justify-center cursor-pointer"
        >
          {formData.logo_url ? (
            <img
              src={formData.logo_url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload size={48} className="text-gray-600" />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <p className="text-white font-bold">Change Image</p>
          </div>
        </div>
        
        <div className="flex justify-center -mt-8 relative z-10">
          <button
            type="button"
            onClick={() => document.getElementById('logo-upload').click()}
            className="bg-[#cc1d24] text-white px-8 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-red-700 transition-colors"
          >
            UPLOAD LOGO
          </button>
        </div>

        <input
          type="file"
          id="logo-upload"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const url = URL.createObjectURL(file);
              handleChange({ target: { name: 'logo_url', value: url } });
            }
          }}
        />
      </div>
    </div>

    {/* Right Column: Form Fields */}
    <div className="flex-1 flex flex-col gap-6">
      <FormGroup label="NAME">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tournament Name"
          className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#cc1d24]/20 transition-all"
          required
        />
      </FormGroup>

      <FormGroup label="TYPE">
        <input
          type="text"
          name="format"
          value={formData.format}
          onChange={handleChange}
          placeholder="LEAGUE, KNOCKOUT, GROUP_STAGE"
          className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#cc1d24]/20 transition-all"
          required
        />
      </FormGroup>

      <FormGroup label="DESCRIPTION (OPTIONAL)">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tournament description..."
          rows={4}
          className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#cc1d24]/20 transition-all resize-none"
        />
      </FormGroup>

      <FormGroup label="TOURNAMENT DATE">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#cc1d24]/20 transition-all"
            />
            {/* <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} /> */}
          </div>
          <div className="relative flex-1">
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full bg-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#cc1d24]/20 transition-all"
            />
            {/* <CalendarIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} /> */}
          </div>
        </div>
      </FormGroup>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={handleClose}
          className="px-10 py-4 bg-gray-500 text-white rounded-2xl font-black text-lg hover:bg-gray-600 transition-colors"
        >
          BACK
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-12 py-4 bg-[#cc1d24] text-white rounded-2xl font-black text-lg shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/40 transition-all disabled:opacity-50"
        >
          {isSaving ? "SAVING..." : submitLabel}
        </button>
      </div>
    </div>
  </form>
);

// Helper component for form labels
const FormGroup = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-black text-gray-500 tracking-widest uppercase ml-2">
      {label}
    </label>
    {children}
  </div>
);

export default TournamentManagement;
