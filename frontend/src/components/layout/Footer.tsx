import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const branches = [
  { name: "Podanur", time: "12pm–11pm" },
  { name: "Sai Baba Colony", time: "4pm–11pm" },
  { name: "Ganapathy", time: "11am–11pm" },
  { name: "RS Puram", time: "12pm–11pm" },
];

const Footer = () => (
  <footer className="bg-[#080808] text-white border-t border-[#1e1e1e]">
    {/* Locations strip (Street Arabiya style) */}
    <div className="bg-[#111111] border-b border-[#1e1e1e]">
      <div className="container py-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-6 bg-[#c9a84c]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">Our Branches</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {branches.map((b) => (
            <div key={b.name} className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              <div>
                <div className="font-semibold text-sm text-white">{b.name}</div>
                <div className="text-xs text-gray-500">{b.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="container py-12">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b6914]">
              <span className="text-lg font-black text-black">F</span>
            </div>
            <div>
              <span className="font-black text-xl text-white">Food</span>
              <span className="font-black text-xl text-[#c9a84c]">Express</span>
            </div>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed mb-5">
            Arabic Authentic Flavors with an Indian Twist. Delivering happiness across Coimbatore and beyond.
          </p>
          {/* Social links */}
          <div className="flex gap-3">
            {[
              { icon: Facebook, href: "#", label: "Facebook" },
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Instagram, href: "#", label: "Instagram" },
              { icon: Youtube, href: "#", label: "YouTube" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2a2a] text-gray-500 hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 font-bold text-sm text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            {[
              { to: "/restaurants", label: "Browse Restaurants" },
              { to: "/offers", label: "Today's Offers" },
              { to: "/about", label: "About Us" },
              { to: "/hotel/register", label: "Partner With Us" },
              { to: "/delivery/register", label: "Become a Rider" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-gray-500 transition-colors hover:text-[#c9a84c] flex items-center gap-1.5 group">
                  <span className="h-px w-3 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/70 transition-all group-hover:w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="mb-4 font-bold text-sm text-white uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5 text-xs">
            {["Terms & Conditions", "Privacy Policy", "Refund Policy", "Cookie Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="text-gray-500 hover:text-[#c9a84c] transition-colors flex items-center gap-1.5 group">
                  <span className="h-px w-3 bg-[#c9a84c]/0 group-hover:bg-[#c9a84c]/70 transition-all group-hover:w-4" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 font-bold text-sm text-white uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-xs text-gray-500">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a84c]" />
              Podanur Main Road, Karuparayan Kovil Stop, Coimbatore, Tamil Nadu
            </li>
            <li className="flex items-center gap-3 text-xs text-gray-500">
              <Phone className="h-4 w-4 text-[#c9a84c] shrink-0" />
              <a href="tel:9629075139" className="hover:text-[#c9a84c] transition-colors">+91 96290 75139</a>
            </li>
            <li className="flex items-center gap-3 text-xs text-gray-500">
              <Mail className="h-4 w-4 text-[#c9a84c] shrink-0" />
              <a href="mailto:support@foodexpress.in" className="hover:text-[#c9a84c] transition-colors">support@foodexpress.in</a>
            </li>
          </ul>

          {/* App badge placeholder */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2a2a2a] text-xs text-gray-500 hover:border-[#c9a84c]/30 transition-colors cursor-pointer">
              <span className="text-base">📱</span>
              <div>
                <div className="text-[10px] text-gray-600">Download on the</div>
                <div className="font-semibold text-white text-xs">App Store</div>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2a2a2a] text-xs text-gray-500 hover:border-[#c9a84c]/30 transition-colors cursor-pointer">
              <span className="text-base">🤖</span>
              <div>
                <div className="text-[10px] text-gray-600">Get it on</div>
                <div className="font-semibold text-white text-xs">Google Play</div>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1e1e1e] pt-6 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} FoodExpress. All rights reserved. Made with ❤️ in Coimbatore</p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500 font-medium">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
