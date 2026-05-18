import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { LogOut, Sun, Moon, Sparkles, Box, Cherry, Heart, Swords, Grid3x3, Dices } from 'lucide-react';

export default function Layout() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const { favorites, team } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const navItems = [
    { path: '/pokedex', icon: <Sparkles size={20} />, label: t('pokemon') || 'Pokémon' },
    { path: '/items', icon: <Box size={20} />, label: t('items') || 'Items' },
    { path: '/berries', icon: <Cherry size={20} />, label: t('berries') || 'Berries' },
    { path: '/favorites', icon: <Heart size={20} />, label: t('favorites') || 'Favoritos', badge: favorites.length || null },
    { path: '/compare', icon: <Swords size={20} />, label: t('comparator') || 'Comparar' },
    { path: '/typechart', icon: <Grid3x3 size={20} />, label: t('typeChart') || 'Tipos' },
    { path: '/random', icon: <Dices size={20} />, label: t('random') || 'Aleatorio' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-800 dark:border-slate-900 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800 dark:border-slate-900"></div>
                 <div className="w-2 h-2 rounded-full bg-white border border-slate-800 dark:border-slate-900 relative z-10"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Nexus<span className="text-red-500">Dex</span>
              </h1>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden lg:flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mx-4 overflow-x-auto">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap relative ${
                    location.pathname === item.path 
                      ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
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
                className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition hidden sm:flex"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              <button 
                onClick={toggleLanguage}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl shadow-sm font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 px-3 py-1.5 rounded-xl font-bold text-xs text-white transition"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links (Mobile) */}
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto">
          <div className="flex p-1.5 gap-1 min-w-max px-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 rounded-xl font-bold text-[10px] whitespace-nowrap relative ${
                  location.pathname === item.path 
                    ? 'text-red-500 bg-red-50 dark:bg-slate-700' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className="mb-0.5">{item.icon}</div>
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
