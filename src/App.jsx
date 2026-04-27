import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import MainLayout from "./pages/MainLayout";
import DashboardPublic from "./pages/DashboardPublic";
import MyProfile from "./pages/MyProfile";
import TeamManagement from "./pages/TeamManagement";
import TeamDetail from "./pages/TeamDetail";
import MemberDetail from "./pages/MemberDetail";
import CreateTeam from "./pages/CreateTeam";
import MatchManagement from "./pages/MatchManagement";
import UpdateMatch from "./pages/UpdateMatch";
import CreateMatch from "./pages/CreateMatch";
import MatchDetail from "./pages/MatchDetail";
import TournamentManagement from "./pages/TournamentManagement";

import ProtectedRoute from "./pages/ProtectedRoute";
import { useEffect } from "react";
import { getMe } from "./services/userService";
import { setMe } from "./stores/features/meSlice";
import { setIsLogin } from "./stores/features/authSlice";
import ListTeamPublic from "./pages/ListTeamPublic";
import TournamentDetail from "./pages/TournamentDetail";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchGetMe = async () => {
      try {
        await getMe({ url: "/users", dispatch, func: setMe });
        dispatch(setIsLogin(true));
      } catch (error) {
        console.log("Có lỗi xảy ra", error);
      }
    };
    fetchGetMe();
  }, [dispatch]);
  return (
    <>
      <Routes>
        {/* PUBLIC: Ngoài Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* MAIN LAYOUT */}
        <Route path="/" element={<MainLayout />}>
          {/* PUBLIC: Ai cũng xem được */}
          <Route index element={<DashboardPublic />} />
          <Route path="public/tournaments/:tournamentId" element={<TournamentDetail />} />
          <Route path="public/teams" element={<ListTeamPublic />} />
          <Route path="public/teams/:teamId" element={<TeamDetail />} />
          <Route path="public/teams/:teamId/members/:memberId" element={<MemberDetail />} />

          {/* PRIVATE: Chỉ Organizer có Token mới vào được */}
          <Route element={<ProtectedRoute />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="teams/create" element={<CreateTeam />} />
            <Route path="teams/:teamId" element={<TeamDetail />} />
            <Route path="teams/:teamId/members/:memberId" element={<MemberDetail />} />
            <Route path="matches/:tournamentId" element={<MatchManagement />} />
            <Route
              path="match/:tournamentId/create"
              element={<CreateMatch />}
            />
            <Route path="match/:matchId/update" element={<UpdateMatch />} />
            <Route path="match/:matchId" element={<MatchDetail />} />
            <Route path="tournaments" element={<TournamentManagement />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={1000} />
    </>
  );
}

export default App;
