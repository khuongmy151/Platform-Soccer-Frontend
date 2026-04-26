import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import publicDashboard from "../services/publicDashboardService";
import { setTeams } from "../stores/features/teamSlice";
import { HiOutlineRefresh } from "react-icons/hi";
import PublicTeamCard from "./PublicTeamCard";

export default function TeamSection() {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams.items);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicTeams = async () => {
      try {
        await publicDashboard.getAllTeams({
          url: "/public/teams",
          dispatch,
          func: setTeams,
        });
        setLoading(true);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTeams();
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center p-12 text-gray-400">
        <HiOutlineRefresh
          className="animate-spin text-brand-primary"
          size={24}
        />
      </div>
    );

  return (
    <section className="bg-surface-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-headline-sm font-black text-gray-900 uppercase tracking-tighter font-display">
          Teams
        </h2>
        <Link to="/public/teams">
          <button className="bg-brand-primary hover:bg-brand-dark text-white text-[10px] font-bold px-3 md:px-4 py-2 rounded-lg transition-colors uppercase tracking-widest shadow-sm whitespace-nowrap">
            View All
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
        {teams.slice(0, 8).map((team) => (
          <PublicTeamCard
            key={team.id}
            team={team}
            onClick={(id) => navigate(`/public/teams/${id}`)}
          />
        ))}
      </div>
    </section>
  );
}