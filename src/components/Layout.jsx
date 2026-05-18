import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { LogOut, Sun, Moon } from 'lucide-react';

export default function Layout() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems = [
    { path: '/pokedex', emoji: '📖', label: t('pokemon') || 'Pokémon' },
    { path: '/items', emoji: '🎒', label: t('items') || 'Items' },
    { path: '/berries', emoji: '🍇', label: t('berries') || 'Berries' },
    { path: '/favorites', emoji: '❤️', label: t('favorites') || 'Favoritos', badge: favorites.length || null },
    { path: '/compare', emoji: '⚔️', label: t('comparator') || 'Comparar' },
    { path: '/typechart', emoji: '🔮', label: t('whosThat') || '¿Quién es?' },
    { path: '/random', emoji: '🎲', label: t('random') || 'Aleatorio' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => navigate('/pokedex')}>
              <div className="w-7 h-7 rounded-full bg-white border-[3px] border-slate-800 dark:border-slate-200 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-[2px] border-slate-800 dark:border-slate-200"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-white border border-slate-800 dark:border-slate-200 relative z-10"></div>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Nexus<span className="text-red-500">Dex</span>
              </h1>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden lg:flex gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl mx-4">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap relative ${
                    location.pathname === item.path 
                      ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  {item.label}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-yellow-500 dark:text-indigo-400 hover:scale-110 transition-transform"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-xl font-black text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform"
              >
                {lang === 'es' ? '🇺🇸' : '🇪🇸'}
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-xl font-bold text-xs text-white transition-all hover:scale-105"
              >
                <LogOut size={13} />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links (Mobile) - styled scrollbar */}
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 overflow-x-auto scrollbar-hide">
          <div className="flex p-1.5 gap-1 min-w-max px-3">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl font-bold text-[10px] whitespace-nowrap relative transition-all ${
                  location.pathname === item.path 
                    ? 'text-red-500 bg-red-50 dark:bg-red-500/10 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 active:bg-slate-100 dark:active:bg-slate-700'
                }`}
              >
                <span className="text-lg mb-0.5">{item.emoji}</span>
                {item.label}
                {item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </div>
  );
}
