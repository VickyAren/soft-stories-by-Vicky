import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { data } = useData();
  const settings = data?.settings.general;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const headerHeight = 80; // A threshold to prevent hiding on small scrolls

    if (currentScrollY > lastScrollY.current && currentScrollY > headerHeight) {
      // If scrolling down & past the header, hide it
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      // If scrolling up, show it
      setIsVisible(true);
    }
    
    // Remember current scroll position for the next move
    lastScrollY.current = currentScrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-soft-beige/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-xl md:text-2xl font-serif font-semibold text-soft-brown">
          {settings?.siteLogo || "Soft Stories"}
        </NavLink>
        <div className="flex items-center space-x-6 text-soft-text font-sans">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-soft-brown font-medium' : 'hover:text-soft-brown'}>{settings?.navHome || "Home"}</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-soft-brown font-medium' : 'hover:text-soft-brown'}>{settings?.navAbout || "About"}</NavLink>
          <NavLink to="/books" className={({ isActive }) => isActive ? 'text-soft-brown font-medium' : 'hover:text-soft-brown'}>{settings?.navBooks || "Books"}</NavLink>
        </div>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  const { data } = useData();
  const settings = data?.settings.general;
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <footer className="bg-soft-beige mt-12 py-8 border-t border-soft-accent/20">
      <div className="container mx-auto px-6 text-center text-soft-text/70 font-sans">
        <a href={settings?.footerInstagramLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-soft-brown mb-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          Instagram
        </a>
        <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} Vicky Aran`}</p>
        
        {!isAuthenticated ? (
          <div className="mt-4">
            <NavLink to="/admin" className="text-xs text-soft-text/50 hover:text-soft-brown transition-colors">
              Admin Login
            </NavLink>
          </div>
        ) : (
          <div className="mt-4 text-xs space-x-4">
            <NavLink to="/admin/dashboard" className="text-soft-text/60 hover:text-soft-brown transition-colors">
              Admin Dashboard
            </NavLink>
            <button onClick={handleLogout} className="text-soft-text/60 hover:text-soft-brown transition-colors">
              Logout
            </button>
          </div>
        )}
      </div>
    </footer>
  );
};


const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-soft-beige min-h-screen font-sans text-soft-text">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;