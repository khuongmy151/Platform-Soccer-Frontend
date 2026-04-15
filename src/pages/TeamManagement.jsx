import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { teamService } from "../services/teamService";
import { deleteTeam, setTeams } from "../stores/features/teamSlice";
import { IoFilter } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { players } from "../mock_data";
import ListTeam from "../components/ListTeam";
import FormTeam from "../components/FormTeam";

const TeamManagement = () => {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const key = searchParams.get("key");
  const [inputValue, setInputValue] = useState(key || "");
  const [isLoading, setIsLoading] = useState(true);
  const formDialog = useRef();

  // GetAllTeam
  useEffect(() => {
    const fetchGetAllTeam = async () => {
      try {
        await teamService.getAllTeam({
          url: "/teams",
          dispatch,
          func: setTeams,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGetAllTeam();
  }, [dispatch]);

  // Hiển thị list team theo điều kiện
  const displayTeams = useMemo(() => {
    if (key)
      return teams?.items?.filter((team) =>
        team.name.toLowerCase().includes(key.toLowerCase())
      );
    return teams?.items;
  }, [key, teams]);

  // Hàm tìm kiếm team theo tên
  const handleSearch = () => {
    if (inputValue !== "") {
      params.set("key", inputValue);
    } else {
      params.delete("key");
    }
    navigate(`?${params.toString()}`);
  };

  const handleCreateTeam = () => {
    handleOpenFormDialog(null);
  };

  const handleOpenFormDialog = (id) => {
    if (id !== null) {
      params.set("teamId", id);
    } else {
      params.delete("teamId");
    }
    navigate(`?${params.toString()}`);
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      teamService.deleteTeam({ id, dispatch, func: deleteTeam });
    }
    alert("Xóa thành công");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-surface-bg">
        {/* TOP TITLE SECTION */}
        <div className="flex items-center justify-between w-[90%] md:h-[100px] mx-auto my-6 md:my-8">
          <div className="w-full md:w-[70%]">
            <p className="text-display-sm md:text-display-md font-extrabold text-brand-primary uppercase tracking-tighter">
              TEAM LIST
            </p>
            <p className="hidden md:block text-body-lg text-surface-nav mt-1">
              Manage and monitor your professional roster performance
            </p>
          </div>
          {/* STATS: Chỉ hiện trên Desktop */}
          <div className="hidden md:block w-[14%] py-4 px-3 bg-surface-white rounded-[12px] border border-header-line shadow-sm">
            <p className="text-label-sm text-surface-nav font-bold">
              ACTIVE TEAMS
            </p>
            <p className="text-headline-sm text-surface-panel font-bold">
              {displayTeams?.length || 0}
            </p>
          </div>
          <div className="hidden md:block w-[14%] py-4 px-3 bg-surface-white rounded-[12px] border border-header-line shadow-sm">
            <p className="text-label-sm text-surface-nav font-bold">
              TOTAL PLAYERS
            </p>
            <p className="text-headline-sm text-surface-panel font-bold">
              {players?.length || 0}
            </p>
          </div>
        </div>
        {/* SEARCH + BUTTON ADD TEAM */}
        <div className="flex items-center w-[90%] h-auto md:h-[80px] mx-auto bg-transparent md:bg-surface-white rounded-[12px] border-none md:border md:border-header-line mb-3">
          <div className="flex w-full md:w-[95%] h-[56px] md:h-[60%] m-auto gap-3 md:gap-0">
            {/* Search Input Container */}
            <div className="flex items-center flex-1 md:w-[85%] bg-surface-white md:bg-surface-bg rounded-2xl md:rounded-none px-4 md:px-5 shadow-sm md:shadow-none border border-header-line md:border-none">
              <IoFilter className="hidden md:block w-[5%] text-[24px] text-icon-muted" />
              <FaSearch className="md:hidden text-icon-muted text-lg shrink-0" />
              <input
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                value={inputValue}
                className="flex-1 md:w-[80%] bg-transparent outline-none ml-3 md:ml-4 text-surface-nav font-medium"
                placeholder="Search team..."
              />
              <FaSearch
                onClick={handleSearch}
                className="hidden md:block text-surface-nav md:mr-4 hover:cursor-pointer hover:scale-125 transition-transform duration-300 shrink-0"
              />
            </div>
            {/* Button Add Team */}
            <button
              onClick={handleCreateTeam}
              className="flex items-center justify-center aspect-square h-full md:aspect-auto md:w-[15%] rounded-[16px] md:rounded-[12px] bg-cta-gradient hover:cursor-pointer hover:scale-105 transition-all duration-300 shrink-0 shadow-lg shadow-brand-primary/20 md:shadow-none"
            >
              <IoIosAdd className="text-[32px] md:text-[24px] md:ms-5 text-white md:text-surface-panel" />
              <p className="hidden md:block text-body-lg text-surface-panel font-bold ml-1">
                Add Team
              </p>
            </button>
          </div>
        </div>
        {/* LIST TEAM*/}
        <ListTeam
          data={displayTeams}
          isLoading={isLoading}
          handleOpenFormDialog={handleOpenFormDialog}
          handleDeleteTeam={handleDeleteTeam}
        />
        {/* MODAL FORM */}
        <FormTeam ref={formDialog} />
      </div>
    </>
  );
};

export default TeamManagement;
