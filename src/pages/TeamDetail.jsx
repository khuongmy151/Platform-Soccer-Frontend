import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { teamService } from "../services/teamService";
import { MdGroup, MdSportsSoccer } from "react-icons/md";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import FormPlayer from "../components/FormPlayer";

const STATUS_STYLES = {
  FIT: "bg-emerald-100 text-emerald-700",
  INJ: "bg-amber-100 text-amber-700",
  SUSP: "bg-rose-100 text-rose-700",
};

const formatStatLabel = (key) => key.replaceAll("_", " ").toUpperCase();

const unwrapData = (response) => {
  const data = response?.data ?? response;
  const members = data?.data ?? data?.members ?? data?.member ?? data;
  return Array.isArray(members) ? members : [];
};

const normalizeMember = (member) => {
  const player = member?.player || member;
  return {
    ...player,
    ...member,
    id: player?.id || member?.player_id || member?.playerId || member?.id,
    name: player?.full_name || player?.name || member?.full_name || member?.name || "Unknown",
    avatar:
      player?.image_url ||
      player?.avatar_url ||
      player?.avatarUrl ||
      player?.avatar ||
      member?.image_url ||
      member?.avatar_url ||
      member?.avatarUrl ||
      member?.avatar ||
      "",
    position:
      player?.main_position ||
      player?.mainPosition ||
      player?.position ||
      member?.main_position ||
      member?.mainPosition ||
      member?.position ||
      "Unknown",
    number:
      player?.jersey_number ||
      player?.number ||
      member?.jersey_number ||
      member?.number ||
      member?.shirt_number ||
      "-",
    status: player?.status || member?.status || "ACTIVE",
  };
};

