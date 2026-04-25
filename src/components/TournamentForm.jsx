import React, { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import validateForm from "../helpers/validateForm";

const FORMAT_OPTIONS = [
  { value: "", label: "-- Select Format --" },
  { value: "LEAGUE", label: "League" },
  { value: "KNOCKOUT", label: "Knockout" },
  { value: "GROUP_STAGE", label: "Group Stage" },
];

// Các trạng thái hợp lệ theo backend
const STATUS_TRANSITIONS = {
  UPCOMING: ["UPCOMING", "ONGOING", "CANCELLED"],
  ONGOING: ["ONGOING", "COMPLETED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED"],
};

const STATUS_COLORS = {
  UPCOMING: "text-blue-600 bg-blue-50 border-blue-200",
  ONGOING: "text-emerald-600 bg-emerald-50 border-emerald-200",
  COMPLETED: "text-slate-600 bg-slate-50 border-slate-200",
  CANCELLED: "text-red-600 bg-red-50 border-red-200",
};

const selectArrowStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1.5rem center",
};

const TournamentForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  isSaving,
  submitLabel,
}) => {
  const isEditMode = submitLabel === "UPDATE";
  const currentStatus = formData.status || "UPCOMING";
  const availableStatuses = STATUS_TRANSITIONS[currentStatus] || [currentStatus];

  const [errors, setErrors] = useState({
    errorName: "",
    errorFormat: "",
    errorStartDate: "",
    errorEndDate: "",
    errorDescription: "",
    errorLogoUrl: "",
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[`error${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors((prev) => ({ ...prev, [`error${name.charAt(0).toUpperCase() + name.slice(1)}`]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        setErrors((prev) => ({ ...prev, errorLogoUrl: "Please upload a valid image (JPG, PNG, GIF, WebP)" }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, errorLogoUrl: "File size must be less than 5MB" }));
        return;
      }
      
      // Create blob URL for preview and store file
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoFile: file, logoPreview: previewUrl }));
      setErrors((prev) => ({ ...prev, errorLogoUrl: "" }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, logoFile: null, logoPreview: "", logo_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm.validateFormTournament({ formData, setError: setErrors })) {
      return; // Stop if validation fails
    }
    
    // If validation passes, call the original handleSubmit
    await handleSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backup-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto p-8 md:p-12 animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-black text-center mb-10 text-gray-900 uppercase tracking-tight">
          {submitLabel} TOURNAMENT
        </h2>

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col md:flex-row gap-8 md:gap-12"
        >
          {/* Left Column: Logo Preview + URL Input */}
          <div className="w-full md:w-[320px] flex-shrink-0">
            <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-3xl bg-[#1a202c] overflow-hidden relative group mb-6 flex items-center justify-center border-4 border-transparent transition-all cursor-pointer hover:opacity-90"
              >
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : null}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-2 ${formData.logoPreview ? "hidden" : ""}`}
                >
                  <Upload size={48} className="text-slate-500" />
                  <span className="text-slate-500 text-xs font-bold">UPLOAD IMAGE</span>
                </div>
                
                {formData.logoPreview && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* File Upload Input */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  name="logo_url"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#c8102e] hover:bg-red-700 text-white rounded-2xl px-6 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer"
                >
                  {formData.logoPreview ? "Change Image" : "Upload Image"}
                </button>
                {errors.errorLogoUrl && (
                  <p className="text-xs font-bold text-red-600 mt-1">{errors.errorLogoUrl}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                Tournament Name
              </label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Ex: Champions League 2024"
                className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                  errors.errorName ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-red-500/20"
                }`}
              />
              {errors.errorName && (
                <p className="text-xs font-bold text-red-600 mt-1">{errors.errorName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                Format / Type
              </label>
              <select
                name="format"
                value={formData.format || ""}
                onChange={handleChange}
                className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                  errors.errorFormat ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-red-500/20"
                }`}
                style={selectArrowStyle}
              >
                {FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>              {errors.errorFormat && (
                <p className="text-xs font-bold text-red-600 mt-1">{errors.errorFormat}</p>
              )}            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date || ""}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.errorStartDate ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-red-500/20"
                  }`}
                />
                {errors.errorStartDate && (
                  <p className="text-xs font-bold text-red-600 mt-1">{errors.errorStartDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date || ""}
                  onChange={handleChange}
                  className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.errorEndDate ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-red-500/20"
                  }`}
                />
                {errors.errorEndDate && (
                  <p className="text-xs font-bold text-red-600 mt-1">{errors.errorEndDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Enter tournament details..."
                className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 font-medium text-slate-600 focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.errorDescription ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-red-500/20"
                }`}
              />
              {errors.errorDescription && (
                <p className="text-xs font-bold text-red-600 mt-1">{errors.errorDescription}</p>
              )}
            </div>

            {/* Status - Chỉ hiển thị khi UPDATE */}
            {isEditMode && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status || "UPCOMING"}
                  onChange={handleChange}
                  className={`w-full border rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer ${STATUS_COLORS[formData.status] || STATUS_COLORS.UPCOMING}`}
                  style={selectArrowStyle}
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {currentStatus !== "UPCOMING" && (
                  <p className="text-[10px] font-bold text-slate-400 ml-2 mt-1">
                    ⚠ Format and dates cannot be changed when status is not UPCOMING
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-10 py-4 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-2xl font-black transition-all uppercase text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-4 bg-[#c8102e] hover:bg-red-700 text-white rounded-2xl font-black shadow-lg shadow-red-200 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Processing..." : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm;
