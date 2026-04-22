import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IoNotificationsOutline,
  IoSettingsOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import logoSvg from "../assets/logo.svg";
import { setIsLogin } from "../stores/features/authSlice";
import { toast } from "react-toastify";

const navClass = ({ isActive }) =>
  [
    "border-b-[3px] pb-1 text-label-lg font-semibold uppercase tracking-widest transition-colors font-display",
    isActive
      ? "border-brand-primary text-brand-primary"
      : "border-transparent text-nav-muted hover:text-slate-800",
  ].join(" ");

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    dispatch(setIsLogin(false));
    toast.success("Logout successfully");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-50 flex shrink-0 items-center justify-between gap-6 border-b border-header-line bg-surface-white px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:px-8 sm:py-4">
      {/* LEFT: Menu Toggle (Mobile) & Logo */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-10">
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
          aria-label="Soccer Platform — Home"
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
          <NavLink to="/" end className={navClass}>
            Dashboard
          </NavLink>

          {isLogin && (
            <>
              <NavLink to="/teams" className={navClass}>
                Team
              </NavLink>
              <NavLink to="/tournaments" className={navClass}>
                Tournament
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* RIGHT: Notifications, Settings, Profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button className="hidden size-10 items-center justify-center rounded-xl text-icon-muted transition-colors hover:bg-surface-card sm:flex">
          <IoNotificationsOutline className="size-6" />
        </button>

        {isLogin ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="shrink-0 rounded-full ring-2 ring-pink-100 hover:ring-[#ff4444] transition-all p-0.5 block focus:outline-none"
            >
              <img
                src={
                  me?.avatar_url ||
                  "https://img.icons8.com/nolan/1200/user-default.jpg"
                }
                alt="Avatar"
                className="size-9 rounded-full object-cover sm:size-11"
              />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                  <Link
                    data-umami-event="My profile button click"
                    to="/my-profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ff4444] transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    data-umami-event="Logout button click"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button
              data-umami-event="Login button click"
              className="px-6 py-2 rounded-full font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{
                backgroundImage: "linear-gradient(135deg, #ff4444, #ff8c00)",
              }}
            >
              Login
            </button>
          </Link>
        )}
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="absolute left-0 top-[100%] w-full border-b border-header-line bg-surface-white px-4 py-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-title-md font-bold uppercase tracking-wide transition-all ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-surface-nav hover:bg-surface-bg"
                }`
              }
            >
              Dashboard
            </NavLink>

            {isLogin && (
              <>
                <NavLink
                  to="/teams"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-title-md font-bold uppercase tracking-wide transition-all ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-surface-nav hover:bg-surface-bg"
                    }`
                  }
                >
                  Team
                </NavLink>
                <NavLink
                  to="/tournaments"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-title-md font-bold uppercase tracking-wide transition-all ${
                      isActive
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "text-surface-nav hover:bg-surface-bg"
                    }`
                  }
                >
                  Tournament
                </NavLink>
              </>
            )}

            <div className="mt-2 border-t border-header-line pt-2">
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
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
