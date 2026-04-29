import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { teamService } from "../services/teamService";
import { setTeams, updateTeam } from "../stores/features/teamSlice";
import validateForm from "../helpers/validateForm";
import { toast } from "react-toastify";
import { PiCoatHangerBold } from "react-icons/pi";
import { IoClose, IoPersonAddSharp } from "react-icons/io5";
import { FaUserMinus, FaUsers } from "react-icons/fa";
import FormPlayer from "./FormPlayer";

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

const unwrapMembers = (response) => {
  const data = response?.data ?? response;
  const members = data?.data ?? data?.members ?? data?.items ?? data;
  return Array.isArray(members) ? members : [];
};

const FormUpdateTeam = ({ ref }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);

  const [formTeam, setFormTeam] = useState({
    id: "",
    logo_url: "",
    kit_url: [],
    name: "",
    country: "",
    description: "",
  });
  const logoRef = useRef();
  const playerJerseyRef = useRef();
  const goalkeeperJerseyRef = useRef();
  const formPlayerRef = useRef();
  const [error, setError] = useState({
    errorName: "",
    errorCountry: "",
    errorDescription: "",
  });

  const [activeTab, setActiveTab] = useState("info");
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [addingMembers, setAddingMembers] = useState(false);

  //Hàm xóa query String trên URL
  const deleteQueryString = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (params.has("teamId")) params.delete("teamId");
      return params;
    });
  };

  // Logo preview handler
  const logoPreview = useMemo(() => {
    if (!formTeam.logo_url) return null;
    return typeof formTeam.logo_url === "object"
      ? URL.createObjectURL(formTeam.logo_url)
      : formTeam.logo_url;
  }, [formTeam.logo_url]);

  // Jersey preview handler
  const jerseyPreview = useMemo(() => {
    if (!formTeam.kit_url || formTeam.kit_url.length === 0) return [];
    return formTeam.kit_url.map((value) => {
      if (!value) return null;
      return typeof value === "object" ? URL.createObjectURL(value) : value;
    });
  }, [formTeam.kit_url]);

  // Set initial form data
  useEffect(() => {
    if (teamId && teams?.items) {
      const foundTeam = teams.items.find((item) => item.id == teamId);
      if (foundTeam) {
        setFormTeam({
          id: foundTeam.id || "",
          logo_url: foundTeam.logo_url || null,
          kit_url: foundTeam.kit_url || [],
          name: foundTeam.name || "",
          country: foundTeam.country || "",
          description: foundTeam.description || "",
        });
        setActiveTab("info");
        ref.current?.showModal();
      }
    } else {
      setFormTeam({
        id: "",
        logo_url: null,
        kit_url: [],
        name: "",
        country: "",
        description: "",
      });
      setActiveTab("info");
      ref.current?.close();
    }
  }, [teamId, teams?.items, ref]);

  //Hàm Update team
  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    const logoFile = logoRef.current.files[0];
    const playerFile = playerJerseyRef.current.files[0];
    const gkFile = goalkeeperJerseyRef.current.files[0];

    if (logoFile || playerFile || gkFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      const MAX_SIZE = 300 * 1024; // 300KB
      const files = [
        { file: logoFile, label: "Logo" },
        { file: playerFile, label: "Player Jersey" },
        { file: gkFile, label: "Goalkeeper Jersey" },
      ];

      for (const item of files) {
        if (item.file) {
          if (!allowedTypes.includes(item.file.type)) {
            alert(
              `${item.label} invalid format. Only JPEG, PNG, GIF are accepted.`
            );
            return;
          }
          if (item.file.size > MAX_SIZE) {
            alert(`${item.label} is too large (Max 300KB).`);
            return;
          }
        }
      }
    }

    if (validateForm.validateFormTeam({ formTeam, setError })) {
      const formData = new FormData();
      formData.append("name", formTeam.name);
      formData.append("country", formTeam.country);
      formData.append("description", formTeam.description);

      if (formTeam.logo_url instanceof File) {
        formData.append("logo", formTeam.logo_url);
      } else {
        formData.append("logo_url", formTeam.logo_url);
      }

      const oldKits = [];
      formTeam.kit_url.forEach((kit) => {
        if (kit instanceof File) {
          formData.append("kit", kit);
        } else if (typeof kit === "string" && kit !== "") {
          oldKits.push(kit);
        }
      });
      formData.append("kit_url", JSON.stringify(oldKits));

      try {
        await teamService.updateTeam({
          url: `/teams/${teamId}`,
          data: formData,
        });
        deleteQueryString();
        await teamService.getAllTeam({
          url: "/teams",
          dispatch,
          func: setTeams,
        });
      } catch (error) {
        console.error("Error occurred", error);
        dispatch(updateTeam(formTeam));
        toast("Server error, temporarily updated on Frontend");
        deleteQueryString();
      }
    }
  };

  // Fetch members when switching to members tab
  useEffect(() => {
    if (activeTab === "members" && teamId) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, teamId]);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await teamService.getTeamMembers({
        url: `/teams/${teamId}/members`,
      });
      const data = unwrapMembers(res);
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
      if (error?.response?.status === 404) {
        setMembers([]);
        return;
      }
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleOpenAddForm = () => {
    formPlayerRef.current?.showModal();
  };

  const handleCreateNewMember = async (playerFormData) => {
    setAddingMembers(true);
    try {
      const formData = new FormData();
      formData.append("full_name", playerFormData.name);
      formData.append("age", playerFormData.age);
      formData.append("height_cm", playerFormData.height);
      formData.append("weight_kg", playerFormData.weight);
      formData.append("preferred_foot", playerFormData.preferred_foot);
      formData.append("main_position", playerFormData.main_position);
      formData.append("jersey_number", playerFormData.jersey_number);
      if (playerFormData.avatar instanceof File) {
        formData.append("image", playerFormData.avatar);
      } else if (playerFormData.avatar) {
        formData.append("image_url", playerFormData.avatar);
      }

      await teamService.addTeamMembers({
        url: `/teams/${teamId}/members`,
        data: formData,
      });

      await fetchMembers();
    } catch (error) {
      console.error("Error creating and adding member:", error);
    } finally {
      setAddingMembers(false);
    }
  };

  const handleRemoveMember = async (playerId, memberName = "this member") => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${memberName} from this team?`
    );
    if (!confirmed) return;

    setRemovingId(playerId);
    try {
      await teamService.removeTeamMember({
        url: `/teams/${teamId}/members/${playerId}`,
      });
      await fetchMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <dialog
        className="w-[95%] md:w-[70%] lg:w-[65%] p-0 m-auto bg-surface-bg outline-none backdrop:bg-black/20 backdrop:backdrop-blur-[2px] rounded-[16px] font-display max-h-[92vh] overflow-hidden"
        ref={ref}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-surface-bg px-4 pt-4 pb-0 lg:px-6 lg:pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-headline-sm md:text-headline-md text-brand-primary font-bold italic uppercase">
              Update team
            </h3>
            <button
              onClick={() => deleteQueryString()}
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-white text-surface-nav hover:bg-red-50 hover:text-brand-primary transition-all cursor-pointer shadow-sm"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* TAB NAVIGATION */}

          <div className="flex gap-1 bg-surface-white rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-label-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "info"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-nav-muted hover:text-surface-nav hover:bg-surface-bg"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Team Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-label-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "members"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-nav-muted hover:text-surface-nav hover:bg-surface-bg"
              }`}
            >
              <FaUsers className="w-4 h-4" />
              Members
              {members.length > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === "members"
                      ? "bg-white/20 text-white"
                      : "bg-brand-primary/10 text-brand-primary"
                  }`}
                >
                  {members.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto max-h-[calc(92vh-140px)] px-4 pt-4 pb-4 md:px-6 md:pb-6">
          {activeTab === "info" && (
            <form
              className="flex flex-col lg:flex-row justify-between gap-6"
              onSubmit={handleUpdateTeam}
            >
              {/* LEFT COLUMN: LOGO & JERSEY */}
              <div className="flex flex-col gap-6 w-full lg:w-[55%] select-none">
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
                      accept=".png, .jpg, .jpeg"
                      className="hidden"
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

                <div className="bg-surface-white p-4 md:p-6 rounded-lg shadow-sm border-b-4 border-[#A55E26]">
                  <h3 className="text-label-sm text-surface-nav font-bold mb-4 uppercase italic">
                    Team Jersey
                  </h3>
                  <div className="flex flex-row gap-4 h-40 md:h-48">
                    {[0, 1].map((index) => (
                      <div key={index} className="w-1/2 relative font-body">
                        <input
                          type="file"
                          ref={
                            index === 0 ? playerJerseyRef : goalkeeperJerseyRef
                          }
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setFormTeam((prev) => {
                              const newKits = [...prev.kit_url];
                              newKits[index] = file;
                              return { ...prev, kit_url: newKits };
                            });
                          }}
                          accept=".png, .jpg, .jpeg"
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

              <div className="flex flex-col w-full lg:w-[42%] p-4 md:p-6 bg-surface-white rounded-[12px] shadow-sm font-body">
                <div className="flex flex-col gap-5 md:gap-6">
                  {[
                    {
                      title: "Team name",
                      key: "name",
                      placeholder: "E.G., NEON STRIKE FC",
                      error: error.errorName,
                    },
                    {
                      title: "Nationality",
                      key: "country",
                      placeholder: "Vietnam",
                      error: error.errorCountry,
                    },
                    {
                      title: "Description",
                      key: "description",
                      placeholder: "Club mission and history...",
                      error: error.errorDescription,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="text-label-sm text-surface-nav font-bold uppercase italic mb-1">
                        {item.title}
                      </label>
                      <input
                        onChange={(e) => {
                          setFormTeam({
                            ...formTeam,
                            [item.key]: e.target.value,
                          });
                          setError({
                            errorName: "",
                            errorCountry: "",
                            errorDescription: "",
                          });
                        }}
                        className="w-full py-2 outline-none border-b-2 border-surface-bg text-body-md text-surface-nav focus:border-brand-primary transition-colors placeholder:text-nav-muted/50"
                        type="text"
                        placeholder={item.placeholder}
                        value={formTeam[item.key]}
                      />
                      <span className="text-brand-primary text-label-sm">
                        {item.error}
                      </span>
                    </div>
                  ))}
                </div>

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
          )}

          {activeTab === "members" && (
            <div className="flex flex-col gap-5">
              <div className="bg-surface-white rounded-xl shadow-sm overflow-hidden min-h-[300px]">
                <div className="flex items-center justify-between p-4 md:p-5 border-b border-surface-bg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-primary/10">
                      <FaUsers className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="text-title-sm font-bold text-surface-nav uppercase">
                        Current Members
                      </h4>
                      <p className="text-label-sm text-nav-muted">
                        {members.length} player{members.length !== 1 ? "s" : ""}{" "}
                        in this team
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddForm}
                    disabled={addingMembers}
                    className="flex items-center gap-2 px-4 py-2.5 bg-cta-gradient text-white text-label-sm font-bold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition-all cursor-pointer uppercase tracking-wide disabled:opacity-50"
                  >
                    {addingMembers ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <IoPersonAddSharp className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Member</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 md:p-5">
                  {loadingMembers ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                      <span className="ml-3 text-body-md text-nav-muted">
                        Loading members...
                      </span>
                    </div>
                  ) : members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-surface-bg flex items-center justify-center mb-4">
                        <FaUsers className="w-7 h-7 text-nav-muted/50" />
                      </div>
                      <p className="text-body-md text-nav-muted font-medium">
                        No members in this team yet
                      </p>
                      <p className="text-label-sm text-nav-muted/70 mt-1">
                        Click "Add Member" to create a new player for this team
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
                      {members.map((member) => {
                        const playerId = member.id || member.player_id;
                        const memberName =
                          member.full_name || member.name || "Unknown";
                        const memberAvatar =
                          member.image_url ||
                          member.avatar_url ||
                          member.avatarUrl ||
                          member.avatar;
                        return (
                          <div
                            key={playerId}
                            className="flex items-center gap-3 p-3 rounded-xl bg-surface-bg hover:bg-surface-bg/80 transition-all group"
                          >
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-surface-nav/10 flex-shrink-0 shadow-sm">
                              {memberAvatar ? (
                                <img
                                  src={memberAvatar}
                                  alt={memberName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-surface-nav/40 text-label-sm font-bold">
                                  {memberName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-body-sm font-bold text-surface-nav truncate">
                                {memberName}
                              </p>
                              <p className="text-label-sm text-nav-muted">
                                {member.main_position ||
                                  member.mainPosition ||
                                  member.position ||
                                  "N/A"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveMember(playerId, memberName)
                              }
                              disabled={removingId === playerId}
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-transparent hover:bg-red-50 text-nav-muted hover:text-red-500 transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-50"
                              title="Remove member"
                            >
                              {removingId === playerId ? (
                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <FaUserMinus className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </dialog>

      <FormPlayer
        ref={formPlayerRef}
        mode="add"
        onSubmit={handleCreateNewMember}
      />
    </>
  );
};
export default FormUpdateTeam;
