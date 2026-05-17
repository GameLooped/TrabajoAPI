import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, UserPlus, Sun, Moon } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/pokedex');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="absolute top-4 right-4 flex gap-3 z-20">
        <button 
          onClick={toggleTheme}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={toggleLanguage}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition"
        >
          {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-slate-700/50 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full border-4 border-slate-800 dark:border-slate-900 relative overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800 dark:border-slate-900"></div>
            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-800 dark:border-slate-900 relative z-10"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Nexus<span className="text-red-500">Dex</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {isLogin ? t('login') : t('register')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('email')}</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              placeholder="ash@pallet-town.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('password')}</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 flex justify-center items-center gap-2"
          >
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            {t('enter')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
