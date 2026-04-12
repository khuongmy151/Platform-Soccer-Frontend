import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-bg font-body">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-6 md:px-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-header-line bg-surface-white shadow-md">
          <Header />
          <div className="flex min-h-0 flex-1">
            <div className="flex shrink-0 flex-col py-6 pl-5 pr-6 md:pl-6">
              <SideBar />
            </div>
            <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