const ImageWithFallback = ({
  src,
  alt,
  className = "",
  fallbackClassName = "",
  icon,
  iconClassName = "",
}) => {
  const [hasError, setHasError] = useState(false);
  const FallbackIcon = icon;

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center ${
          fallbackClassName || className
        }`}
        aria-label={alt}
      >
        <FallbackIcon className={iconClassName} />
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
    />
  );
};

const TeamDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const isPublicRoute = location.pathname.startsWith("/public/");
  const [team, setTeam] = useState(null);
  const [playersList, setPlayersList] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hoverHint, setHoverHint] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const formPlayerRef = useRef();

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const response = await teamService.getTeamMembers({
        url: `/teams/${teamId}/members`,
      });
      const data = unwrapData(response);
      setPlayersList(Array.isArray(data) ? data.map(normalizeMember) : []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      if (error?.response?.status === 404) {
        setPlayersList([]);
        return;
      }
      toast.error("Failed to load team members");
      setPlayersList([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [teamId]);

  useEffect(() => {
    teamService.getTeamById({ url: `/teams/${teamId}`, setData: setTeam });
    fetchMembers();
  }, [teamId, fetchMembers]);

  const handleAddMember = async (playerFormData) => {
    setAddingMember(true);
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
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (event, playerId) => {
    event.stopPropagation();
    if (!playerId) return;
    setDeletingMemberId(playerId);
    try {
      await teamService.removeTeamMember({
        url: `/teams/${teamId}/members/${playerId}`,
      });
      setSelectedPlayer((current) => (current?.id === playerId ? null : current));
      await fetchMembers();
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setDeletingMemberId(null);
    }
  };

  useEffect(() => {
    if (!selectedPlayer) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPlayer(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPlayer]);

  return (
    <>
      <div className="flex flex-col rounded-3xl py-6 bg-surface-white">
        {/* TOP TITLE */}
        <div className="flex items-center justify-between w-[90%] h-[60px] mx-auto my-0">
          <div className="w-[90%]">
            <p className="text-display-md font-extrabold text-surface-nav">
              TEAMS
            </p>
            <div className="w-[9%] h-1 bg-cta-gradient"></div>
          </div>
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center justify-center w-11 h-11 bg-surface-nav text-surface-white rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-300"
          >
            <FaArrowLeft className="w-[16px] h-[16px]" />
          </button>
        </div>
        <div className="w-[90%] mx-auto overflow-hidden rounded-[12px]">
          <div className="bg-surface-white rounded-[12px] p-6">
            <div className="flex items-center justify-evenly h-[185px] bg-surface-white">
              <div className="flex items-center w-[65%] h-[120px]">
                <ImageWithFallback
                  className="h-24 w-24 rounded-[12px] object-cover"
                  fallbackClassName="h-24 w-24 rounded-[12px] bg-surface-bg text-surface-nav"
                  src={
                    team?.logo_url ||
                    "https://cdn-icons-png.freepik.com/256/11680/11680860.png?semt=ais_white_label"
                  }
                  icon={MdSportsSoccer}
                  iconClassName="h-12 w-12"
                />
                <div className="px-5">
                  <p className="text-headline-md text-surface-nav font-bold">
                    {team?.name}
                  </p>
                  <p>{team?.description}</p>
                </div>
              </div>
              <div className="flex items-end justify-between py-4 w-[30%] h-full">
                {team?.kit_url?.map((value, index) => {
                  return (
                    <ImageWithFallback
                      className="w-[50%] h-full object-contain"
                      fallbackClassName="flex h-full w-[50%] rounded-[12px] bg-white text-surface-nav"
                      key={index}
                      src={value || null}
                      iconClassName="h-14 w-14"
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between h-[48px]">
              <div className="flex items-center gap-2">
                <MdGroup className="w-[24px] text-brand-primary" />
                <p className="text-headline-sm text-surface-nav font-extrabold tracking-wide">
                  PLAYERS
                </p>
              </div>
              {!isPublicRoute && (
                <button
                  type="button"
                  onClick={() => formPlayerRef.current?.showModal()}
                  disabled={addingMember}
                  className="flex items-center gap-2 rounded-[8px] bg-brand-primary px-4 py-2 text-label-sm font-bold uppercase tracking-[0.12em] text-surface-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiPlus className="h-4 w-4" />
                  Add Member
                </button>
              )}
            </div>
            <div className="h-px bg-surface-bg my-6" />
            {loadingMembers ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[12px] bg-surface-bg text-body-lg font-bold text-nav-muted">
                Loading members...
              </div>
            ) : playersList.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[12px] bg-surface-bg text-body-lg font-bold text-nav-muted">
                No members in this team yet
              </div>
            ) : (
            <ul className="flex flex-wrap gap-6">
              {playersList?.map((value, index) => {
                return (
                  <li key={index} className="relative w-[calc((100%-72px)/4)]">
                    <button
                      type="button"
                      onClick={() => navigate(`members/${value.id}`)}
                      onMouseEnter={(event) =>
                        setHoverHint({
                          visible: true,
                          x: event.clientX,
                          y: event.clientY,
                        })
                      }
                      onMouseMove={(event) =>
                        setHoverHint({
                          visible: true,
                          x: event.clientX,
                          y: event.clientY,
                        })
                      }
                      onMouseLeave={() =>
                        setHoverHint((prev) => ({ ...prev, visible: false }))
                      }
                      onBlur={() =>
                        setHoverHint((prev) => ({ ...prev, visible: false }))
                      }
                      className="group relative flex w-full flex-col rounded-[10px] overflow-hidden bg-surface-nav text-left shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
                    >
                      <div className="relative h-[220px] w-full overflow-hidden">
                        <ImageWithFallback
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          fallbackClassName="h-full w-full bg-surface-nav/90 text-surface-white"
                          src={value.avatar}
                          alt={value.name}
                          icon={FaUserCircle}
                          iconClassName="h-20 w-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-nav via-surface-nav/40 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-label-sm text-surface-white/70 font-semibold tracking-[0.15em] uppercase">
                            {index === 0 ? "CAPTAIN" : value.position}
                          </p>
                          <p className="text-headline-sm text-surface-white font-extrabold">
                            {value.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-surface-white px-4 py-3">
                        <div>
                          <p className="text-label-sm text-nav-muted font-semibold tracking-[0.15em] uppercase">
                            POSITION
                          </p>
                          <p className="text-body-md text-surface-nav font-bold">
                            {value.position}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-label-sm text-nav-muted font-semibold tracking-[0.15em] uppercase">
                            NO.
                          </p>
                          <p className="text-body-md text-surface-nav font-bold">
                            #{value.number}
                          </p>
                        </div>
                      </div>
                      <div className="h-1 bg-cta-gradient" />
                    </button>
                    {!isPublicRoute && (
                      <button
                        type="button"
                        onClick={(event) =>
                          handleDeleteMember(event, value.id)
                        }
                        disabled={deletingMemberId === value.id}
                        aria-label={`Remove ${value.name}`}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-white/90 text-brand-primary shadow-md transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            )}
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <p className="text-label-sm text-nav-muted font-semibold tracking-[0.15em] uppercase">
                  TOTAL
                </p>
                <p className="text-headline-md text-surface-nav font-extrabold">
                  {playersList?.length}
                  <span className="text-nav-muted font-semibold"> / 11</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {hoverHint.visible && !selectedPlayer && (
        <div
          className="pointer-events-none fixed z-40 rounded-full bg-surface-white px-3 py-2 text-[12px] font-semibold tracking-[0.08em] text-surface-nav shadow-lg"
          style={{
            left: hoverHint.x + 16,
            top: hoverHint.y + 16,
          }}
        >
          Click to view player details
        </div>
      )}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-nav/70 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedPlayer(null)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[24px] bg-surface-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-detail-title"
          >
            <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="relative min-h-[360px] bg-surface-nav">
                <ImageWithFallback
                  className="h-full w-full object-cover"
                  fallbackClassName="flex h-full min-h-[360px] w-full items-center justify-center bg-surface-nav text-surface-white"
                  src={selectedPlayer.avatar}
                  alt={selectedPlayer.name}
                  icon={FaUserCircle}
                  iconClassName="h-28 w-28"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-nav via-surface-nav/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="text-label-sm font-semibold tracking-[0.15em] text-surface-white/70">
                    #{selectedPlayer.number}
                  </p>
                  <h2
                    id="player-detail-title"
                    className="text-display-sm font-extrabold text-surface-white"
                  >
                    {selectedPlayer.name}
                  </h2>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-surface-nav px-4 py-2 text-label-sm font-bold text-surface-white">
                    {selectedPlayer.position}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 text-label-sm font-bold ${
                      STATUS_STYLES[selectedPlayer.status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {selectedPlayer.status}
                  </span>
                  {selectedPlayer.id === playersList?.[0]?.id && (
                    <span className="rounded-full bg-brand-primary px-4 py-2 text-label-sm font-bold text-surface-white">
                      CAPTAIN
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-label-sm font-semibold tracking-[0.15em] text-nav-muted">
                    PLAYER OVERVIEW
                  </p>
                  <p className="mt-3 text-body-lg text-surface-nav">
                    {selectedPlayer.name} currently plays as a{" "}
                    {selectedPlayer.position.toLowerCase()} for {team?.name}.
                    This popup shows the player profile only after you click on
                    the card.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[16px] bg-surface-bg p-4">
                    <p className="text-label-sm font-semibold tracking-[0.15em] text-nav-muted">
                      JERSEY
                    </p>
                    <p className="mt-2 text-title-lg font-extrabold text-surface-nav">
                      #{selectedPlayer.number}
                    </p>
                  </div>
                  {Object.entries(selectedPlayer.stats || {}).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-[16px] bg-surface-bg p-4"
                      >
                        <p className="text-label-sm font-semibold tracking-[0.15em] text-nav-muted">
                          {formatStatLabel(key)}
                        </p>
                        <p className="mt-2 text-title-lg font-extrabold text-surface-nav">
                          {value}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isPublicRoute && (
        <FormPlayer ref={formPlayerRef} mode="add" onSubmit={handleAddMember} />
      )}
    </>
  );
};
export default TeamDetail;
