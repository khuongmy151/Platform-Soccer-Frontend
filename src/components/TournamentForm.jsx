import React, { useEffect } from "react";
import { Upload } from "lucide-react";

const TournamentForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  isSaving,
  submitLabel,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Xóa ObjectURL cũ nếu có để tránh tràn bộ nhớ
      if (formData.logo_url && formData.logo_url.startsWith("blob:")) {
        URL.revokeObjectURL(formData.logo_url);
      }
      setFormData((prev) => ({ ...prev, logo_url: URL.createObjectURL(file) }));
    }
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (formData.logo_url && formData.logo_url.startsWith("blob:")) {
        URL.revokeObjectURL(formData.logo_url);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backup-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto p-8 md:p-12 animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-black text-center mb-10 text-gray-900 uppercase tracking-tight">
          {submitLabel} TOURNAMENT
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8 md:gap-12"
        >
          {/* Left Column: Logo Upload */}
          <div className="w-full md:w-[320px] flex-shrink-0">
            <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <div
                onClick={() => document.getElementById("file-input").click()}
                className="aspect-square rounded-3xl bg-[#1a202c] overflow-hidden relative group mb-6 flex items-center justify-center cursor-pointer border-4 border-transparent hover:border-red-500/20 transition-all"
              >
                {formData.logo_url ? (
                  <img
                    src={formData.logo_url}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <Upload size={48} className="text-slate-500" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    CHANGE IMAGE
                  </span>
                </div>
              </div>

              <input
                type="file"
                id="file-input"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
                className="w-full bg-[#c8102e] hover:bg-red-700 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition-all uppercase tracking-wider"
              >
                Upload Logo
              </button>
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
                required
                placeholder="Ex: Champions League 2024"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                Format / Type
              </label>
              <input
                name="format"
                value={formData.format || ""}
                onChange={handleChange}
                placeholder="LEAGUE, KNOCKOUT, GROUP_STAGE..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

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
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
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
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                />
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
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
              />
            </div>

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
