import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useSelector } from "react-redux";

function MainLayout() {
  const isLogin = useSelector((state) => state.auth.isLogin);
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden w-full bg-surface-white">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:rounded-3xl border-none md:border md:border-header-line bg-surface-white md:shadow-md">
          <Header />
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            {isLogin && (
              <div className="hidden md:flex shrink-0 flex-col py-6 pl-5 pr-6 md:pl-6">
                <SideBar />
              </div>
            )}
            <main className="min-w-0 flex-1 px-5 py-8 md:px-8 pb-24 md:pb-8">
              <Outlet />
            </main>
            {isLogin && (
              <div className="md:hidden">
                <SideBar />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
