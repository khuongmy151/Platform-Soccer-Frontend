import { useState } from "react"; // Thêm useState
import { Link, NavLink } from "react-router-dom";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5"; // Thêm icon menu
import logoSvg from "../assets/logo.svg";
import { useSelector } from "react-redux";

const navItems = [
  { to: "/", end: true, label: "Dashboard" },
  { to: "/players", label: "Player" },
  { to: "/teams", label: "Team" },
  { to: "/tournaments", label: "Tournament" },
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State quản lý menu mobile

  return (
    <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between gap-6 border-b border-header-line bg-surface-white px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-8 sm:py-4">
      {/* LEFT: Menu Toggle (Mobile) & Logo */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-10">
        {/* Nút 3 gạch cho Mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex size-10 items-center justify-center rounded-xl text-brand-primary transition-colors hover:bg-surface-card md:hidden"
        >
          {isMenuOpen ? (
            <IoCloseOutline className="size-8" />
          ) : (
            <IoMenuOutline className="size-8" />
          )}
        </button>

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 no-underline sm:gap-3"
          aria-label="Soccer Platform — Trang chủ"
        >
          <img
            src={logoSvg}
            alt=""
            className="h-8 w-auto shrink-0 object-contain sm:h-11"
          />
          <div className="min-w-0 sm:block">
            <p className="font-display text-lg font-extrabold leading-tight tracking-tight sm:text-xl uppercase italic text-brand-primary">
              Soccer <span className="text-brand-accent">Platform</span>
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden min-w-0 items-center gap-6 overflow-x-auto md:flex lg:gap-8">
          {navItems.map(({ to, end, label }) => (
            <NavLink key={to} to={to} end={end} className={navClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* RIGHT: Notifications, Settings, Profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button className="hidden size-10 items-center justify-center rounded-xl text-icon-muted transition-colors hover:bg-surface-card sm:flex">
          <IoNotificationsOutline className="size-6" />
        </button>

        <Link
          to="/my-profile"
          className="shrink-0 rounded-full ring-2 ring-pink-100 hover:ring-brand-primary transition-all p-0.5"
        >
          <img
            src={profileData?.avatarUrl || "https://i.pravatar.cc/150?img=11"}
            alt="Avatar"
            className="size-9 rounded-full object-cover sm:size-11"
          />
        </Link>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="absolute left-0 top-[100%] w-full border-b border-header-line bg-surface-white px-4 py-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-2">
            {navItems.map(({ to, end, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setIsMenuOpen(false)} // Đóng menu khi bấm chuyển trang
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-title-md font-bold uppercase tracking-wide transition-all ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-surface-nav hover:bg-surface-bg"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-header-line pt-2">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-3 font-bold text-surface-nav opacity-70"
              >
                <IoSettingsOutline className="size-5" /> Settings
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
