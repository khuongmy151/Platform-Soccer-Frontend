import { IoArrowBack, IoLocationOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import publicDashboard from "../services/publicDashboardService";

const TournamentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    const fetchTournamentDetail = async () => {
      if (!id) {
        setError(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      try {
        const response = await publicDashboard.getMatchesByTournament(id);
        const detail = response?.data?.tournament || null;
        const matches = Array.isArray(response?.data?.matches)
          ? response.data.matches
          : [];
        setTournament(detail);
        setMatchCount(matches.length);
      } catch (fetchError) {
        console.error("Fetch tournament detail error:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentDetail();
  }, [id]);

  const formatDate = (dateTimeStr) => {
    if (!dateTimeStr) return "TBD";
    const dt = new Date(dateTimeStr);
    if (Number.isNaN(dt.getTime())) return "TBD";
    return dt.toLocaleDateString("en-GB");
  };

  const resolveTournamentLogo = (logoUrl) => {
    if (!logoUrl) return "";
    if (/^(https?:)?\/\//i.test(logoUrl)) return logoUrl;
    return `https://backend.cupzone.fun/${logoUrl.replace(/^\/+/, "")}`;
  };

  const tournamentLogo = resolveTournamentLogo(tournament?.logo_url);

  const tournamentInfoRows = [
    { label: "Tournament Name", value: tournament?.name || "N/A" },
    { label: "Format", value: tournament?.format || "N/A" },
    { label: "Start Date", value: formatDate(tournament?.start_date) },
    { label: "End Date", value: formatDate(tournament?.end_date) },
    { label: "Status", value: tournament?.status || "N/A" },
    { label: "Total Matches", value: String(matchCount) },
    {
      label: "Location",
      value: "Updating",
      isLocation: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] px-4 py-12 md:px-16 lg:px-32">
      <div className="mx-auto max-w-[896px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-10 inline-flex items-center gap-3 rounded-xl px-2 py-2 text-[20px] font-bold uppercase tracking-[-0.5px] text-[#2c2f32] transition-colors hover:bg-white/60"
        >
          <IoArrowBack size={18} />
          <span>Back</span>
        </button>

        <section className="w-full rounded-[12px] border border-[rgba(171,173,177,0.1)] bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:flex md:items-center md:gap-8 md:p-8">
          <div className="mb-6 h-36 w-36 overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] md:mb-0 md:h-40 md:w-40">
            {tournamentLogo ? (
              <img
                src={tournamentLogo}
                alt={`${tournament?.name || "Tournament"} logo`}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : null}
          </div>
          <h1 className="bg-linear-to-r from-[#ff0033] via-[#ff6d00] to-[#ffea00] bg-clip-text text-[42px] font-black leading-none tracking-[-1.8px] text-transparent md:text-[48px] md:tracking-[-2.4px]">
            {loading ? "Loading..." : tournament?.name || "Tournament Detail"}
          </h1>
        </section>

        <section className="pt-12">
          <div className="mb-8 flex items-center border-l-4 border-[#ba0022] pl-5">
            <h2 className="text-[24px] font-medium leading-8 tracking-[-0.6px] text-[#2c2f32]">
              Thông tin giải đấu
            </h2>
          </div>

          {error ? (
            <div className="rounded-lg bg-white px-4 py-6 text-base text-[#ba0022]">
              Cannot load tournament detail. Please try again.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg">
              {tournamentInfoRows.map((row, index) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between gap-4 px-4 py-5 ${
                    index % 2 === 0 ? "bg-[#eff1f5]" : "bg-white"
                  }`}
                >
                  <span className="text-base text-[#595c5f]">{row.label}</span>
                  {row.isLocation ? (
                    <span className="inline-flex items-center gap-1 text-base font-semibold text-[#2c2f32]">
                      <IoLocationOutline size={14} className="text-[#ff0033]" />
                      {row.value}
                    </span>
                  ) : (
                    <span className="text-base font-semibold text-[#2c2f32]">
                      {loading ? "Loading..." : row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TournamentDetail;
