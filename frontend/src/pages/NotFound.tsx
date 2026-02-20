import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d]">
      <div className="text-center px-6">
        {/* Big emoji */}
        <div className="text-8xl mb-6 animate-bounce">🍽️</div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-[#c9a84c] leading-none mb-2">404</h1>
        <p className="text-2xl font-bold text-white mb-2">Page Not Found</p>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Looks like this page went out for delivery and never came back!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <button className="inline-flex items-center gap-2 rounded-full bg-[#c9a84c] hover:bg-[#b8943d] text-black font-bold px-8 py-3 transition-all hover:scale-105">
              🏠 Back to Home
            </button>
          </Link>
          <Link to="/restaurants">
            <button className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] text-gray-400 hover:border-[#c9a84c]/40 hover:text-white font-semibold px-8 py-3 transition-all">
              🍴 Browse Restaurants
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
