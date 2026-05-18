import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Swords, ArrowRight } from 'lucide-react';

const typeColors = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

const statLabels = { hp: 'HP', attack: 'ATK', defense: 'DEF', 'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD' };

function PokemonSlot({ pokemon, onSearch, label }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) { setSuggestions([]); return; }
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025`);
      const data = await res.json();
      const matches = data.results.filter(p => p.name.includes(value.toLowerCase())).slice(0, 6);
      setSuggestions(matches);
    } catch (err) {
      console.error(err);
    }
  };

  const selectPokemon = async (name) => {
    setLoading(true);
    setSearch('');
    setSuggestions([]);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
      onSearch(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-center justify-center border border-slate-200 dark:border-slate-700 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 min-h-[400px]">
        <p className="text-slate-400 font-bold text-sm mb-3">{label}</p>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar Pokémon..."
            className="w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
              {suggestions.map(s => (
                <button
                  key={s.name}
                  onClick={() => selectPokemon(s.name)}
                  className="block w-full text-left px-4 py-2 text-sm font-semibold capitalize text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-center h-48 text-slate-300 dark:text-slate-600">
          <div className="text-center">
            <div className="text-6xl mb-2">?</div>
            <p className="text-sm font-medium">Selecciona un Pokémon</p>
          </div>
        </div>
      </div>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px]">
      <div className={`${typeColors[mainType]} bg-opacity-30 dark:bg-opacity-50 p-6 text-center relative`}>
        <button
          onClick={() => onSearch(null)}
          className="absolute top-2 right-2 bg-white/60 dark:bg-slate-700/60 p-1.5 rounded-full text-slate-500 hover:text-red-500 transition text-xs"
        >✕</button>
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-36 h-36 mx-auto object-contain drop-shadow-xl"
        />
        <h3 className="text-2xl font-black capitalize text-slate-800 dark:text-white mt-2">{pokemon.name}</h3>
        <div className="flex gap-2 justify-center mt-2">
          {pokemon.types.map(t => (
            <span key={t.type.name} className={`px-3 py-0.5 rounded-full text-xs font-bold text-white ${typeColors[t.type.name]}`}>
              {t.type.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="text-center font-bold text-sm text-slate-500 dark:text-slate-400 mb-2">
          Total Stats: <span className="text-slate-800 dark:text-white text-lg">{totalStats}</span>
        </div>
        {pokemon.stats.map(s => {
          const pct = Math.min((s.base_stat / 255) * 100, 100);
          return (
            <div key={s.stat.name} className="flex items-center gap-2">
              <span className="w-16 text-xs font-bold text-slate-500 dark:text-slate-400 text-right">{statLabels[s.stat.name]}</span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full stat-bar-animated ${typeColors[mainType]}`} style={{ width: `${pct}%` }}></div>
              </div>
              <span className="w-8 text-xs font-bold text-slate-800 dark:text-white text-right">{s.base_stat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Compare() {
  const { t } = useLanguage();
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);

  const getWinner = (stat) => {
    if (!pokemon1 || !pokemon2) return null;
    const s1 = pokemon1.stats.find(s => s.stat.name === stat)?.base_stat || 0;
    const s2 = pokemon2.stats.find(s => s.stat.name === stat)?.base_stat || 0;
    if (s1 > s2) return 1;
    if (s2 > s1) return 2;
    return 0;
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-3">
          <Swords size={32} className="text-red-500" />
          {t('comparator') || 'Comparador'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('compareDesc') || 'Compara las estadísticas de dos Pokémon lado a lado'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <PokemonSlot pokemon={pokemon1} onSearch={setPokemon1} label="Pokémon 1" />
        
        <div className="flex items-center justify-center md:flex-col gap-2 py-4">
          <div className="text-4xl font-black text-red-500">VS</div>
        </div>

        <PokemonSlot pokemon={pokemon2} onSearch={setPokemon2} label="Pokémon 2" />
      </div>

      {/* Stat comparison */}
      {pokemon1 && pokemon2 && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 text-center">⚔️ {t('statComparison') || 'Comparación de Stats'}</h3>
          <div className="space-y-3">
            {Object.keys(statLabels).map(stat => {
              const s1 = pokemon1.stats.find(s => s.stat.name === stat)?.base_stat || 0;
              const s2 = pokemon2.stats.find(s => s.stat.name === stat)?.base_stat || 0;
              const winner = getWinner(stat);
              return (
                <div key={stat} className="flex items-center gap-3">
                  <span className={`w-12 text-right text-sm font-black ${winner === 1 ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>{s1}</span>
                  <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <div className={`h-full ${winner === 1 ? 'bg-green-500' : 'bg-red-400'} transition-all`} style={{ width: `${(s1 / (s1 + s2)) * 100}%` }}></div>
                    <div className={`h-full ${winner === 2 ? 'bg-green-500' : 'bg-blue-400'} transition-all`} style={{ width: `${(s2 / (s1 + s2)) * 100}%` }}></div>
                  </div>
                  <span className={`w-12 text-left text-sm font-black ${winner === 2 ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'}`}>{s2}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-center">
            {(() => {
              const total1 = pokemon1.stats.reduce((s, st) => s + st.base_stat, 0);
              const total2 = pokemon2.stats.reduce((s, st) => s + st.base_stat, 0);
              const winnerName = total1 > total2 ? pokemon1.name : total2 > total1 ? pokemon2.name : null;
              return (
                <p className="font-bold text-slate-800 dark:text-white">
                  {winnerName 
                    ? <>{t('winner') || 'Ganador'}: <span className="text-green-500 capitalize text-xl">{winnerName}</span> 🏆</>
                    : <span className="text-yellow-500">{t('tie') || '¡Empate!'} 🤝</span>
                  }
                </p>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
