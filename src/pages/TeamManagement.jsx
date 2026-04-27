import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { teamService } from "../services/teamService";
import { deleteTeam, setTeams } from "../stores/features/teamSlice";
import { toast } from "react-toastify";
import { IoFilter } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { FaSearch, FaCircleNotch } from "react-icons/fa";
import { players } from "../mock_data";
import ListTeam from "../components/ListTeam";
import FormUpdateTeam from "../components/FormUpdateTeam";
import ConfirmDialog from "../components/ConfirmDialog";

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const key = searchParams.get("key");
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const [teamById, setTeamById] = useState(null);
  const [inputValue, setInputValue] = useState(key || "");
  const [isLoading, setIsLoading] = useState(true);
  const formDialog = useRef();
  const confirmDialog = useRef();

  //Hàm lấy danh sách tất cả đội bóng của organizer
  useEffect(() => {
    const fetchGetAllTeam = async () => {
      try {
        await teamService.getAllTeam({
          url: "/teams",
          dispatch,
          func: setTeams,
        });
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGetAllTeam();
  }, [dispatch]);

  //Hàm hiển thị list team theo điều kiện
  const displayTeams = useMemo(() => {
    if (key)
      return teams?.items?.filter((team) =>
        `${team.name} ${team.country}`.toLowerCase().includes(key.toLowerCase())
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

  //Hàm mở Form Edit
  const handleOpenFormDialog = (id) => {
    if (id !== null) {
      params.set("teamId", id);
    } else {
      params.delete("teamId");
    }
    navigate(`?${params.toString()}`);
  };

  //Hàm mở hộp thoại xác nhận
  const handleOpenConfirmDialog = (id) => {
    setTeamById(teams?.items?.find((value) => value.id == id));
    confirmDialog.current.showModal();
  };

  //Hàm xóa team
  const handleDeleteTeam = async () => {
    try {
      await teamService.deleteTeam({ url: `/teams/${teamById?.id}` });
      await teamService.getAllTeam({ url: "/teams", dispatch, func: setTeams });
      confirmDialog.current.close();
    } catch (error) {
      console.error("Delete error:", error);
      dispatch(deleteTeam(teamById?.id));
      toast.success("Server error, temporarily removed from Frontend");
      confirmDialog.current.close();
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-surface-bg rounded-[12px]">
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
        <div className="flex items-center justify-between w-[90%] mx-auto mb-6 gap-4 mt-2">
          {/* Search Input Container */}
          <div className="flex items-center w-[75%] md:flex-1 h-[56px] bg-surface-white rounded-[16px] px-5 shadow-sm border border-header-line transition-all hover:border-brand-primary/50 focus-within:border-brand-primary focus-within:shadow-md">
            <IoFilter className="hidden md:block w-5 h-5 text-icon-muted" />
            <FaSearch
              onClick={handleSearch}
              className="md:hidden text-icon-muted text-lg shrink-0"
            />
            <input
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              value={inputValue}
              className="flex-1 bg-transparent outline-none ml-4 text-surface-nav font-medium placeholder:text-nav-muted"
              placeholder="Search team..."
            />
            <FaSearch
              onClick={handleSearch}
              className="hidden md:block w-5 h-5 text-surface-nav hover:cursor-pointer hover:text-brand-primary hover:scale-110 transition-all duration-300 shrink-0"
            />
          </div>
          {/* Button Add Team */}
          <button
            data-umami-event="Add team button click"
            onClick={() => navigate("/teams/create")}
            className="flex items-center justify-center h-[56px] px-3 md:px-7 rounded-[16px] bg-cta-gradient hover:scale-[1.03] active:scale-95 transition-all duration-300 shrink-0 shadow-lg shadow-brand-primary/25 cursor-pointer text-white border border-[#ba0022]/20"
          >
            <IoIosAdd className="text-[28px] shrink-0" />
            <span className="hidden md:block text-body-lg font-bold ml-1.5 tracking-wide uppercase mt-[2px]">
              Add Team
            </span>
          </button>
        </div>
        {/* LIST TEAM*/}
        {isLoading ? (
          <div className="flex gap-2 items-center w-[20%] mt-3 mx-auto">
            <FaCircleNotch className="animate-spin" />
            <p>Loading...</p>
          </div>
        ) : (
          <ListTeam
            data={displayTeams}
            handleOpenFormDialog={handleOpenFormDialog}
            handleOpenConfirmDialog={handleOpenConfirmDialog}
          />
        )}
        {/* MODAL FORM */}
        <FormUpdateTeam ref={formDialog} />
        <ConfirmDialog
          message="Are you sure you want to delete this team?"
          ref={confirmDialog}
          handleConfirm={handleDeleteTeam}
        />
      </div>
    </>
  );
};

export default TeamManagement;
