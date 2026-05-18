import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, RotateCcw, Eye, Zap, ScanEye } from 'lucide-react';

export default function WhosThatPokemon() {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    return parseInt(localStorage.getItem('wtpBestStreak') || '0');
  });
  const [result, setResult] = useState(null); // 'correct' | 'wrong' | null
  const [history, setHistory] = useState([]);

  const fetchNewPokemon = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setGuess('');
    setResult(null);
    const randomId = Math.floor(Math.random() * 898) + 1;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      setPokemon(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNewPokemon();
  }, []);

  const handleGuess = () => {
    if (!pokemon || !guess.trim()) return;
    const isCorrect = guess.trim().toLowerCase() === pokemon.name.toLowerCase();
    setRevealed(true);
    
    if (isCorrect) {
      setResult('correct');
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('wtpBestStreak', String(newStreak));
      }
    } else {
      setResult('wrong');
      setStreak(0);
    }

    setHistory(prev => [{
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
      correct: isCorrect,
      guessed: guess.trim()
    }, ...prev].slice(0, 10));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (revealed) fetchNewPokemon();
      else handleGuess();
    }
  };

  const handleSkip = () => {
    setRevealed(true);
    setResult('wrong');
    setStreak(0);
    setHistory(prev => [{
      id: pokemon.id,
      name: pokemon.name,
      sprite: pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default,
      correct: false,
      guessed: '—'
    }, ...prev].slice(0, 10));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-3">
          <ScanEye size={28} className="text-purple-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {t('whosThat') || '¿Quién es ese Pokémon?'}
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400">{t('whosThatDesc') || '¡Adivina el Pokémon por su silueta!'}</p>
      </div>

      {/* Score Board */}
      <div className="flex justify-center gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase">{t('score') || 'Puntos'}</p>
          <p className="text-2xl font-black text-green-500">{score}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 justify-center"><Zap size={12} /> {t('streak') || 'Racha'}</p>
          <p className="text-2xl font-black text-orange-500">{streak}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 justify-center"><Trophy size={12} /> {t('best') || 'Mejor'}</p>
          <p className="text-2xl font-black text-yellow-500">{bestStreak}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
          </div>
        ) : pokemon && (
          <>
            {/* Silhouette / Reveal */}
            <div className={`relative flex justify-center items-center py-10 transition-all duration-500 ${revealed ? (result === 'correct' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20') : 'bg-slate-900'}`}>
              <img
                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt="mystery"
                className={`w-56 h-56 object-contain drop-shadow-2xl transition-all duration-500 ${revealed ? '' : 'brightness-0 dark:brightness-0'}`}
                style={revealed ? {} : { filter: 'brightness(0) drop-shadow(0 0 8px rgba(255,255,255,0.15))' }}
              />
              {revealed && result === 'correct' && (
                <div className="absolute top-4 right-4 text-5xl animate-bounce">🎉</div>
              )}
              {revealed && result === 'wrong' && (
                <div className="absolute top-4 right-4 text-5xl">😢</div>
              )}
            </div>

            {/* Input / Result */}
            <div className="p-6">
              {!revealed ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t('typeName') || 'Escribe el nombre...'}
                    autoFocus
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                  />
                  <button
                    onClick={handleGuess}
                    className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-lg"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleSkip}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-3 rounded-xl transition hover:bg-slate-300 dark:hover:bg-slate-600"
                    title="Skip"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  {result === 'correct' ? (
                    <p className="text-2xl font-black text-green-500 mb-1">
                      🎯 {t('correct') || '¡Correcto!'}
                    </p>
                  ) : (
                    <p className="text-2xl font-black text-red-500 mb-1">
                      ✗ {t('wrong') || 'Incorrecto'}
                    </p>
                  )}
                  <p className="text-3xl font-black capitalize text-slate-800 dark:text-white mb-4">
                    {pokemon.name}
                  </p>
                  <button
                    onClick={fetchNewPokemon}
                    autoFocus
                    className="bg-slate-800 dark:bg-red-600 hover:bg-slate-900 dark:hover:bg-red-700 text-white font-black px-8 py-3 rounded-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw size={18} />
                    {t('next') || 'Siguiente'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-slate-800 dark:text-white mb-3">{t('recentHistory') || 'Historial reciente'}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {history.map((entry, idx) => (
              <div key={idx} className={`shrink-0 w-20 text-center p-2 rounded-xl border-2 ${entry.correct ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                <img src={entry.sprite} alt={entry.name} className="w-14 h-14 mx-auto object-contain" />
                <p className="text-[10px] font-bold capitalize text-slate-700 dark:text-slate-300 truncate">{entry.name}</p>
                <p className="text-[10px]">{entry.correct ? '✓' : '✗'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
