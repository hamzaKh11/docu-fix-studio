import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, LogOut, FileText, BotMessageSquare, FileUp } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const AppHeader = () => {
  const { user, signOut } = useAuth();

  const navLinks = [
    { to: "/app", text: "CV Builder", icon: <FileUp className="w-4 h-4" /> },
    {
      to: "/app/optimize-cv",
      text: "Optimize CV",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      to: "/app/generate-message",
      text: "AI Assistant",
      icon: <BotMessageSquare className="w-4 h-4" />,
    },
  ];

  const activeLinkClass = "text-primary bg-primary/10";
  const inactiveLinkClass =
    "text-muted-foreground hover:text-primary hover:bg-muted";

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Desktop: Logo on the left */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/app" className="text-2xl font-bold text-accent">
            ATSmooth
          </Link>
        </div>

        {/* Mobile: Hamburger Menu on the left */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4">
              <div className="flex justify-between items-center mb-8">
                <Link to="/app" className="text-2xl font-bold text-accent">
                  ATSmooth
                </Link>
              </div>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/app"}
                      className={({ isActive }) =>
                        // FIX: Added whitespace-nowrap to the flex container itself
                        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                          isActive ? activeLinkClass : inactiveLinkClass
                        }`
                      }
                    >
                      {link.icon}
                      <span>{link.text}</span>
                    </NavLink>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile: Centered Logo */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <Link to="/app" className="text-2xl font-bold text-accent">
            CVCraft
          </Link>
        </div>

        {/* Desktop: Centered Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/app"}
              className={({ isActive }) =>
                // FIX: Added whitespace-nowrap here as well for consistency
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              {link.icon}
              <span>{link.text}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info and Logout */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground hidden sm:block whitespace-nowrap">
            {user?.user_metadata.full_name || user?.email}
          </p>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
