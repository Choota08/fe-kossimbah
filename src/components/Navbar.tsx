import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ClipboardList, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth-temp";

/* =====================
   NAV LINKS BASE
===================== */
const baseNavLinks = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/kos", label: "Cari Kamar", icon: Search },
];

export function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const loggedIn = !!user;
  const isAdmin = user?.role === "admin";

  /* =====================
     NAV LINKS DESKTOP
  ===================== */
  const navLinks = [
    ...baseNavLinks,
    ...(loggedIn && !isAdmin
      ? [{ href: "/history", label: "History", icon: History }]
      : []),
    ...(loggedIn && isAdmin
      ? [{ href: "/booking", label: "Booking", icon: ClipboardList }]
      : []),
  ];

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="
        fixed top-0 left-0 right-0 z-50
        bg-transparent
        backdrop-blur-md
        border-b border-white/10
      "
    >
      <nav className="container mx-auto px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-luxury-navy/80 flex items-center justify-center">
            <img src="/image/logoowl.png" alt="logo" className="w-7 h-7" />
          </div>
          <span className="font-serif font-semibold text-xl tracking-wide text-foreground">
            Kos<span className="text-gold">Simbah</span>
          </span>
        </Link>

        {/* MENU */}
        <div className="flex items-center gap-10">
          {navLinks.map((link) => {
            const active = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  active
                    ? "text-gold"
                    : "text-foreground/80 hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* AUTH */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/30 text-foreground"
                  >
                    Admin
                  </Button>
                </Link>
              )}

              <Link to="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-foreground"
                >
                  Profil
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="text-foreground"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-foreground"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="gold" size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
