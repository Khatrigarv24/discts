import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignInButton, useAuth } from '@clerk/clerk-react';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  // Initialize theme based on localStorage or default to dark
  useEffect(() => {
    // Check if there's a stored preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = storedTheme === 'dark' || 
      (storedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Apply the theme
    setIsDarkTheme(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-foreground">DISCTS</Link>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    to="/" 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-accent hover:text-accent-foreground",
                      location.pathname === '/' && "bg-accent text-accent-foreground"
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {/* Inventory with Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "bg-transparent hover:bg-accent hover:text-accent-foreground",
                  location.pathname.startsWith('/inventory') && "bg-accent text-accent-foreground"
                )}>
                  Inventory
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover border-border">
                  <ul className="grid w-[220px] gap-3 p-4">
                    <li>
                      <Link to="/inventory" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium text-popover-foreground">All Inventory</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/inventory/categories" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium text-popover-foreground">Categories</div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {/* Management with Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "bg-transparent hover:bg-accent hover:text-accent-foreground",
                  location.pathname.startsWith('/management') && "bg-accent text-accent-foreground"
                )}>
                  Management
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover border-border">
                  <ul className="grid w-[220px] gap-3 p-4">
                    <li>
                      <Link to="/management/reports" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium text-popover-foreground">Reports</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/management/users" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium text-popover-foreground">Users</div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/management/settings" className="block select-none space-y-1 rounded-md p-3 hover:bg-accent">
                        <div className="text-sm font-medium text-popover-foreground">Settings</div>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                {/* Fix: Use asChild to prevent nested <a> tags */}
                <NavigationMenuLink asChild>
                  <Link 
                    to="/about"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-accent hover:text-accent-foreground",
                      location.pathname === '/about' && "bg-accent text-accent-foreground"
                    )}
                  >
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkTheme ? (
                <Sun className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 rounded-full border-2 border-border"
                  }
                }}
                afterSignOutUrl="/"
              />
            ) : (
              <SignInButton mode="modal">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;