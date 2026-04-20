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
    dispatch(func(response?.data || []));
    return response;
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
