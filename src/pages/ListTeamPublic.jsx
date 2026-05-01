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
  const teams = useSelector((state) => state.teams?.items || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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
      `${team.name} ${team.country}`.toLowerCase().includes(lowerSearch),
    );
  }, [teams, search]);

  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  const currentTeams = filteredTeams.slice(
    (currentPage - 1) * teamsPerPage,
    currentPage * teamsPerPage,
  );
  const getPaginationDisplay = () => {
    const total = totalPages;
    if (total <= 3) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, total);
    if (end - start < 2) start = Math.max(end - 2, 1);

    const result = [];
    if (start > 1) {
      result.push(1);
      if (start > 2) result.push("...");
    }
    for (let i = start; i <= end; i++) result.push(i);
    if (end < total) {
      if (end < total - 1) result.push("...");
      result.push(total);
    }
    return result;
  };

  const paginationDisplay = getPaginationDisplay();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-display uppercase italic font-bold">
        <HiOutlineRefresh
          className="animate-spin mr-2 text-brand-primary"
          size={24}
        />
        LOADING...
      </div>
    );

  return (
    <div className="min-h-screen font-body">
      <div className="bg-surface-white py-4">
        <div className="w-full">
          <button
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center text-[12px] font-black text-brand-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-headline-md font-black text-gray-900 uppercase tracking-tighter font-display italic">
            All Teams
          </h1>
        </div>
      </div>
      <main className="w-full ">
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search teams by name or country..."
            className="w-full p-5 rounded-2xl bg-surface-white border border-gray-100 shadow-sm outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium text-lg"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {/* Grid Teams */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8">
          {currentTeams.map((team) => (
            <PublicTeamCard
              key={team.id}
              team={team}
              onClick={(id) => navigate(`/public/teams/${id}`)}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-1 sm:gap-3">
            {/* Lùi 1 trang */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 sm:p-3 rounded-xl border border-gray-200 bg-surface-white text-brand-primary disabled:opacity-30 transition-all hover:bg-brand-primary hover:text-white"
            >
              <IoChevronBack size={20} />
            </button>

            {/* Số trang & dấu "..." */}
            <div className="flex items-center gap-1 sm:gap-2">
              {paginationDisplay.map((item, idx) =>
                typeof item === "number" ? (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(item)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-bold text-[13px] transition-all ${
                      currentPage === item
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-110"
                        : "bg-surface-white text-gray-500 border border-gray-100 hover:border-brand-primary"
                    }`}
                  >
                    {item}
                  </button>
                ) : (
                  <span
                    key={idx}
                    className="text-gray-400 font-bold px-1 text-xl"
                  >
                    ...
                  </span>
                ),
              )}
            </div>

            {/* Tiến 1 trang */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 sm:p-3 rounded-xl border border-gray-200 bg-surface-white text-brand-primary disabled:opacity-30 transition-all hover:bg-brand-primary hover:text-white"
            >
              <IoChevronForward size={20} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListTeamPublic;
