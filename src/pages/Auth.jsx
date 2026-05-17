import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { t, lang, toggleLanguage } = useLanguage();
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

      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleLanguage}
          className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md font-bold text-slate-700 hover:bg-white transition"
        >
          {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full border-4 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-lg">
            <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800"></div>
            <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-800 relative z-10"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Poké<span className="text-red-500">dex</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            {isLogin ? t('login') : t('register')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('email')}</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
              placeholder="ash@pallet-town.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('password')}</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
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
