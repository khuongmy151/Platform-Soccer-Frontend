import { useEffect, useMemo, useState } from "react";
import {
  getAllPlayers,
  createPlayer,
  updatePlayer,
  removePlayer,
  uploadPlayerAvatar,
  validatePlayerForm,
  getMockPlayers,
} from "../services/playerService";

// ============================================================
// PlayerManagement Page
// Figma:
//  - Mode "detail" : Hiển thị player được chọn + roster sidebar
//  - Mode "form"   : ADD PLAYER / UPLOAD PLAYER / EDIT
// KHÔNG gọi axios trực tiếp, mọi API đi qua playerService.
// ============================================================

const EMPTY_FORM = {
  name: "",
  height: "",
  weight: "",
  preferredFoot: "LEFT",
  mainPosition: "",
  avatarUrl: "",
};

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("detail"); // "detail" | "form"
  const [formMode, setFormMode] = useState("add"); // "add" | "edit"
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ------------------------------------------------------------
  // Load roster lần đầu — fallback mock khi backend lỗi
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const data = await getAllPlayers();
        const list = Array.isArray(data) ? data : data?.items || [];
        if (list.length) {
          setPlayers(list);
          setSelectedId(list[0].id);
        } else {
          throw new Error("Empty");
        }
      } catch {
        const mock = getMockPlayers();
        setPlayers(mock);
        setSelectedId(mock[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const selectedPlayer = useMemo(
    () => players.find((p) => p.id === selectedId),
    [players, selectedId]
  );

  // ------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------
  const handleOpenAdd = () => {
    setFormMode("add");
    setForm(EMPTY_FORM);
    setAvatarFile(null);
    setErrors({});
    setMode("form");
  };

  const handleOpenEdit = () => {
    if (!selectedPlayer) return;
    setFormMode("edit");
    setForm({
      name: selectedPlayer.name || "",
      height: selectedPlayer.height || "",
      weight: selectedPlayer.weight || "",
      preferredFoot: selectedPlayer.preferredFoot || "LEFT",
      mainPosition: selectedPlayer.mainPosition || "",
      avatarUrl: selectedPlayer.avatarUrl || "",
    });
    setAvatarFile(null);
    setErrors({});
    setMode("form");
  };

  const handleBackToDetail = () => {
    setMode("detail");
    setErrors({});
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // Preview cục bộ ngay, backend sẽ thay bằng URL thật khi submit
    setForm((prev) => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    const { valid, errors: validationErrors } = validatePlayerForm(form);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      let finalAvatarUrl = form.avatarUrl;
      if (avatarFile) {
        try {
          const uploadRes = await uploadPlayerAvatar(avatarFile);
          finalAvatarUrl = uploadRes?.url || finalAvatarUrl;
        } catch {
          // Bỏ qua lỗi upload, vẫn giữ preview local (dev offline)
        }
      }

      const payload = { ...form, avatarUrl: finalAvatarUrl };

      if (formMode === "add") {
        let created;
        try {
          created = await createPlayer(payload);
        } catch {
          created = { id: Date.now(), ...payload };
        }
        setPlayers((prev) => [...prev, created]);
        setSelectedId(created.id);
      } else {
        let updated;
        try {
          updated = await updatePlayer(selectedId, payload);
        } catch {
          updated = { id: selectedId, ...payload };
        }
        setPlayers((prev) =>
          prev.map((p) => (p.id === selectedId ? { ...p, ...updated } : p))
        );
      }
      setMode("detail");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = () => {
    if (!selectedPlayer) return;
    setIsDeleteModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    try {
      try {
        await removePlayer(selectedId);
      } catch {
        // Dev offline: vẫn xoá khỏi UI
      }
      const remaining = players.filter((p) => p.id !== selectedId);
      setPlayers(remaining);
      setSelectedId(remaining[0]?.id || null);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen rounded-3xl bg-[var(--color-surface-bg)] p-8">
      {/* Header mini giống mock: breadcrumb + add button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-display-sm font-bold text-[var(--color-surface-panel)]">
            PLAYERS
          </h1>
          <p className="text-body-md text-gray-500">
            Manage all the players in the squad
          </p>
        </div>
        {mode === "detail" && (
          <button
            onClick={handleOpenAdd}
            className="rounded-lg bg-[var(--color-brand-primary)] px-5 py-2.5 text-body-md font-semibold text-white shadow-md transition hover:bg-[var(--color-brand-dark)]"
          >
            + ADD PLAYER
          </button>
        )}
      </div>

      {loading && (
        <div className="mb-4 text-body-md text-gray-500">Đang xử lý...</div>
      )}

      {mode === "form" ? (
        <PlayerForm
          formMode={formMode}
          form={form}
          errors={errors}
          onChange={handleChange}
          onPickAvatar={handlePickAvatar}
          onSubmit={handleSubmit}
          onCancel={handleBackToDetail}
        />
      ) : (
        <PlayerDetailView
          player={selectedPlayer}
          players={players}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onEdit={handleOpenEdit}
          onRemove={handleRemoveClick}
        />
      )}

      {/* Modern Remove Modal Component */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md transform self-center rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <h3 className="text-title-lg font-extrabold text-gray-900">
              Remove
            </h3>
            <p className="mt-2 text-body-md text-gray-600 leading-relaxed">
              Are you sure you want to delete the player{" "}
              <span className="font-bold text-[var(--color-brand-accent)]">
                {selectedPlayer?.name || "this"}
              </span>{" "}
              from the list? This action cannot be undone.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-body-md font-bold text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                HỦY
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-body-md font-bold text-white shadow-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                XÓA NGAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SUBCOMPONENT: Form thêm/sửa player (view ADD PLAYER / UPLOAD)
// ============================================================
const PlayerForm = ({
  formMode,
  form,
  errors,
  onChange,
  onPickAvatar,
  onSubmit,
  onCancel,
}) => {
  const title = formMode === "edit" ? "EDIT PLAYER" : "ADD PLAYER";
  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT: Avatar + Title + Upload */}
        <div className="flex flex-col items-center rounded-xl bg-gradient-to-br from-[#f5ece4] to-[#e8dcd0] p-6">
          <h2 className="mb-4 self-start text-display-sm font-extrabold tracking-tight text-[var(--color-surface-panel)]">
            {title}
          </h2>
          <div className="relative mb-4 h-64 w-64 overflow-hidden rounded-xl bg-gray-200">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No avatar
              </div>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-surface-panel)] px-5 py-2 text-label-lg font-semibold text-white transition hover:bg-black">
            <span>UPLOAD PROFILE</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickAvatar}
            />
          </label>
        </div>

        {/* RIGHT: Credentials form */}
        <div>
          <h3 className="mb-6 border-b border-[var(--color-brand-accent)] pb-2 text-title-lg font-bold uppercase tracking-wide text-gray-700">
            Player Credentials
          </h3>

          <FormField
            label="NAME"
            value={form.name}
            onChange={(v) => onChange("name", v)}
            error={errors.name}
            placeholder="e.g. your name"
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <FormField
              label="HEIGHT (CM)"
              value={form.height}
              onChange={(v) => onChange("height", v)}
              error={errors.height}
              type="number"
              placeholder="185"
            />
            <FormField
              label="WEIGHT (KG)"
              value={form.weight}
              onChange={(v) => onChange("weight", v)}
              error={errors.weight}
              type="number"
              placeholder="78"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-label-sm font-semibold uppercase tracking-wider text-gray-500">
              Preferred Foot
            </label>
            <div className="flex gap-2">
              {["LEFT", "RIGHT", "BOTH"].map((foot) => (
                <button
                  key={foot}
                  type="button"
                  onClick={() => onChange("preferredFoot", foot)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-label-lg font-semibold transition ${
                    form.preferredFoot === foot
                      ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)] text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:border-[var(--color-brand-primary)]"
                  }`}
                >
                  {foot}
                </button>
              ))}
            </div>
            {errors.preferredFoot && (
              <p className="mt-1 text-label-sm text-red-500">
                {errors.preferredFoot}
              </p>
            )}
          </div>

          <div className="mt-4">
            <FormField
              label="MAIN POSITION"
              value={form.mainPosition}
              onChange={(v) => onChange("mainPosition", v)}
              error={errors.mainPosition}
              placeholder="e.g. Center Forward"
            />
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-body-lg font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              CANCEL
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] py-3 text-body-lg font-bold text-white shadow-lg transition hover:opacity-90"
            >
              {formMode === "edit" ? "SAVE CHANGES" : "CREATE PLAYER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Input tái sử dụng trong form
const FormField = ({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="mb-2 block text-label-sm font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-[var(--color-surface-card)] px-4 py-2.5 text-body-md text-gray-800 outline-none transition focus:border-[var(--color-brand-primary)] focus:bg-white"
    />
    {error && <p className="mt-1 text-label-sm text-red-500">{error}</p>}
  </div>
);

// ============================================================
// SUBCOMPONENT: Detail view (view Marcus Valentine)
// ============================================================
const PlayerDetailView = ({
  player,
  players,
  selectedId,
  onSelect,
  onEdit,
  onRemove,
}) => {
  if (!player) {
    return (
      <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
        Chưa có cầu thủ nào trong đội hình. Hãy thêm mới để bắt đầu!
      </div>
    );
  }

  // Tách tên: Marcus | Valentine (first + last màu khác)
  const nameParts = (player.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT/CENTER: Player Spotlight */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Big avatar + position badge */}
          <div className="relative mx-auto w-fit">
            <div className="h-80 w-64 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#1e1b4b] shadow-xl">
              {player.avatarUrl ? (
                <img
                  src={player.avatarUrl}
                  alt={player.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/60">
                  No photo
                </div>
              )}
            </div>
            <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-accent)] to-[var(--color-brand-primary)] text-title-lg font-extrabold text-white shadow-lg">
              {player.mainPosition || "??"}
            </div>
          </div>

          {/* Name */}
          <div className="mt-6 text-center">
            <h2 className="text-display-md font-extrabold">
              <span className="text-[var(--color-surface-panel)]">
                {firstName}
              </span>{" "}
              <span className="text-[var(--color-brand-accent)]">
                {lastName}
              </span>
            </h2>
          </div>

          {/* Information card */}
          <div className="mt-6 rounded-xl bg-[var(--color-surface-card)] p-6">
            <h3 className="mb-4 text-title-lg font-bold text-[var(--color-surface-panel)]">
              INFORMATION
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-body-md">
              <InfoRow label="HEIGHT" value={player.height} accent />
              <InfoRow label="FOOT" value={player.preferredFoot} accent />
              <InfoRow label="WEIGHT" value={player.weight} accent />
              <InfoRow label="POSITION" value={player.mainPosition} accent />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={onEdit}
              className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] py-3 text-body-lg font-bold text-white shadow-md transition hover:opacity-90"
            >
              EDIT
            </button>
            <button
              onClick={onRemove}
              className="flex-1 rounded-xl bg-gray-300 py-3 text-body-lg font-bold text-gray-700 transition hover:bg-gray-400"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Roster sidebar */}
      <div>
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-baseline justify-between border-b border-gray-100 pb-3">
            <h3 className="text-headline-sm font-extrabold text-[var(--color-surface-panel)]">
              ROSTER
            </h3>
            <span className="text-body-md text-gray-500">
              {players.length} Players Active
            </span>
          </div>

          <div className="flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
            {players.map((p) => {
              const isActive = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className={`flex items-center gap-3 rounded-xl p-3 text-left transition ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-dark)] text-white shadow-md"
                      : "bg-[var(--color-surface-card)] text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                    {p.avatarUrl && (
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-label-sm font-semibold uppercase tracking-wider ${
                        isActive ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {p.mainPosition || "POSITION"}
                    </div>
                    <div className="truncate text-title-sm font-bold">
                      {p.name || "NAME"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, accent }) => (
  <div className="flex items-center gap-3">
    <span className="text-label-sm font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </span>
    <span
      className={`text-body-lg font-bold ${
        accent ? "text-[var(--color-brand-primary)]" : "text-gray-800"
      }`}
    >
      {value ?? "—"}
    </span>
  </div>
);

export default PlayerManagement;
