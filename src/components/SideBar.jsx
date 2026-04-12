import { createElement } from "react";
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoTrophyOutline } from "react-icons/io5";
import { LuActivity, LuChartNoAxesColumn } from "react-icons/lu";

const itemClass = ({ isActive }) =>
  [
    "flex size-11 items-center justify-center rounded-full transition-all duration-200",
    isActive
      ? "bg-surface-white text-brand-primary shadow-md ring-1 ring-black/5"
      : "bg-transparent text-icon-muted hover:text-slate-600",
  ].join(" ");

const items = [
  { to: "/", end: true, label: "Dashboard", Icon: TbLayoutDashboard },
  { to: "/tournaments", label: "Tournaments", Icon: IoTrophyOutline },
  { to: "/teams", label: "Teams", Icon: LuChartNoAxesColumn },
  { to: "/players", label: "Players", Icon: LuActivity },
];

function SideBar() {
  return (
    <aside
      className="sticky top-6 z-10 flex w-[64px] shrink-0 flex-col gap-5 rounded-[1.35rem] bg-surface-card px-2.5 py-5 shadow-sm ring-1 ring-black/5"
      aria-label="Sidebar"
    >
      {items.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to + String(end ?? "")}
          to={to}
          end={end}
          className={itemClass}
          title={label}
          aria-label={label}
        >
          {createElement(Icon, {
            className: "size-[18px]",
            "aria-hidden": true,
          })}
        </NavLink>
      ))}
    </aside>
  );
}

export default SideBar;
