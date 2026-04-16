import { createElement } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoTrophyOutline } from "react-icons/io5";
import { MdGroups } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const itemClassDesktop = ({ isActive }) =>
  [
    "flex size-11 items-center justify-center rounded-full transition-all duration-200",
    isActive
      ? "bg-surface-white text-brand-primary shadow-md ring-1 ring-black/5"
      : "bg-transparent text-icon-muted hover:text-slate-600",
  ].join(" ");

const itemClassMobile = ({ isActive }) =>
  [
    "flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-xl transition-all duration-200",
    isActive
      ? "bg-brand-primary/10 text-brand-primary font-bold"
      : "text-nav-muted font-medium",
  ].join(" ");

const items = [
  { to: "/", end: true, label: "DASHBOARD", Icon: TbLayoutDashboard }, // Đổi label uppercase cho giống mẫu
  { to: "/players", label: "PLAYER", Icon: FaUser },
  { to: "/teams", label: "TEAMS", Icon: MdGroups },
  { to: "/tournaments", label: "TOURNAMENT", Icon: IoTrophyOutline },
];

function SideBar() {
  return (
    <>
      {/* SIDEBAR DESKTOP: Hiện từ màn hình md trở lên */}
      <aside
        className="hidden md:flex sticky top-6 z-10 w-[64px] shrink-0 flex-col gap-5 rounded-[1.35rem] bg-surface-card px-2.5 py-5 shadow-sm ring-1 ring-black/5 h-fit"
        aria-label="Sidebar Desktop"
      >
        {items.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={itemClassDesktop}
            title={label}
          >
            {createElement(Icon, {
              className: "size-[22px]",
              "aria-hidden": true,
            })}
          </NavLink>
        ))}
      </aside>

      {/* BOTTOM NAVIGATION MOBILE: Chỉ hiện khi màn hình < md */}
      <nav
        className="md:hidden fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-100 px-2 pb-safe-area-inset-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
        aria-label="Bottom Navigation"
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto">
          {items.map(({ to, end, label, Icon }) => (
            <NavLink key={to} to={to} end={end} className={itemClassMobile}>
              {createElement(Icon, {
                className: "size-6",
                "aria-hidden": true,
              })}
              <span className="text-[10px] tracking-tight uppercase">
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Spacer để nội dung không bị thanh Bottom Bar đè lên trên Mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}

export default SideBar;
