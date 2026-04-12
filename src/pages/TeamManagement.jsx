import { useDispatch, useSelector } from "react-redux";
import { teamService } from "../services/teamService";
import { setTeams } from "../stores/features/teamSlice";
import { useEffect } from "react";
import ListTeam from "../components/ListTeam";
import { IoFilter } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { players } from "../mock_data";

const TeamManagement = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  useEffect(() => {
    teamService.getAllTeam({ url: "/teams", dispatch, func: setTeams });
  }, [dispatch]);
  const handleCreateTeam = () => {};
  return (
    <>
      <div className="flex flex-col min-h-screen bg-surface-bg">
        {/* TOP TITLE */}
        <div className="flex items-center justify-between w-[90%] h-[100px] mx-auto my-8">
          <div className="w-[70%]">
            <p className="text-display-md font-extrabold text-brand-primary">
              TEAM LIST
            </p>
            <p className="text-body-lg text-surface-nav">
              Manage and monitor your professional roster performance
            </p>
          </div>
          <div className="w-[14%] py-4 px-3 bg-surface-white rounded-[12px] border-surface-bg">
            <p className="text-label-sm text-surface-nav">ACTIVE TEAMS</p>
            <p className="text-headline-sm text-surface-panel font-bold">
              {teams?.items?.length}
            </p>
          </div>
          <div className="w-[14%] py-4 px-3 bg-surface-white rounded-[12px] border-surface-bg">
            <p className="text-label-sm text-surface-nav">TOTAL PLAYERS</p>
            <p className="text-headline-sm text-surface-panel font-bold">
              {players.length}
            </p>
          </div>
        </div>
        {/* SEARCH + BUTTON ADD TEAM */}
        <div className="flex items-center w-[90%] h-[80px] mx-auto bg-surface-white rounded-[12px] border border-surface-bg">
          <div className="flex w-[95%] h-[60%] m-auto">
            <div className="flex items-center justify-evenly w-[85%] bg-surface-bg">
              <IoFilter className="w-[5%] text-[24px]" />
              <input
                className="w-[94%] outline-none"
                placeholder="Quick search teams..."
              />
            </div>
            <button
              onClick={handleCreateTeam}
              className="flex items-center w-[15%] rounded-[12px] bg-cta-gradient hover:cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <IoIosAdd className="ms-5 text-[24px]" />
              <p className="text-body-lg text-surface-panel font-bold">
                Add Team
              </p>
            </button>
          </div>
        </div>
        {/* TABLE */}
        <ListTeam data={teams?.items} />
      </div>
    </>
  );
};
export default TeamManagement;
