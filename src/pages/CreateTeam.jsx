import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { IoInformationCircleOutline } from "react-icons/io5";
import { teamService } from "../services/teamService";
import { addTeam } from "../stores/features/teamSlice";
import { toast } from "react-toastify";
import validateForm from "../helpers/validateForm";

const initialForm = {
  name: "",
  country: "",
  description: "",
  logoFile: null,
  playerJerseyFile: null,
  goalkeeperJerseyFile: null,
};

const CreateTeam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logo = useRef();
  const playerJersey = useRef();
  const goalkeeperJersey = useRef();
  const [error, setError] = useState({
    errorName: "",
    errorCountry: "",
    errorDescription: "",
  });

  const logoPreview = useMemo(() => {
    if (form.logoFile !== null) return URL.createObjectURL(form.logoFile);
  }, [form.logoFile]);
  const playerJerseyPreview = useMemo(() => {
    if (form.playerJerseyFile !== null)
      return URL.createObjectURL(form.playerJerseyFile);
  }, [form.playerJerseyFile]);
  const goalkeeperJerseyPreview = useMemo(() => {
    if (form.goalkeeperJerseyFile !== null)
      return URL.createObjectURL(form.goalkeeperJerseyFile);
  }, [form.goalkeeperJerseyFile]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (playerJerseyPreview) URL.revokeObjectURL(playerJerseyPreview);
      if (goalkeeperJerseyPreview) URL.revokeObjectURL(goalkeeperJerseyPreview);
    };
  }, [logoPreview, playerJerseyPreview, goalkeeperJerseyPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra xem đã chọn đủ 3 file chưa
    const logoFile = logo.current.files[0];
    const playerFile = playerJersey.current.files[0];
    const gkFile = goalkeeperJersey.current.files[0];
    if (!logoFile || !playerFile || !gkFile) {
      toast.warning("Vui lòng chọn đầy đủ 3 ảnh");
      return;
    }
    // Định nghĩa các định dạng cho phép và dung lượng tối đa
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const MAX_SIZE = 300 * 1024; // 300KB
    const files = [
      { file: logoFile, label: "Logo" },
      { file: playerFile, label: "Áo cầu thủ" },
      { file: gkFile, label: "Áo thủ môn" },
    ];
    // Vòng lặp kiểm tra từng file
    for (const item of files) {
      // Kiểm tra định dạng
      if (!allowedTypes.includes(item.file.type)) {
        toast.error(
          `${item.label} không đúng định dạng. Chỉ chấp nhận JPEG, PNG, GIF.`
        );
        return;
      }
      // Kiểm tra dung lượng
      if (item.file.size > MAX_SIZE) {
        toast.error(`${item.label} quá lớn (Tối đa 300KB).`);
        return;
      }
    }
    if (validateForm.validateFormTeam({ formTeam: form, setError })) {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("country", form.country.trim());
      formData.append("description", form.description.trim());
      formData.append("logo", form.logoFile);
      formData.append("kit", form.playerJerseyFile);
      formData.append("kit", form.goalkeeperJerseyFile);
      try {
        await teamService.createTeam({
          url: "/teams",
          data: formData,
        });
        navigate("/teams");
      } catch (error) {
        console.error(error);
        const fallbackTeam = {
          ...formData,
          id: Date.now(),
        };
        dispatch(addTeam(fallbackTeam));
        alert("Không kết nối được backend, đã lưu tạm ở local list.");
        navigate("/teams");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1120px] pb-44 md:pb-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[38px] leading-[1.05] md:text-display-md font-extrabold tracking-tight text-surface-panel uppercase">
          <span className="md:hidden">
            Create <span className="text-brand-primary">Team</span>
          </span>
          <span className="hidden md:inline">
            Create <span className="text-brand-primary">Team</span>
          </span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-2"
      >
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-1">
            <div className="rounded-xl bg-surface-white px-5 pb-5 pt-5 md:p-7 shadow-sm border-b-4 border-brand-primary">
              <p className="text-[14px] md:text-title-sm font-bold text-surface-panel uppercase mb-4 md:mb-5">
                Team logo
              </p>
              <label className="mx-auto flex h-36 w-36 md:h-48 md:w-48 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-gray-400 bg-surface-bg p-4 text-center">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <>
                    <FiUpload className="text-xl md:text-2xl text-gray-500" />
                    <p className="mt-2 text-[10px] md:text-label-lg font-bold text-surface-nav uppercase">
                      Upload logo
                    </p>
                    <p className="hidden md:block text-label-sm text-gray-500">
                      PNG or SVG, Max 5MB
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  className="hidden"
                  ref={logo}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      logoFile: e.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
            </div>

            <div className="rounded-xl bg-surface-white px-5 pb-5 pt-5 md:p-7 shadow-sm border-b-4 border-orange-700">
              <p className="text-[14px] md:text-title-sm font-bold text-surface-panel uppercase mb-4 md:mb-5">
                Team jerseys
              </p>
              <div className="flex flex-col gap-3 md:flex-row">
                <label className="relative flex-1 cursor-pointer rounded-xl border-2 border-dashed border-gray-400 bg-surface-bg p-2 md:p-3 text-center overflow-hidden">
                  <div className="aspect-video flex flex-col items-center justify-center">
                    {playerJerseyPreview && (
                      <img
                        src={playerJerseyPreview}
                        alt="Player jersey preview"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                      />
                    )}
                    <div className="z-10">
                      <FiUpload className="mx-auto text-lg text-gray-600" />
                      <p className="mt-1 text-[10px] font-bold text-surface-nav uppercase">
                        Player jersey
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className="hidden"
                    ref={playerJersey}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        playerJerseyFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
                <label className="relative flex-1 cursor-pointer rounded-xl border-2 border-dashed border-gray-400 bg-surface-bg p-2 md:p-3 text-center overflow-hidden">
                  <div className="aspect-video flex flex-col items-center justify-center">
                    {goalkeeperJerseyPreview && (
                      <img
                        src={goalkeeperJerseyPreview}
                        alt="Goalkeeper jersey preview"
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                      />
                    )}
                    <div className="z-10">
                      <FiUpload className="mx-auto text-lg text-gray-600" />
                      <p className="mt-1 text-[10px] font-bold text-surface-nav uppercase">
                        Goalkeeper jersey
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className="hidden"
                    ref={goalkeeperJersey}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        goalkeeperJerseyFile: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              </div>
              <p className="mt-3 hidden md:block text-label-sm text-gray-500">
                Accepts 3D mockups or flat illustrations
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface-white p-6 md:p-7 shadow-sm">
          <div className="space-y-5 md:space-y-6">
            <div>
              <label className="text-[10px] md:text-label-sm font-black tracking-[0.2em] text-gray-600 uppercase">
                Team name
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, name: e.target.value }));
                  setError((prev) => ({ ...prev, errorName: "" }));
                }}
                placeholder="E.g., Neon Strike FC"
                className="w-full border-b border-gray-400 md:border-b-2 bg-transparent py-2 text-[30px] md:text-xl text-surface-panel uppercase outline-none placeholder:text-gray-300"
              />
              <span className="text-brand-primary text-label-sm">
                {error.errorName}
              </span>
            </div>

            <div>
              <label className="text-[10px] md:text-label-sm font-black tracking-[0.2em] text-gray-600 uppercase">
                Nationality
              </label>
              <input
                value={form.country}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, country: e.target.value }));
                  setError((prev) => ({ ...prev, errorCountry: "" }));
                }}
                placeholder="Vietnam"
                className="w-full border-b border-gray-400 md:border-b-2 bg-transparent py-2 text-base text-surface-panel outline-none placeholder:text-gray-300"
              />
              <span className="text-brand-primary text-label-sm">
                {error.errorCountry}
              </span>
            </div>

            <div>
              <label className="text-[10px] md:text-label-sm font-black tracking-[0.2em] text-gray-600 uppercase">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, description: e.target.value }));
                  setError((prev) => ({ ...prev, errorDescription: "" }));
                }}
                placeholder="Club mission and history..."
                className="min-h-18 md:min-h-24 w-full border-b border-gray-400 md:border-b-2 bg-transparent py-1.5 md:py-2 text-[14px] md:text-base text-surface-panel outline-none placeholder:text-gray-300 resize-none"
              />
              <span className="text-brand-primary text-label-sm">
                {error.errorDescription}
              </span>
            </div>

            <div className="space-y-3 pt-1 md:pt-2">
              <div className="flex items-center gap-3 rounded-lg md:rounded-xl bg-green-100 p-3 md:p-4 text-green-800">
                <HiOutlineShieldCheck className="text-base md:text-xl" />
                <p className="text-[8px] md:text-label-lg font-bold uppercase tracking-wide">
                  Brand guidelines applied
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-lg md:rounded-xl bg-orange-100 p-3 md:p-4 text-orange-800">
                <IoInformationCircleOutline className="text-base md:text-xl" />
                <p className="text-[8px] md:text-label-lg font-bold uppercase tracking-wide">
                  Real-time draft saving
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-full hidden md:flex justify-end gap-6 pt-1">
          <button
            data-umami-event="Cancel create team button click"
            type="button"
            onClick={() => navigate("/teams")}
            className="text-label-lg rounded-xl bg-[#dadde2] px-10 py-4 font-bold tracking-[0.2em] text-gray-500 uppercase cursor-pointer"
          >
            Cancel
          </button>
          <button
            data-umami-event="Create team button click"
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cta-gradient px-10 py-4 text-label-lg font-bold tracking-[0.2em] text-white uppercase shadow-lg shadow-brand-primary/20 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create team"}
          </button>
        </div>
      </form>

      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 border-t border-header-line bg-surface-white px-5 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] md:hidden">
        <div className="mx-auto flex w-full max-w-[1120px] items-center gap-4">
          <button
            data-umami-event="Cancel create team button click"
            type="button"
            onClick={() => navigate("/teams")}
            className="h-14 w-[28%] rounded-xl bg-[#dadde2] text-[12px] font-black tracking-[0.2em] text-[#595c5f] uppercase cursor-pointer"
          >
            Cancel
          </button>
          <button
            data-umami-event="Create team button click"
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="h-14 flex-1 rounded-xl bg-[linear-gradient(90deg,#ba0022_0%,#ff6d00_50%,#ffea00_100%)] text-[14px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-brand-primary/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
