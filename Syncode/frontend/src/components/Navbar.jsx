import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

/**
 * showNavLinks = true  -> Home page (shows Features, etc.)
 * showNavLinks = false -> Other Page page (no nav links)
 */
const Navbar = ({ showNavLinks = true }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    isAuthenticated().then(setLoggedIn);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-800 px-6 sm:px-10 lg:px-20 py-3 transition-all ${
        scrolled
          ? "bg-[#102218] backdrop-blur-md"
          : "bg-[#102218] backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* LEFT: LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 text-[#11d462]">
            <svg fill="none" viewBox="0 0 48 48">
              <path
                d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            SynCode AI
          </h2>
        </div>

        {/* CENTER: NAV LINKS (HOME PAGE ONLY) */}
        {showNavLinks && (
          <nav className="hidden md:flex gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#features"
              className="text-white hover:text-[#11d462] transition"
            >
              Features
            </a>
            <a
              href="#howitworks"
              className="text-white hover:text-[#11d462] transition"
            >
              How It Works
            </a>
            <a
              href="#comparison"
              className="text-white hover:text-[#11d462] transition"
            >
              Comparison
            </a>
            <a
              href="#security"
              className="text-white hover:text-[#11d462] transition"
            >
              Security
            </a>
          </nav>
        )}

        {/* RIGHT: AUTH BUTTONS */}
        <div className="flex gap-2">
          {loggedIn ? (
            <Button
              size="sm"
              className="bg-red-600 hover:scale-110 hover:bg-red-500"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="hover:scale-110 hover:bg-yellow-500"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>

              <Button
                size="sm"
                className="bg-[#11d462] hover:scale-110 hover:bg-[#14e96d]"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
