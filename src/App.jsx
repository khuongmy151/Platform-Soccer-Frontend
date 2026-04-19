import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import MainLayout from "./pages/MainLayout";
import DashboardPublic from "./pages/DashboardPublic";
import MyProfile from "./pages/MyProfile";
import PlayerManagement from "./pages/PlayerManagement";
import MemberDetail from "./pages/MemberDetail";
import TeamManagement from "./pages/TeamManagement";
import TeamDetail from "./pages/TeamDetail";
import CreateTeam from "./pages/CreateTeam";
import MatchManagement from "./pages/MatchManagement";
import MatchDetail from "./pages/MatchDetail";
import CreateMatch from "./pages/CreateMatch";
import TournamentManagement from "./pages/TournamentManagement";
import TournamentDetail from "./pages/TournamentDetail";
import ProtectedRoute from "./pages/ProtectedRoute";
import { useEffect } from "react";
import { getMe } from "./services/userService";
import { setMe } from "./stores/features/meSlice";
import { setIsLogin } from "./stores/features/authSlice";

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
          <Route
            path="tournament/:tournamentId"
            element={<TournamentDetail />}
          />
          <Route path="teams/:teamId" element={<TeamDetail />} />
          <Route
            path="/teams/:teamId/members/:memberId"
            element={<MemberDetail />}
          />

          {/* PRIVATE: Chỉ Organizer có Token mới vào được */}
          <Route element={<ProtectedRoute />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="players" element={<PlayerManagement />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="teams/create" element={<CreateTeam />} />
            <Route path="matches" element={<MatchManagement />} />
            <Route path="match/create" element={<CreateMatch />} />
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
