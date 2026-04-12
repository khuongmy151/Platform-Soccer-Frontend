import { axiosClient } from "./axiosClient";

const publicDashboard = {
  getAllTournaments: () => {
    const url = "/public/tournament";
    return axiosClient.get(url);
  },

  getMatchesByTournament: (tournamentId) => {
    const url = `/public/tournament/${tournamentId}/match`;
    return axiosClient.get(url);
  },

};

export default publicDashboard;