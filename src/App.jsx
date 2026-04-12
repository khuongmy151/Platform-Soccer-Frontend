import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import MainLayout from "./pages/MainLayout";
import DashboardPublic from "./pages/DashboardPublic";
import MyProfile from "./pages/MyProfile";
import TeamManagement from "./pages/TeamManagement";
import TeamDetail from "./pages/TeamDetail";
import PlayerManagement from "./pages/PlayerManagement";

import TournamentManagement from "./pages/TournamentManagement";
import MatchDetail from "./pages/MatchDetail";
import MatchManagement from "./pages/MatchManagement";
import CreateMatch from "./pages/CreateMatch";
import TournamentDetail from "./pages/TournamentDetail";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
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
          <Route path="teams/:teamId" element={<TeamDetail />} />
          <Route
            path="tournament/:tournamentId"
            element={<TournamentDetail />}
          />
          <Route path="players" element={<PlayerManagement />} />
          <Route path="matches" element={<MatchManagement />} />
          <Route path="match/create" element={<CreateMatch />} />
          <Route path="match/:matchId" element={<MatchDetail />} />

          <Route path="tournaments" element={<TournamentManagement />} />

          {/* PRIVATE: Chỉ Organizer có Token mới vào được */}
          <Route element={<ProtectedRoute />}>
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="teams" element={<TeamManagement />} />
            <Route path="player" element={<PlayerManagement />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
