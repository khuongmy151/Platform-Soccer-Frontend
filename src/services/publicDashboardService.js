import { axiosClient } from "./axiosClient";

const publicDashboard = {
  getAllTournaments: async ({ url, dispatch, func }) => {
    const response = await axiosClient.get(`${url}`);
    console.log(response);
    dispatch(func(response?.data || []));
    return response;
  },

  getMatchesByTournament: (tournamentId) => {
    const url = `/public/tournament/${tournamentId}/match`;
    return axiosClient.get(url);
  },

  getAllTeams: async ({ url, dispatch, func }) => {
    const response = await axiosClient.get(`${url}`);
    console.log(response);
    dispatch?.(func?.(response?.data || []));
    return response;
  },

  getTeamById: async (teamId) => {
    const response = await axiosClient.get("/public/teams");
    const teams = response?.data || [];
    return teams.find((team) => team.id === teamId) || null;
  },

  getMembersByTeam: (teamId) => {
    const url = `/public/teams/${teamId}/members`;
    return axiosClient.get(url);
  },

  getMemberDetailById: (teamId, playerId) => {
    const url = `/public/teams/${teamId}/members/${playerId}`;
    return axiosClient.get(url);
  },
};

export default publicDashboard;
