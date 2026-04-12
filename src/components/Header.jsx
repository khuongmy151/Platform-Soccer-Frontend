import { Link, NavLink } from "react-router-dom";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import logoSvg from "../assets/logo.svg";
import { useSelector } from "react-redux";
const navItems = [
  { to: "/", end: true, label: "Dashboard" },
  { to: "/players", label: "Players" },
  { to: "/teams", label: "Teams" },
  { to: "/tournaments", label: "Tournaments" },
];

const navClass = ({ isActive }) =>
  [
    "border-b-[3px] pb-1 text-label-lg font-semibold uppercase tracking-widest transition-colors font-display",
    isActive
      ? "border-brand-primary text-brand-primary"
      : "border-transparent text-nav-muted hover:text-slate-800",
  ].join(" ");

function Header() {
  const { profileData } = useSelector((state) => state.user);
  return (
    <header className="flex shrink-0 items-center justify-between gap-6 border-b border-header-line bg-surface-white px-6 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 no-underline"
          aria-label="Soccer Platform — Trang chủ"
        >
          <img
            src={logoSvg}
            alt=""
            className="h-10 w-auto shrink-0 object-contain sm:h-11"
            width={44}
            height={44}
          />
          <div className="hidden min-w-0 sm:block">
            <p className="font-display text-lg font-bold leading-tight tracking-tight sm:text-xl">
              <span className="text-brand-primary">Soccer</span>{" "}
              <span className="text-brand-accent">Platform</span>
            </p>
          </div>
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-6 overflow-x-auto md:flex lg:gap-8"
          aria-label="Điều hướng chính"
        >
          {navItems.map(({ to, end, label }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-xl text-icon-muted transition-colors hover:bg-surface-card hover:text-slate-700"
          aria-label="Thông báo"
        >
          <IoNotificationsOutline className="size-6" aria-hidden />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-primary ring-2 ring-surface-white" />
        </button>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-xl text-icon-muted transition-colors hover:bg-surface-card hover:text-slate-700"
          aria-label="Cài đặt"
        >
          <IoSettingsOutline className="size-6" aria-hidden />
        </button>
      <Link 
          to="/my-profile" 
          className="ml-1 shrink-0 rounded-full hover:ring-2 hover:ring-brand-primary transition-all"
          aria-label="Trang cá nhân"
        >
          <img
            src={profileData?.avatarUrl || "https://i.pravatar.cc/150?img=11"}
            alt="Ảnh đại diện"
            className="size-10 rounded-full object-cover sm:size-11"
            width={44}
            height={44}
            referrerPolicy="no-referrer"
            // Nhớ thêm src={...} vào đây để hiện ảnh nhé
          />
        </Link>
      </div>
    </header>
  );
}

export default Header;
