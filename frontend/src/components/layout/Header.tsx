import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu, ShoppingCart, User, MapPin, ChevronDown,
  Search, Navigation, Loader2, X, Check, Sun, Moon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "sonner";

// ── Popular cities ─────────────────────────────────────────────────────────
const CITIES = [
  "Coimbatore", "Chennai", "Bangalore", "Hyderabad",
  "Mumbai", "Delhi", "Pune", "Kolkata", "Kochi", "Madurai",
];

// ── Helpers ────────────────────────────────────────────────────────────────
// GPS blocked on HTTP over LAN (e.g. 192.168.x.x:8080)
// Only works on localhost or HTTPS
const isSecureContext = () =>
  window.location.protocol === "https:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// ── Location Blocked (HTTP) Modal ──────────────────────────────────────────
function LocationBlockedModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-red-500/30 bg-[#141414] shadow-2xl overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-400 to-red-600" />

        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
              <span className="text-3xl">🔒</span>
            </div>
          </div>

          <h2 className="text-center text-lg font-black text-white mb-1">Location Blocked</h2>
          <p className="text-center text-xs text-gray-400 mb-4 leading-relaxed">
            Your browser blocks GPS on non-secure (HTTP) connections.<br />
            The site is running on <span className="text-red-400 font-semibold">HTTP</span> over local network — GPS requires <span className="text-green-400 font-semibold">HTTPS</span> or localhost.
          </p>

          {/* How to fix */}
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 mb-4">
            <p className="text-xs font-bold text-[#c9a84c] mb-3">How to unblock — choose one:</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-[10px] font-black">1</span>
                <div>
                  <p className="text-xs text-white font-semibold">Use localhost on this PC</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Open <span className="text-[#c9a84c] font-mono">localhost:8080</span> in your desktop browser instead of the IP
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-[10px] font-black">2</span>
                <div>
                  <p className="text-xs text-white font-semibold">Allow insecure location in Chrome</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Address bar → click <span className="text-yellow-400">🔒 Not secure</span> → <span className="text-blue-400">Site settings</span> → Location → <span className="text-green-400">Allow</span> → Refresh page
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a84c]/20 text-[#c9a84c] text-[10px] font-black">3</span>
                <div>
                  <p className="text-xs text-white font-semibold">Or just pick your city below</p>
                  <p className="text-[10px] text-gray-500">GPS not required — select from city list</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-[#2a2a2a] text-gray-300 hover:text-white font-semibold py-3 transition-all text-sm"
          >
            OK — I'll pick a city manually
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Location Permission Consent Modal ──────────────────────────────────────
function LocationPermissionModal({
  onAllow,
  onDeny,
}: {
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.80)", backdropFilter: "blur(8px)" }}
      onClick={onDeny}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-[#c9a84c]/30 bg-[#141414] shadow-2xl shadow-black/80 overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#c9a84c] via-[#f0c060] to-[#c9a84c]" />

        <div className="p-7">
          {/* Animated pin icon */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-24 w-24 rounded-full bg-[#c9a84c]/10 animate-ping" style={{ animationDuration: "2s" }} />
              <span className="absolute h-16 w-16 rounded-full bg-[#c9a84c]/15 animate-ping" style={{ animationDuration: "1.5s", animationDelay: "0.4s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a84c]/25 to-[#8b6914]/10 border border-[#c9a84c]/40">
                <MapPin className="h-9 w-9 text-[#c9a84c]" />
              </div>
            </div>
          </div>

          <h2 className="text-center text-xl font-black text-white mb-1.5">Allow Location Access?</h2>
          <p className="text-center text-sm text-gray-400 mb-5 leading-relaxed">
            FoodExpress would like to use your location to find nearby restaurants,
            accurate delivery times, and the best deals in your area.
          </p>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] p-4 mb-5 space-y-3">
            {[
              { icon: "🍽️", label: "Find restaurants near you" },
              { icon: "⏱️", label: "Real-time delivery estimates" },
              { icon: "🔒", label: "Your data is never stored or shared" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-base shrink-0">{icon}</span>
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              id="allow-location-btn"
              onClick={onAllow}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#b8943d] hover:from-[#d4b050] hover:to-[#c9a84c] text-black font-black py-3.5 text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#c9a84c]/25"
            >
              <Navigation className="h-4 w-4" />
              Allow Location Access
            </button>
            <button
              id="deny-location-btn"
              onClick={onDeny}
              className="w-full rounded-2xl border border-[#2a2a2a] hover:bg-[#1f1f1f] text-gray-400 hover:text-white font-semibold py-3 transition-all text-sm"
            >
              Not Now — I'll choose manually
            </button>
          </div>

          <p className="mt-4 text-center text-[10px] text-gray-600 leading-relaxed">
            Your browser will ask for confirmation next. You can revoke this anytime via browser settings.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Location Picker Dropdown ───────────────────────────────────────────────
function LocationPicker({
  locationName,
  setLocationName,
}: {
  locationName: string;
  setLocationName: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [search, setSearch] = useState("");
  const [showPermModal, setShowPermModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Called AFTER user clicks "Allow" in our modal
  const doGetLocation = () => {
    setShowPermModal(false);

    // Check if GPS is blocked due to HTTP on LAN
    if (!isSecureContext()) {
      setShowBlockedModal(true);
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    setOpen(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state_district ||
            data.address?.state ||
            "Your Location";
          setLocationName(city);
          toast.success(`📍 Location set to ${city}`, {
            style: { background: "#141414", color: "#fff", border: "1px solid #2a2a2a" },
          });
        } catch {
          toast.error("Could not reverse-geocode location. Please select a city manually.");
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        if (err.code === 1) {
          toast.error(
            "❌ Location denied. Tap the 🔒 icon in your browser's address bar → Site Settings → Allow Location, then try again.",
            {
              duration: 8000,
              style: { background: "#1a0808", color: "#fff", border: "1px solid #e23744" },
            }
          );
        } else {
          toast.error("GPS signal weak. Move to an open area or select a city manually.", {
            duration: 5000,
          });
        }
      },
      { timeout: 12000, maximumAge: 60000 }
    );
  };

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* ── HTTP-blocked modal ── */}
      {showBlockedModal && (
        <LocationBlockedModal onClose={() => setShowBlockedModal(false)} />
      )}

      {/* ── Permission consent modal ── */}
      {showPermModal && (
        <LocationPermissionModal
          onAllow={doGetLocation}
          onDeny={() => setShowPermModal(false)}
        />
      )}

      <div ref={ref} className="relative">
        {/* Trigger button */}
        <button
          id="location-picker-btn"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#c9a84c]/50 transition-all group max-w-[160px]"
        >
          {detecting ? (
            <Loader2 className="h-4 w-4 text-[#c9a84c] animate-spin shrink-0" />
          ) : (
            <MapPin className="h-4 w-4 text-[#c9a84c] shrink-0" />
          )}
          <span className="text-sm font-semibold text-white truncate">
            {detecting ? "Detecting…" : locationName}
          </span>
          <ChevronDown
            className={`h-3 w-3 text-gray-400 group-hover:text-[#c9a84c] transition-all shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-[#2a2a2a] bg-[#141414] shadow-2xl shadow-black/60 z-[200] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2a2a2a]">
              <span className="text-sm font-bold text-white">Choose delivery location</span>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-gray-500 hover:text-white transition-colors" />
              </button>
            </div>

            <div className="p-3 space-y-3">
              {/* GPS detect button — shows OUR modal first */}
              <button
                onClick={() => {
                  setOpen(false);
                  setShowPermModal(true);
                }}
                disabled={detecting}
                className="w-full flex items-center gap-3 rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 hover:bg-[#c9a84c]/10 px-4 py-3 transition-all group disabled:opacity-60"
              >
                {detecting ? (
                  <Loader2 className="h-4 w-4 text-[#c9a84c] animate-spin shrink-0" />
                ) : (
                  <Navigation className="h-4 w-4 text-[#c9a84c] group-hover:scale-110 transition-transform shrink-0" />
                )}
                <div className="text-left">
                  <p className="text-sm font-bold text-[#c9a84c]">
                    {detecting ? "Detecting your location…" : "Use Current Location"}
                  </p>
                  <p className="text-xs text-gray-500">Via GPS — most accurate</p>
                </div>
              </button>

              {/* Search cities */}
              <div className="flex items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2">
                <Search className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search city…"
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none"
                  autoFocus
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X className="h-3 w-3 text-gray-500" />
                  </button>
                )}
              </div>

              {/* City list */}
              <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-none">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setLocationName(city);
                        toast.success(`📍 Delivering to ${city}`, {
                          style: { background: "#141414", color: "#fff", border: "1px solid #2a2a2a" },
                        });
                        setOpen(false);
                        setSearch("");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1f1f1f] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className="text-sm text-white">{city}</span>
                      </div>
                      {locationName === city && (
                        <Check className="h-3.5 w-3.5 text-[#c9a84c]" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="py-4 text-center text-xs text-gray-600">No cities found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────
const Header = () => {
  const { openCart, items } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [locationName, setLocationName] = useState("Saravanampatti, Coimbatore");
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (path: string) => loc.pathname === path;
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch(user.role) {
      case "admin": return "/admin/dashboard";
      case "hotel": return "/restaurant/dashboard";
      case "delivery": return "/delivery/dashboard";
      default: return "/user/dashboard";
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#0d0d0d]/98 shadow-2xl border-b border-[#c9a84c]/20"
          : "bg-[#0d0d0d]/95 border-b border-[#c9a84c]/10"
      } backdrop-blur-md`}
    >

      <div className="container flex h-16 items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b6914] shadow-lg shadow-[#c9a84c]/30">
            <span className="text-lg font-black text-black">F</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-xl text-white tracking-tight">Food</span>
            <span className="font-black text-xl text-[#c9a84c] tracking-tight">Express</span>
          </div>
        </Link>

        {/* Location Picker */}
        <LocationPicker locationName={locationName} setLocationName={setLocationName} />

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#c9a84c]/40 rounded-xl px-4 py-2.5 transition-all focus-within:border-[#c9a84c]/60">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines or dishes..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>

        {/* Nav Links */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                isActive(link.href)
                  ? "text-[#c9a84c] bg-[#c9a84c]/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-300 hover:text-white hover:bg-white/5"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fc8019] p-0 text-[10px] text-white border-0">
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Auth */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to={getDashboardLink()}>
                <Button size="sm" className="gap-2 bg-[#00ADB5] hover:bg-[#008a91] text-[#222831] font-semibold">
                  <User className="h-4 w-4" />
                  {user.username || "User"}
                </Button>
              </Link>
              <Button
                variant="ghost" size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-[#c9a84c] hover:text-white hover:bg-[#c9a84c]/10 font-black uppercase tracking-tighter border border-[#c9a84c]/30 rounded-xl px-4 h-9">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold px-4">
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="xl:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-[#0d0d0d] border-[#c9a84c]/20 text-white">
              <div className="mt-6 mb-4">
                <LocationPicker locationName={locationName} setLocationName={setLocationName} />
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "bg-[#c9a84c]/10 text-[#c9a84c]"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-[#c9a84c]/10" />
                {user ? (
                  <>
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#00ADB5] hover:bg-[#008a91] text-[#222831] font-bold">
                        <User className="mr-2 h-4 w-4" /> {user.username}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="mt-2 w-full text-red-400 hover:bg-red-500/10"
                      onClick={() => { localStorage.removeItem("user"); window.location.reload(); }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#c9a84c] hover:bg-[#b8943d] text-black font-black uppercase tracking-widest rounded-xl h-12 shadow-lg shadow-[#c9a84c]/20">
                      <User className="mr-2 h-4 w-4" /> LOGIN / SIGN UP
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
