import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { teamService } from "../services/teamService";
import { setTeams, updateTeam } from "../stores/features/teamSlice";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { PiCoatHangerBold } from "react-icons/pi";

const UploadIcon = () => (
  <svg
    className="w-6 h-6 text-slate-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

const FormTeam = ({ ref }) => {
  const [_, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const [formTeam, setFormTeam] = useState({
    id: "",
    logo_url: "",
    kit_url: [],
    name: "",
    country: "",
    description: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const logoRef = useRef();
  const playerJerseyRef = useRef();
  const goalkeeperJerseyRef = useRef();

  //Hàm xem trước logo
  const logoPreview = useMemo(() => {
    if (!formTeam.logo_url) return null;
    return typeof formTeam.logo_url === "object"
      ? URL.createObjectURL(formTeam.logo_url)
      : formTeam.logo_url;
  }, [formTeam.logo_url]);

  //Hàm xem trước ảnh áo
  const jerseyPreview = useMemo(() => {
    if (!formTeam.kit_url || formTeam.kit_url.length === 0) return [];
    return formTeam.kit_url.map((value) => {
      if (!value) return null;
      return typeof value === "object" ? URL.createObjectURL(value) : value;
    });
  }, [formTeam.kit_url]);

  //Hàm set dữ liệu cho Form
  useEffect(() => {
    if (teamId && teams?.items) {
      const foundTeam = teams.items.find((item) => item.id == teamId);
      if (foundTeam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsEdit(true);
        setFormTeam({
          id: foundTeam.id || "",
          logo_url: foundTeam.logo_url || "",
          kit_url: foundTeam.kit_url || [],
          name: foundTeam.name || "",
          country: foundTeam.country || "",
          description: foundTeam.description || "",
        });
        ref.current?.showModal();
      }
    } else {
      setIsEdit(false);
      setFormTeam({
        id: "",
        logo_url: "",
        kit_url: [],
        name: "",
        country: "",
        description: "",
      });
      ref.current.close();
    }
  }, [teamId, teams?.items, ref]);

  //Hàm xóa query string trên url
  const deleteQueryString = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (params.has("teamId")) params.delete("teamId");
      return params;
    });
  };

  //Hàm cập nhật team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      await teamService.updateTeam({ url: `/teams/${teamId}`, data: formTeam });
      deleteQueryString();
      await teamService.getAllTeam({ url: "/teams", dispatch, func: setTeams });
    } catch (error) {
      console.log("Có lỗi xảy ra", error);
      dispatch(updateTeam(formTeam));
      toast("Lỗi xử lý ở server, tạm thời cập nhật ở phía Frontend");
      deleteQueryString();
    }
  };
  return (
    <>
      <dialog
        className="w-[95%] md:w-[60%] p-4 md:p-6 m-auto bg-surface-bg outline-none backdrop:bg-black/20 backdrop:backdrop-blur-[2px] rounded-[12px] font-display max-h-[90vh] overflow-y-auto"
        ref={ref}
      >
        {/* TIÊU ĐỀ */}
        <h3 className="text-headline-sm md:text-headline-md text-brand-primary font-bold text-center italic uppercase">
          {isEdit ? "Update Team" : "Create Team"}
        </h3>

        <form
          className="flex flex-col md:flex-row justify-between gap-6 mt-6"
          onSubmit={handleUpdateTeam}
        >
          {/* CỘT TRÁI: LOGO & JERSEY */}
          <div className="flex flex-col gap-6 w-full md:w-[55%] select-none">
            {/* SECTION: TEAM LOGO */}
            <div className="bg-surface-white p-4 md:p-6 rounded-lg shadow-sm border-b-4 border-brand-primary">
              <h3 className="text-label-sm text-surface-nav font-bold mb-4 uppercase italic">
                Team Logo
              </h3>
              <div className="flex justify-center items-center h-40 md:h-48">
                <input
                  type="file"
                  ref={logoRef}
                  onChange={(e) =>
                    setFormTeam((prev) => ({
                      ...prev,
                      logo_url: e.target.files[0],
                    }))
                  }
                  className="hidden"
                  accept="image/*"
                />
                <div
                  onClick={() => logoRef.current?.click()}
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-dashed border-icon-muted bg-surface-card flex items-center justify-center cursor-pointer overflow-hidden group hover:border-brand-primary transition-all"
                >
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity"
                      alt="Logo preview"
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center p-2">
                    <UploadIcon />
                    <span className="text-[10px] md:text-label-sm text-surface-nav font-bold mt-1">
                      DRAG & DROP LOGO
                    </span>
                    <span className="text-[9px] text-nav-muted">
                      PNG or SVG, Max 5MB
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: TEAM JERSEY */}
            <div className="bg-surface-white p-4 md:p-6 rounded-lg shadow-sm border-b-4 border-[#A55E26]">
              {" "}
              {/* Màu nâu giống ảnh */}
              <h3 className="text-label-sm text-surface-nav font-bold mb-4 uppercase italic">
                Team Jersey
              </h3>
              <div className="flex flex-row gap-4 h-40 md:h-48">
                {[0, 1].map((index) => (
                  <div key={index} className="w-1/2 relative font-body">
                    <input
                      type="file"
                      ref={index === 0 ? playerJerseyRef : goalkeeperJerseyRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setFormTeam((prev) => {
                          const newKits = [...prev.kit_url];
                          newKits[index] = file;
                          return { ...prev, kit_url: newKits };
                        });
                      }}
                      className="hidden"
                    />
                    <div
                      onClick={() =>
                        (index === 0
                          ? playerJerseyRef
                          : goalkeeperJerseyRef
                        ).current?.click()
                      }
                      className="relative w-full h-full border-2 border-dashed border-icon-muted bg-surface-card rounded-xl flex items-center justify-center cursor-pointer overflow-hidden group hover:border-brand-primary transition-all"
                    >
                      {jerseyPreview[index] && (
                        <img
                          src={jerseyPreview[index]}
                          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                          alt="Jersey preview"
                        />
                      )}
                      <div className="relative z-10 flex flex-col items-center text-center p-2 md:p-4">
                        <PiCoatHangerBold className="text-nav-muted w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-[10px] md:text-label-sm text-surface-nav font-bold mt-2 uppercase leading-tight">
                          Jersey Design
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: INPUT & NOTIFICATIONS */}
          <div className="flex flex-col w-full md:w-[42%] p-4 md:p-6 bg-surface-white rounded-[12px] shadow-sm font-body">
            <div className="flex flex-col gap-5 md:gap-6">
              {[
                {
                  title: "Team name",
                  key: "name",
                  placeholder: "E.G., NEON STRIKE FC",
                },
                {
                  title: "Nationality",
                  key: "country",
                  placeholder: "Vietnam",
                },
                {
                  title: "Description",
                  key: "description",
                  placeholder: "Club mission and history...",
                },
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <label className="text-label-sm text-surface-nav font-bold uppercase italic mb-1">
                    {item.title}
                  </label>
                  <input
                    onChange={(e) =>
                      setFormTeam({ ...formTeam, [item.key]: e.target.value })
                    }
                    className="w-full py-2 outline-none border-b-2 border-surface-bg text-body-md text-surface-nav focus:border-brand-primary transition-colors placeholder:text-nav-muted/50"
                    type="text"
                    placeholder={item.placeholder}
                    value={formTeam[item.key]}
                  />
                </div>
              ))}

              {/* THÔNG BÁO KIỂU MOBILE */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full text-white">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] md:text-label-sm font-bold text-emerald-700 uppercase tracking-wide">
                    Brand Guidelines Applied
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full text-white font-bold text-[10px]">
                    i
                  </div>
                  <span className="text-[11px] md:text-label-sm font-bold text-orange-700 uppercase tracking-wide">
                    Real-time Draft Saving
                  </span>
                </div>
              </div>
            </div>

            {/* NÚT BẤM */}
            <div className="flex gap-4 justify-end items-center mt-8 md:mt-auto">
              <button
                onClick={() => deleteQueryString()}
                type="button"
                className="text-body-sm md:text-body-md text-nav-muted font-bold cursor-pointer hover:text-surface-nav transition-colors px-4"
              >
                CANCEL
              </button>
              <button className="py-2.5 md:py-3 px-8 md:px-10 bg-cta-gradient text-body-sm md:text-body-md text-surface-white font-bold rounded-[8px] hover:scale-105 transition-all shadow-md uppercase">
                Save
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};
export default FormTeam;
