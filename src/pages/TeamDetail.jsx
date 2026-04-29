import { createElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import publicDashboard from "../services/publicDashboardService";
import { MdGroup, MdSportsSoccer } from "react-icons/md";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { MemberDetailContent } from "./MemberDetail";

const unwrapData = (response) => {
  const data = response?.data ?? response;
  return data?.data ?? data?.member ?? data?.player ?? data ?? null;
};

const normalizeMember = (member) => {
  const player = member?.player || member;
  return {
    ...player,
    ...member,
    id: player?.id || member?.player_id || member?.playerId || member?.id,
    name:
      player?.full_name ||
      player?.name ||
      member?.full_name ||
      member?.name ||
      "Unknown Member",
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
    height:
      player?.height_cm ||
      player?.height ||
      member?.height_cm ||
      member?.height ||
      "",
    weight:
      player?.weight_kg ||
      player?.weight ||
      member?.weight_kg ||
      member?.weight ||
      "",
    main_foot:
      player?.preferred_foot ||
      player?.preferredFoot ||
      player?.main_foot ||
      member?.preferred_foot ||
      member?.preferredFoot ||
      member?.main_foot ||
      "",
    position:
      player?.main_position ||
      player?.mainPosition ||
      player?.position ||
      member?.main_position ||
      member?.mainPosition ||
      member?.position ||
      "Unknown",
  };
};

const ImageWithFallback = ({
  src,
  alt,
  className = "",
  icon: Icon,
  iconClassName = "",
}) => {
  const [hasError, setHasError] = useState(false);
  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-bg ${className}`}
      >
        {Icon
          ? createElement(Icon, {
              className: iconClassName || "h-10 w-10 text-surface-nav/20",
            })
          : null}
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
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberLoading, setMemberLoading] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = isPublicRoute
        ? await publicDashboard.getMembersByTeam(teamId)
        : await teamService.getTeamMembers({
            url: `/teams/${teamId}/members`,
          });
      const data = res?.data?.data || res?.data || res || [];
      // Chuẩn hóa dữ liệu ngay khi nhận
      const normalized = Array.isArray(data)
        ? data.map((m) => {
            const p = m?.player || m;
            return {
              ...p,
              ...m,
              id: p?.id || m?.player_id || m?.id,
              name: p?.full_name || p?.name || "Unknown",
              avatar: p?.image_url || p?.avatar_url || p?.avatar || "",
              position: p?.main_position || p?.position || "Unknown",
              number: p?.jersey_number || m?.number || "-",
            };
          })
        : [];
      setPlayersList(normalized);
    } catch (error) {
      if (
        isPublicRoute &&
        error?.response?.data?.code === "TEAM_MEMBERS_NOT_FOUND"
      ) {
        setPlayersList([]);
        return;
      }
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  }, [isPublicRoute, teamId]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (isPublicRoute) {
          const publicTeam = await publicDashboard.getTeamById(teamId);
          setTeam(publicTeam);
          return;
        }

        await teamService.getTeamById({
          url: `/teams/${teamId}`,
          setData: setTeam,
        });
      } catch (error) {
        console.error("Error fetching team detail:", error);
        toast.error("Failed to load team detail");
      }
    };

    fetchTeam();
    fetchMembers();
  }, [isPublicRoute, teamId, fetchMembers]);

  const handleViewMember = async (player) => {
    setIsMemberModalOpen(true);
    setSelectedMember(normalizeMember(player));
    setMemberLoading(true);

    try {
      const response = isPublicRoute
        ? await publicDashboard.getMemberDetailById(teamId, player.id)
        : await teamService.getTeamMemberById({
            url: `/teams/${teamId}/members/${player.id}`,
          });
      const member = unwrapData(response);
      setSelectedMember(
        member ? normalizeMember(member) : normalizeMember(player)
      );
    } catch (error) {
      console.error("Error fetching member detail:", error);
      toast.error("Failed to load member detail");
    } finally {
      setMemberLoading(false);
    }
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="flex flex-col rounded-3xl py-4 md:py-6 bg-surface-white min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between w-[92%] mx-auto mb-6">
        <div className="relative">
          <p className="text-2xl md:text-3xl font-black text-surface-nav tracking-tight">
            TEAMS
          </p>
          <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-cta-gradient"></div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-surface-nav text-surface-white rounded-full hover:scale-110 transition-all"
        >
          <FaArrowLeft size={14} />
        </button>
      </div>

      <div className="w-[92%] mx-auto bg-surface-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* TEAM INFO - Tối ưu cho Tablet bằng cách dùng wrap và điều chỉnh width */}
        <div className="p-5 md:p-8 flex flex-col md:flex-row flex-wrap lg:flex-nowrap items-center md:items-start gap-6 border-b border-gray-50">
          {/* Logo */}
          <div className="shrink-0">
            <ImageWithFallback
              className="h-28 w-28 md:h-32 md:w-32 rounded-2xl object-cover shadow-sm border border-gray-100 p-2"
              src={team?.logo_url}
              icon={MdSportsSoccer}
            />
          </div>

          {/* Text Info */}
          <div className="flex-1 text-center md:text-left min-w-[250px]">
            <h1 className="text-2xl md:text-3xl text-surface-nav font-bold uppercase tracking-tight">
              {team?.name || "Loading..."}
            </h1>
            <p className="text-nav-muted mt-2 text-sm md:text-base leading-relaxed">
              {team?.description || "No description available."}
            </p>
          </div>

          {/* Kits - Ẩn trên mobile, hiện từ tablet nhưng giới hạn kích thước */}
          <div className="hidden md:flex gap-3 h-24 lg:h-28 items-end">
            {team?.kit_url?.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="kit"
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* SECTION PLAYERS */}
        <div className="p-5 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <MdGroup className="text-2xl text-brand-primary" />
              <p className="text-xl font-bold tracking-wide text-surface-nav uppercase">
                Players
              </p>
            </div>
          </div>

          {/* GRID TỐI ƯU: 1 cột (Mobile), 2 cột (Tablet), 3-4 cột (Desktop) */}
          {loading ? (
            <div className="py-20 text-center font-medium text-nav-muted animate-pulse">
              Loading roster...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playersList.map((player, idx) => (
                <div key={player.id} className="group relative">
                  <button
                    onClick={() => handleViewMember(player)}
                    className="w-full flex flex-col rounded-xl overflow-hidden bg-surface-nav shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl focus-visible:-translate-y-2 focus-visible:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  >
                    <div className="relative h-72 sm:h-64 md:h-72 w-full">
                      <ImageWithFallback
                        src={player.avatar}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        icon={FaUserCircle}
                        iconClassName="h-16 w-16 text-white/10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-left">
                        <p className="text-[10px] text-white/70 font-bold tracking-[0.2em] uppercase mb-1">
                          {idx === 0 ? "CAPTAIN" : player.position}
                        </p>
                        <p className="text-xl text-white font-black truncate leading-tight uppercase italic">
                          {player.name}
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-surface-nav shadow-lg">
                          Click to view details
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 border-t border-gray-100">
                      <div className="text-left">
                        <p className="text-[9px] text-nav-muted font-bold uppercase tracking-widest">
                          Position
                        </p>
                        <p className="text-sm font-bold text-surface-nav">
                          {player.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-nav-muted font-bold uppercase tracking-widest">
                          No.
                        </p>
                        <p className="text-sm font-bold text-surface-nav">
                          #{player.number}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SQUAD SIZE */}
          <div className="mt-12 flex justify-end items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-nav-muted uppercase tracking-[0.2em]">
                Squad Size
              </p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-4xl font-black text-surface-nav leading-none">
                  {playersList.length}
                </span>
                <span className="text-xl font-bold text-gray-300 leading-none">
                  / 11
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeMemberModal}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-surface-bg p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <MemberDetailContent
              member={selectedMember}
              loading={memberLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;
