import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoIosPersonAdd } from "react-icons/io";
import { teamService } from "../services/teamService";
import { players } from "../mock_data";

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    teamService.getTeamById({ url: `/teams/${teamId}`, setData: setTeam });
  }, [teamId]);

  return (
    <>
      <div className="flex flex-col py-6 min-h-screen bg-surface-bg">
        {/* TOP TITLE */}
        <div className="flex items-center justify-between w-[90%] h-[60px] mx-auto my-8">
          <div className="w-[90%]">
            <p className="text-display-md font-extrabold text-surface-nav">
              TEAMS
            </p>
            <div className="w-[9%] h-1 bg-cta-gradient"></div>
          </div>
          <button
            onClick={() => navigate("/teams")}
            className="w-[10%] py-2 bg-surface-nav text-body-lg text-surface-white rounded-[12px] hover:cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            BACK
          </button>
        </div>
        <div className="w-[90%] mx-auto overflow-hidden rounded-[12px]">
          <div className="flex items-center justify-evenly h-[185px] bg-surface-white">
            <div className="flex items-center w-[65%] h-[120px]">
              <img
                className="rounded-[12px]"
                src={team?.logo_url}
                alt=""
                width={96}
                height={96}
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
                  <img
                    className="w-[50%] h-full object-contain"
                    key={index}
                    src={value}
                  />
                );
              })}
            </div>
          </div>
          <div className="bg-surface-bg">
            <div className="flex w-[94%] h-[35px] mx-auto mt-8 ">
              <div className="flex w-[82%] items-center gap-1">
                <MdGroup className="w-[24px] text-brand-primary" />
                <p className="text-body-lg text-surface-nav font-bold">
                  PLAYER
                </p>
              </div>
              <button className="flex items-center gap-1 w-[18%] px-2 bg-surface-white border border-surface-bg rounded-[9999px] hover:cursor-pointer hover:scale-105 transition-transform duration-300">
                <IoIosPersonAdd className="w-[24px] text-surface-nav" />
                <p>ADD PLAYER</p>
              </button>
            </div>
          </div>
          <ul className="flex flex-wrap gap-y-6 justify-between mt-6">
            {players?.map((value, index) => {
              return (
                <li
                  key={index}
                  className="flex items-center gap-2 w-[18%] h-[88px]  bg-surface-white border-s-3 border-s-surface-nav rounded-[6px] hover:border-s-brand-primary hover:cursor-pointer hover:scale-y-105 transition-transform duration-300"
                >
                  <img
                    className="rounded-[9999px]"
                    src={value.avatar}
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div className="w-[70%]">
                    <p className="text-body-md text-surface-nav font-bold">
                      {value.name}
                    </p>
                    <p className="text-body-md text-brand-primary font-bold">
                      {value.position}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
export default TeamDetail;
