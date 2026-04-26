import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { tournamentService } from "../services/tournamentService";
import {
  createTournament,
  deleteTournament,
  setTournaments,
  updateTournament,
} from "../stores/features/tournamentSlice";

import TournamentForm from "../components/TournamentForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { Briefcase } from "lucide-react";
import { toast } from "react-toastify";

const TournamentManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state.tournaments.items);

  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [createFormData, setCreateFormData] = useState({
    name: "",
    format: "",
    description: "",
    start_date: "",
    end_date: "",
    logo_url: "",
    status: "UPCOMING",
  });

  const [editFormData, setEditFormData] = useState(null);
  const confirmDialog = useRef();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      await tournamentService.getAllTournament({
        url: "/tournaments",
        dispatch,
        func: setTournaments,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (tournaments.length > 0) {
      const selected = id
        ? tournaments.find((t) => t.id === id || t.id === parseInt(id))
        : tournaments[0];
      setSelectedTournament(selected || tournaments[0]);
    } else {
      setSelectedTournament(null);
    }
  }, [tournaments, id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Chuyển ISO date thành YYYY-MM-DD cho input[type="date"]
  const toDateInputValue = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toISOString().split("T")[0];
  };

  const openEditModal = () => {
    setEditFormData({
      ...selectedTournament,
      start_date: toDateInputValue(selectedTournament?.start_date),
      end_date: toDateInputValue(selectedTournament?.end_date),
    });
    setShowEdit(true);
  };

  const openCreateModal = () => {
    setCreateFormData({
      name: "",
      format: "",
      description: "",
      start_date: "",
      end_date: "",
      logo_url: "",
      status: "UPCOMING",
    });
    setShowCreate(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      // Gọi API tạo tournament qua backend
      await tournamentService.createTournament({
        name: createFormData.name,
        description: createFormData.description,
        format: createFormData.format,
        start_date: createFormData.start_date,
        end_date: createFormData.end_date,
        logo_url: createFormData.logo_url || "",
      });

      toast.success("Tournament created successfully!");

      setShowCreate(false);
      // Fetch lại danh sách từ server để đồng bộ
      fetchData();
    } catch {
      // Nếu BE lỗi, lưu tạm vào Redux
      toast.warning("Backend error - Temporarily saved to browser");

      const newTournament = {
        ...createFormData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      dispatch(createTournament(newTournament));
      setShowCreate(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Chỉ gửi các field thực sự thay đổi để tránh lỗi validation từ backend
    const allowedFields = ["name", "description", "format", "start_date", "end_date", "logo_url", "status"];
    const changedData = {};

    for (const field of allowedFields) {
      const originalValue = field.includes("date")
        ? toDateInputValue(selectedTournament?.[field])
        : selectedTournament?.[field];

      if (editFormData[field] !== undefined && editFormData[field] !== originalValue) {
        changedData[field] = editFormData[field];
      }
    }

    // Nếu không có gì thay đổi
    if (Object.keys(changedData).length === 0) {
      toast.info("No changes detected");
      setShowEdit(false);
      return;
    }

    // Nếu thay đổi format/date mà status không phải UPCOMING → cần gửi status hiện tại để BE validate
    if ((changedData.format || changedData.start_date || changedData.end_date) && !changedData.status) {
      changedData.status = selectedTournament?.status;
    }

    try {
      setIsSaving(true);
      await tournamentService.updateTournament(
        selectedTournament?.id,
        changedData
      );
      toast.success("Tournament updated successfully!");
      setShowEdit(false);
      fetchData();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Backend error";
      toast.warning(errorMsg);

      // Fallback: Dispatch action update vào Redux
      dispatch(updateTournament({
        ...editFormData,
        id: selectedTournament.id,
      }));

      setShowEdit(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenConfirmDialog = () => {
    confirmDialog.current?.showModal();
  };

  const handleDelete = async () => {
    const idToDelete = selectedTournament.id;

    try {
      setIsLoading(true);
      // 2. Gọi API xóa
      await tournamentService.deleteTournament(idToDelete);

      toast.success("Tournament deleted successfully");
      confirmDialog.current?.close();

      // 3. Reset selectedTournament về null trước khi fetch lại
      setSelectedTournament(null);
      fetchData();
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      const statusCode = error?.response?.status;

      if (statusCode && errorMsg) {
        // Backend trả lỗi cụ thể (403, 404, 409...)
        toast.error(errorMsg);
      } else {
        // Lỗi mạng hoặc không kết nối được BE → xóa tạm trên FE
        toast.warning("Backend not available - Temporarily removed from browser");
        confirmDialog.current?.close();

        dispatch(deleteTournament(idToDelete));

        // Tự động chọn giải đấu đầu tiên còn lại
        if (tournaments.length > 1) {
          const nextSelected = tournaments.find((t) => t.id !== idToDelete);
          setSelectedTournament(nextSelected);
        } else {
          setSelectedTournament(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  // --- GIAO DIỆN KHI KHÔNG CÓ GIẢI ĐẤU ---
  if (tournaments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
        <h1 className="text-4xl font-black text-slate-800 mb-8 tracking-tight uppercase">
          Tournament
        </h1>

        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <Briefcase size={64} className="text-blue-400" />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              No tournaments yet
            </h2>
            <p className="text-slate-500 text-base">
              Create a new tournament to get started
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-8 py-4 rounded-xl font-bold text-white bg-[#c8102e] hover:bg-red-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          CREATE TOURNAMENT
        </button>

        {/* Modal Create vẫn cần hiển thị ở đây để người dùng bấm nút là hiện popup */}
        {showCreate && (
          <TournamentForm
            formData={createFormData}
            setFormData={setCreateFormData}
            handleSubmit={handleCreateSubmit}
            handleClose={() => setShowCreate(false)}
            isSaving={isSaving}
            submitLabel="CREATE"
          />
        )}
      </div>
    );
  }

  // --- GIAO DIỆN CHÍNH KHI CÓ DỮ LIỆU ---
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cột trái - Chi tiết Tournament */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-64 h-64 bg-[#1a202c] rounded-[2rem] shadow-xl mb-6 overflow-hidden flex-shrink-0 mx-auto">
            <img
              src={
                selectedTournament?.logo_url ||
                "https://placehold.co/300x300/1a202c/ffffff?text=No+Logo"
              }
              alt={selectedTournament?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-4xl font-black text-slate-800 mb-10 tracking-tight text-center w-full uppercase">
            {selectedTournament?.name}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8 w-full">
            {[
              {
                label: "Start Date",
                val: formatDate(selectedTournament?.start_date),
                color: "bg-red-600",
              },
              {
                label: "End Date",
                val: formatDate(selectedTournament?.end_date),
                color: "bg-amber-700",
              },
              {
                label: "Format",
                val: selectedTournament?.format,
                color: "bg-emerald-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100 flex-1 min-w-[140px] text-center"
              >
                <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1 uppercase">
                  {stat.label}
                </p>
                <p className="text-lg font-black text-slate-800">{stat.val}</p>
                <div
                  className={`h-1 w-full ${stat.color} mt-3 rounded-full`}
                ></div>
              </div>
            ))}
          </div>

          {/* Description Box */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 w-full min-h-[200px] mb-8">
            <h3 className="text-2xl font-black text-slate-800 mb-3">
              Description
            </h3>
            <p className="text-slate-600 text-base leading-relaxed">
              {selectedTournament?.description ||
                "No description available for this tournament."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full">
            <button
              onClick={openEditModal}
              className="flex-1 py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-red-500 to-yellow-400 shadow-md hover:scale-[1.02] transition-all"
            >
              EDIT
            </button>
            <button
              onClick={() => navigate(`/matches/${selectedTournament?.id}`)}
              className="flex-1 py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-red-500 to-yellow-400 shadow-md hover:scale-[1.02] transition-all"
            >
              LIST MATCH
            </button>
            <button
              onClick={handleOpenConfirmDialog}
              className="flex-1 py-4 rounded-xl font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all"
            >
              REMOVE
            </button>
          </div>
        </div>

        {/* Cột phải - Danh sách Tournament */}
        <div className="lg:col-span-5 flex flex-col">
          <h2 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">
            TOURNAMENT
          </h2>
          <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[600px] pr-2">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                onClick={() => setSelectedTournament(tournament)}
                className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${
                  selectedTournament?.id === tournament.id
                    ? "bg-[#c8102e] border-[#c8102e] text-white"
                    : "bg-white text-slate-800 hover:bg-slate-50 border-slate-100"
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                  <img
                    src={tournament.logo_url || "https://placehold.co/64x64"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-black truncate ${
                      selectedTournament?.id === tournament.id
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                  >
                    {tournament.name}
                  </p>
                  <p
                    className={`text-xs font-bold mt-1 ${
                      selectedTournament?.id === tournament.id
                        ? "text-white/80"
                        : "text-slate-500"
                    }`}
                  >
                    {tournament.format}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={openCreateModal}
            className="mt-8 px-8 py-4 rounded-xl font-bold text-white bg-[#c8102e] hover:bg-red-700 shadow-lg transition-all uppercase"
          >
            CREATE TOURNAMENT
          </button>
        </div>
      </div>

      {/* MODAL CREATE (Dành cho trường hợp có dữ liệu) */}
      {showCreate && (
        <TournamentForm
          formData={createFormData}
          setFormData={setCreateFormData}
          handleSubmit={handleCreateSubmit}
          handleClose={() => setShowCreate(false)}
          isSaving={isSaving}
          submitLabel="CREATE"
        />
      )}

      {/* MODAL EDIT */}
      {showEdit && (
        <TournamentForm
          formData={editFormData}
          setFormData={setEditFormData}
          handleSubmit={handleUpdateSubmit}
          handleClose={() => setShowEdit(false)}
          isSaving={isSaving}
          submitLabel="UPDATE"
        />
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        message={`Are you sure you want to delete the tournament "${selectedTournament?.name}"?`}
        ref={confirmDialog}
        handleConfirm={handleDelete}
      />
    </>
  );
};

export default TournamentManagement;
