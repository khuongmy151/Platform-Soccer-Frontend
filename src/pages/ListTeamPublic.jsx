import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTeams } from "../stores/features/teamSlice";
import { useNavigate } from "react-router-dom";
import { HiOutlineRefresh } from "react-icons/hi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import publicDashboard from "../services/publicDashboardService";
import PublicTeamCard from "../components/PublicTeamCard";

const ListTeamPublic = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams.items || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  // Logic Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 8;

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        await publicDashboard.getAllTeams({
          url: "/public/teams",
          dispatch,
          func: setTeams,
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredTeams = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return teams.filter((team) =>
      `${team.name} ${team.country}`.toLowerCase().includes(lowerSearch)
    );
  }, [teams, search]);

  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  const currentTeams = filteredTeams.slice(
    (currentPage - 1) * teamsPerPage,
    currentPage * teamsPerPage
  );

  // Logic hiển thị tối đa 4 trang với dấu ba chấm (...)
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 3, totalPages);

    if (end - start < 3) {
      start = Math.max(end - 3, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return { pages, hasEllipsis: end < totalPages };
  };

  const { pages, hasEllipsis } = getPaginationGroup();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg text-gray-400 font-display uppercase italic font-bold">
        <HiOutlineRefresh
          className="animate-spin mr-2 text-brand-primary"
          size={24}
        />{" "}
        LOADING...
      </div>
    );

  return (
    <div className="min-h-screen bg-surface-bg font-body pb-16">
      <div className="bg-surface-white border-b border-gray-100 mb-6 pt-10 pb-7 shadow-sm">
        <div className="max-w-[1000px] mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-[12px] font-black text-brand-primary uppercase tracking-widest"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-headline-md font-black text-gray-900 italic uppercase tracking-tighter font-display  ">
            All Teams
          </h1>
        </div>
      </div>

      <main className="max-w-[1000px] mx-auto px-4 md:px-6">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full p-4 rounded-xl bg-surface-white border border-gray-100 outline-none focus:border-brand-primary transition-all font-medium"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Grid Teams - View tĩnh (Không hover) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {currentTeams.map((team) => (
            <PublicTeamCard
              key={team.id}
              team={team}
              onClick={(id) => navigate(`/public/teams/${id}`)}
            />
          ))}
        </div>

        {/* Điều khiển chuyển trang với giới hạn hiển thị 4 số */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (currentPage === 1) setCurrentPage(totalPages + 1);
                setCurrentPage((p) => Math.max(p - 1, 1));
              }}
              className="p-2 rounded-lg border border-gray-200 text-brand-primary disabled:opacity-30 transition-colors hover:bg-gray-100"
            >
              <IoChevronBack size={18} />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-bold text-[13px] transition-all ${
                    currentPage === page
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : "bg-surface-white text-gray-400 border border-gray-100 hover:border-brand-primary/30"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Dấu ba chấm hiển thị nếu còn nhiều trang phía sau */}
              {hasEllipsis && (
                <span className="text-gray-400 font-bold px-1">...</span>
              )}
            </div>

            <button
              onClick={() => {
                if (currentPage === totalPages) setCurrentPage(0);
                setCurrentPage((p) => Math.min(p + 1, totalPages));
              }}
              className="p-2 rounded-lg border border-gray-200 text-brand-primary disabled:opacity-30 transition-colors hover:bg-gray-100"
            >
              <IoChevronForward size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListTeamPublic;
