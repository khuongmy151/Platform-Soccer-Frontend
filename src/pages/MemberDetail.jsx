import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { teamService } from "../services/teamService";
import { Progress } from "antd";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaArrowLeft, FaRulerHorizontal, FaUserCircle } from "react-icons/fa";
import { GiWeightScale } from "react-icons/gi";
import { IoMdBatteryCharging } from "react-icons/io";
import { MdPsychology } from "react-icons/md";
import { RiFootprintFill } from "react-icons/ri";
import { toast } from "react-toastify";

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

export const MemberDetailContent = ({
  member,
  loading = false,
  className = "",
}) => {
  const nameParts = member?.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  const playerInfo = [
    {
      title: "HEIGHT",
      icon: <FaRulerHorizontal className="text-brand-primary" />,
      value: member?.height ? `${member.height} cm` : "Unknown",
    },
    {
      title: "WEIGHT",
      icon: <GiWeightScale className="text-brand-primary" />,
      value: member?.weight ? `${member.weight} kg` : "Unknown",
    },
    {
      title: "MAIN FOOT",
      icon: <RiFootprintFill className="text-brand-primary" />,
      value: member?.main_foot || "Unknown",
    },
  ];

  const attributeRealTime = [
    {
      title: "REFLEX RESPONSE",
      icon: <AiOutlineThunderbolt className="text-green-900" />,
      progressBar: (
        <Progress percent={90} showInfo={false} strokeColor="#14532d" />
      ),
      value: "98.4 ms",
      textColor: "text-green-900",
    },
    {
      title: "TACTICAL AWARENESS",
      icon: <MdPsychology className="text-amber-900" />,
      progressBar: (
        <Progress percent={80} showInfo={false} strokeColor="#78350f" />
      ),
      value: "A GRADE",
      textColor: "text-amber-900",
    },
    {
      title: "NEURAL FATIGUE",
      icon: <IoMdBatteryCharging className="text-brand-primary" />,
      progressBar: (
        <Progress percent={20} showInfo={false} strokeColor="#c8102e" />
      ),
      value: "LOW",
      textColor: "text-brand-primary",
    },
  ];

  if (loading) {
    return (
      <div
        className={`flex min-h-[420px] items-center justify-center rounded-[12px] bg-surface-white text-title-md font-bold text-nav-muted ${className}`}
      >
        Loading member detail...
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-between w-full min-h-[700px] bg-surface-bg ${className}`}
    >
      <div className="flex h-[290px] bg-surface-white overflow-hidden rounded-[12px]">
        <div className="w-[30%] bg-surface-bg">
          {member?.avatar ? (
            <img
              className="w-full h-full object-cover"
              src={member.avatar}
              alt={member.name}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FaUserCircle className="h-20 w-20 text-surface-nav/20" />
            </div>
          )}
        </div>
        <div className="w-[70%]">
          <div className="w-[92%] h-[164px] mt-6 m-auto">
            <div className="flex flex-col">
              <p className="text-title-md text-brand-primary font-bold">
                MEMBER NAME
              </p>
              <p className="text-display-lg text-surface-nav font-extrabold">
                {firstName || ""}
              </p>
              <p className="text-display-lg text-brand-primary font-extrabold">
                {lastName || ""}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-end w-[92%] h-[67px] m-auto">
            <div>
              <p className="text-label-sm text-nav-muted font-bold">
                POSITION
              </p>
              <p className="text-title-lg text-surface-nav font-bold">
                {member?.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between h-[385px]">
        <div className="flex flex-col justify-between w-[33%] h-[60%] py-6 px-1 bg-surface-white rounded-[12px]">
          <div className="w-[85%] mx-auto border-l-4 border-l-brand-primary">
            <p className="ms-4 text-title-sm text-nav-muted font-bold">
              BASIC INFORMATION
            </p>
          </div>
          <div className="flex flex-col justify-between w-[85%] h-[75%] mx-auto">
            {playerInfo.map((item) => (
              <div key={item.title} className="flex justify-between gap-4">
                <div className="flex items-center gap-1">
                  <div className="p-2 rounded-[4px] bg-surface-bg">
                    {item.icon}
                  </div>
                  <p className="text-title-sm text-nav-muted font-medium">
                    {item.title}
                  </p>
                </div>
                <p className="text-body-lg text-surface-nav font-bold">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-evenly w-[64%] h-[90%] rounded-[12px] bg-surface-white">
          <div className="w-[90%] mx-auto border-l-4 border-l-brand-primary">
            <p className="ms-4 text-title-sm text-nav-muted font-bold">
              REALTIME ATTRIBUTES
            </p>
          </div>
          <div className="flex flex-col justify-between w-[90%] h-[62%] mx-auto">
            {attributeRealTime.map((item) => (
              <div key={item.title}>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    {item.icon}
                    <p className="text-body-md text-nav-muted font-bold">
                      {item.title}
                    </p>
                  </div>
                  <p className={`text-body-lg font-extrabold ${item.textColor}`}>
                    {item.value}
                  </p>
                </div>
                {item.progressBar}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MemberDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { teamId } = useParams();
  const { memberId } = useParams();
  const isPublicRoute = location.pathname.startsWith("/public/");
  const [memberWithId, setMemberWithId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const response = await teamService.getTeamMemberById({
          url: `/teams/${teamId}/members/${memberId}`,
        });
        const member = unwrapData(response);
        setMemberWithId(member ? normalizeMember(member) : null);
      } catch (error) {
        console.error("Error fetching member detail:", error);
        toast.error("Failed to load member detail");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [teamId, memberId]);

  return (
    <>
      <div className="w-full bg-surface-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <button
            onClick={() =>
              navigate(isPublicRoute ? `/public/teams/${teamId}` : `/teams/${teamId}`)
            }
            className="flex items-center gap-2 text-surface-nav font-display font-bold uppercase tracking-widest text-label-lg hover:opacity-70 transition-all"
          >
            <FaArrowLeft size={14} /> BACK
          </button>
        </div>
        <MemberDetailContent
          member={memberWithId}
          loading={loading}
          className="max-w-4xl"
        />
      </div>
    </>
  );
};
export default MemberDetail;
