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

  getAllTeams: () => {
    const url = `/public/teams`;
    return axiosClient.get(url);
  },

  getMembersByTeam: (teamId) => {
    const url = `/public/tournament/${teamId}/members`;
    return axiosClient.get(url);
  },

  getMemberDetailById: (teamId, playerId) => {
    const url = `/public/tournament/${teamId}/members/${playerId}`;
    return axiosClient.get(url);
  },
};

export default publicDashboard;