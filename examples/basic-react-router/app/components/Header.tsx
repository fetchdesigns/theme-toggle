import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router';
import { ThemeToggle } from '@fetchdesigns/theme-toggle-react-router';
import type { Theme } from '@fetchdesigns/theme-toggle-react-router';

interface HeaderProps {
  theme: Theme | null;
}

export default function Header({ theme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update compact state
      setIsScrolled(currentScrollY > 20);
      
      // Show header when scrolling up or at top
      // Hide header when scrolling down (but not if near top)
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 shadow-lg bg-card transition-all duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <nav className={`max-w-screen-xl mx-auto px-8 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 no-underline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 60 60" className={`transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
              {/* Large background circle - split colors */}
              {/* Left half - Light sky blue */}
              <path d="M28 -1 A29 29 0 0 0 28 57 L28 28 Z" fill="#6497ba" />
              {/* Right half - Dark midnight blue */}
              <path d="M28 -1 A29 29 0 0 1 28 57 L28 28 Z" fill="#191970" />
              
              {/* White border */}
              <circle cx="28" cy="28" r="28" fill="none" stroke="#FFFFFF" strokeWidth="2" />
              
              {/* Stars scattered in the night sky (right side) */}
              <g fill="#FFFFFF" opacity="0.9">
                <circle cx="35" cy="7" r="0.5" />
                <circle cx="42" cy="11" r="0.7" />
                <circle cx="38" cy="20" r="0.4" />
                <circle cx="45" cy="25" r="0.6" />
                <circle cx="40" cy="32" r="0.5" />
                <circle cx="47" cy="35" r="0.4" />
                <circle cx="36" cy="40" r="0.6" />
                <circle cx="43" cy="45" r="0.5" />
                <circle cx="32" cy="48" r="0.4" />
              </g>
              
              {/* Background circle */}
              <circle cx="28" cy="28" r="18" fill="currentColor" opacity="0.1" />
              
              {/* Left half - Sun */}
              <path d="M28 10 A18 18 0 0 0 28 46 L28 28 Z" fill="#FDB813" />
              
              {/* Right half - Moon */}
              <path d="M28 10 A18 18 0 0 1 28 46 L28 28 Z" fill="#7B8DB8" />
              
              {/* Sun rays - 6 evenly spaced at 30° intervals */}
              <g stroke="#FDB813" strokeWidth="2" strokeLinecap="round">
                {/* 105° */}
                <line x1="23.3" y1="45.4" x2="21.3" y2="53.1" />
                {/* 135° */}
                <line x1="15.3" y1="40.7" x2="9.6" y2="46.4" />
                {/* 165° */}
                <line x1="10.6" y1="32.7" x2="2.9" y2="34.7" />
                {/* 195° */}
                <line x1="10.6" y1="23.3" x2="2.9" y2="21.3" />
                {/* 225° */}
                <line x1="15.3" y1="15.3" x2="9.6" y2="9.6" />
                {/* 255° */}
                <line x1="23.3" y1="10.6" x2="21.3" y2="2.9" />
              </g>
              
              {/* Moon craters */}
              <circle cx="34" cy="24" r="2" fill="#4A5674" opacity="0.5" />
              <circle cx="38" cy="32" r="1.5" fill="#4A5674" opacity="0.5" />
            </svg>
            <div className="flex flex-col transition-all duration-300">
              <span className={`font-thin transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>Theme Toggle</span>
              <span className={`pl-[.4em] -mt-[.5em] transition-all duration-300 ${isScrolled ? 'text-[0.5rem]' : 'text-[0.6rem]'}`} style={{ color: 'var(--text-secondary)' }}>by Fetch Designs</span>
            </div>
          </Link>
          <div className="flex items-center flex-wrap gap-x-6 gap-y-2 ml-auto">
            <NavLink 
              to="/" 
              end
              className={({ isActive }: { isActive: boolean }) => 
                `no-underline font-medium transition-colors pb-1 border-b-2 ${
                  isActive 
                    ? 'text-accent border-accent' 
                    : 'border-transparent hover:text-accent'
                }`
              }
            >
              Demo
            </NavLink>
            <NavLink 
              to="/documentation"
              className={({ isActive }: { isActive: boolean }) => 
                `no-underline font-medium transition-colors pb-1 border-b-2 ${
                  isActive 
                    ? 'text-accent border-accent' 
                    : 'border-transparent hover:text-accent'
                }`
              }
            >
              Documentation
            </NavLink>
            <div className="flex items-center flex-shrink-0 ml-auto">
              <ThemeToggle currentTheme={theme} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

