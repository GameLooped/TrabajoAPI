import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Sparkles, Box, Cherry } from 'lucide-react';

export default function Layout() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-800 dark:border-slate-900 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800 dark:border-slate-900"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-800 dark:border-slate-900 relative z-10"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                Nexus<span className="text-red-500">Dex</span>
              </h1>
            </div>

            {/* Navigation Links (Desktop) */}
            <nav className="hidden md:flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {navItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                    location.pathname === item.path 
                      ? 'bg-white dark:bg-slate-700 text-red-500 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1 border border-slate-200 dark:border-slate-700 hidden sm:flex">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${!darkMode ? 'bg-white shadow-sm text-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Sun size={18} />
                </button>
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Moon size={18} />
                </button>
              </div>
              
              <button 
                onClick={toggleLanguage}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl shadow-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 px-4 py-2 rounded-xl font-bold text-white transition"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">{t('logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links (Mobile) */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex justify-around p-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center p-2 flex-1 rounded-xl font-bold text-xs ${
                  location.pathname === item.path 
                    ? 'text-red-500 bg-red-50 dark:bg-slate-700' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className="mb-1">{item.icon}</div>
                {item.label}
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
