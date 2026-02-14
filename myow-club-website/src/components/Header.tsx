import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.calendar'), path: '/calendar' },
    { name: t('nav.activities'), path: '/activities' },
    { name: t('nav.staff'), path: '/staff' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.store'), path: '/store' },
    { name: t('nav.membership'), path: '/membership' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <header className="bg-white py-6 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-indigo-100 transition-all duration-300 shadow-sm relative">
              {/* Logo Image */}
              <img 
                src="/logo.png" 
                alt="MYOW Logo" 
                className="w-full h-full object-cover transform scale-150 translate-y-2" // Adjust scale/translate to crop text as requested
              />
            </div>
            <div className="hidden lg:block">
               <span className="font-bold text-xl text-gray-800 tracking-tight block leading-none">MYOW</span>
               <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">DIY Club</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
             <div className="flex items-center gap-1 bg-gray-50/80 p-1.5 rounded-full border border-gray-100">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden
                    ${isActive(link.path) 
                      ? 'text-gray-900 bg-[#FFF9E5] shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Section: Language & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <Globe className="w-4 h-4 text-gray-400" />
              <select 
                onChange={(e) => changeLanguage(e.target.value)} 
                value={i18n.language}
                className="bg-transparent text-sm font-medium text-gray-600 focus:outline-none cursor-pointer hover:text-indigo-600 appearance-none pr-2"
              >
                <option value="en">English</option>
                <option value="zh">简体中文</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-black focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-2 animate-fadeIn bg-white absolute left-0 right-0 top-full shadow-lg border-t border-gray-100 px-4 py-6 z-50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors text-center
                  ${isActive(link.path) 
                    ? 'bg-[#FFF9E5] text-gray-900' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
