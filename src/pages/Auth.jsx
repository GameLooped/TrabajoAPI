import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, UserPlus, Sun, Moon, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Load existing users from LocalStorage or initialize with a default one
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('nexusdex_registered_users');
    return users ? JSON.parse(users) : {};
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (isLogin) {
      // Login validation
      if (users[trimmedEmail] && users[trimmedEmail] === password) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/pokedex');
      } else {
        setErrorMessage(t('authErrorInvalid'));
      }
    } else {
      // Registration validation
      if (users[trimmedEmail]) {
        setErrorMessage(t('authErrorExists'));
      } else {
        // Save user
        users[trimmedEmail] = password;
        localStorage.setItem('nexusdex_registered_users', JSON.stringify(users));
        setSuccessMessage(t('authSuccessRegister'));
        
        // Reset and switch view after a short delay
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setSuccessMessage('');
        }, 2500);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="absolute top-4 right-4 flex gap-3 z-20">
        <button 
          onClick={toggleTheme}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2.5 rounded-full shadow-md text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button 
          onClick={toggleLanguage}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md font-black text-xs text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition"
        >
          {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
      </div>

      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-slate-700/50 relative z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-white dark:bg-slate-800 rounded-full border-4 border-slate-800 dark:border-slate-200 relative overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800 dark:border-slate-200"></div>
            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-800 dark:border-slate-200 relative z-10"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Nexus<span className="text-red-500 font-black">Dex</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-black text-sm uppercase tracking-wider">
            {isLogin ? t('login') : t('register')}
          </p>
        </div>

        {/* Dynamic Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start gap-2.5 text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('email')}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/80 focus:bg-white dark:focus:bg-slate-800 text-sm font-semibold transition-all"
              placeholder="ash@pallet-town.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">{t('password')}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/80 focus:bg-white dark:focus:bg-slate-800 text-sm font-semibold transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2 text-sm"
          >
            {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
            {t('enter')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="text-red-500 hover:text-red-600 font-extrabold text-xs uppercase tracking-wider transition-colors"
          >
            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
