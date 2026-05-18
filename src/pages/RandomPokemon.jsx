import React, { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PokemonModal from '../components/PokemonModal';
import { Dices } from 'lucide-react';

const typeColors = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

export default function RandomPokemon() {
  const { t } = useLanguage();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getRandomPokemon = useCallback(async () => {
    setSpinning(true);
    setLoading(true);
    const randomId = Math.floor(Math.random() * 1025) + 1;
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      // Small delay for spin animation
      setTimeout(() => {
        setPokemon(data);
        setLoading(false);
        setSpinning(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setSpinning(false);
    }
  }, []);

  const mainType = pokemon?.types?.[0]?.type?.name;
  const bgColor = typeColors[mainType] || 'bg-slate-200';

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-3">
          <Dices size={32} className="text-red-500" />
          {t('randomPokemon') || 'Pokémon Aleatorio'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('randomDesc') || '¡Descubre un Pokémon al azar!'}</p>
      </div>

      {/* Pokeball Button */}
      <button
        onClick={getRandomPokemon}
        disabled={loading}
        className={`w-40 h-40 rounded-full bg-white border-8 border-slate-800 dark:border-slate-200 relative overflow-hidden flex items-center justify-center shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-105 disabled:opacity-70 mb-10 ${spinning ? 'pokeball-spin' : ''}`}
      >
        <div className="absolute top-0 w-full h-1/2 bg-red-500"></div>
        <div className="absolute bottom-0 w-full h-1/2 bg-white"></div>
        <div className="absolute w-full h-2 bg-slate-800 dark:bg-slate-200 top-1/2 -translate-y-1/2"></div>
        <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-800 dark:border-slate-200 relative z-10 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-400"></div>
        </div>
      </button>

      {/* Result */}
      {pokemon && !loading && (
        <div 
          className={`card-stagger w-full max-w-md rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:-translate-y-2 transition-transform ${bgColor} bg-opacity-20 dark:bg-opacity-30`}
          onClick={() => setShowModal(true)}
        >
          <div className={`${bgColor} bg-opacity-40 dark:bg-opacity-60 p-8 text-center relative`}>
            <div className="absolute top-4 right-6 text-slate-700/40 font-black text-4xl">
              #{String(pokemon.id).padStart(3, '0')}
            </div>
            <img
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-56 h-56 mx-auto object-contain drop-shadow-2xl"
            />
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 text-center">
            <h3 className="text-4xl font-black capitalize text-slate-800 dark:text-white mb-3">{pokemon.name}</h3>
            <div className="flex gap-2 justify-center mb-4">
              {pokemon.types.map(tInfo => (
                <span key={tInfo.type.name} className={`px-4 py-1 rounded-full text-sm font-bold text-white ${typeColors[tInfo.type.name]}`}>
                  {tInfo.type.name.toUpperCase()}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <p className="text-slate-400 font-semibold text-xs">{t('height')}</p>
                <p className="font-bold text-slate-800 dark:text-white">{pokemon.height / 10}m</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <p className="text-slate-400 font-semibold text-xs">{t('weight')}</p>
                <p className="font-bold text-slate-800 dark:text-white">{pokemon.weight / 10}kg</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3">
                <p className="text-slate-400 font-semibold text-xs">Total</p>
                <p className="font-bold text-slate-800 dark:text-white">{pokemon.stats.reduce((s, st) => s + st.base_stat, 0)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">{t('clickForMore') || 'Haz clic para ver más detalles'}</p>
          </div>
        </div>
      )}

      {!pokemon && !loading && (
        <p className="text-slate-400 dark:text-slate-500 text-lg font-medium mt-4">
          {t('pressThePokeball') || '¡Presiona la Pokébola!'}
        </p>
      )}

      <PokemonModal 
        pokemon={showModal ? pokemon : null}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
