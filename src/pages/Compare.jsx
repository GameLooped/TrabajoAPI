import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Swords, X, Trophy, Zap, Shield, Heart as HeartIcon, Wind, Brain } from 'lucide-react';

const typeColors = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

const typeColorHex = {
  normal:'#A8A77A', fire:'#EE8130', water:'#6390F0', electric:'#F7D02C',
  grass:'#7AC74C', ice:'#96D9D6', fighting:'#C22E28', poison:'#A33EA1',
  ground:'#E2BF65', flying:'#A98FF3', psychic:'#F95587', bug:'#A6B91A',
  rock:'#B6A136', ghost:'#735797', dragon:'#6F35FC', dark:'#705746',
  steel:'#B7B7CE', fairy:'#D685AD'
};

const statConfig = {
  hp:              { label: 'HP',     icon: <HeartIcon size={14} />, color: 'text-red-500' },
  attack:          { label: 'ATK',    icon: <Swords size={14} />,    color: 'text-orange-500' },
  defense:         { label: 'DEF',    icon: <Shield size={14} />,    color: 'text-yellow-500' },
  'special-attack':{ label: 'SP.ATK', icon: <Brain size={14} />,     color: 'text-blue-500' },
  'special-defense':{ label: 'SP.DEF',icon: <Zap size={14} />,      color: 'text-green-500' },
  speed:           { label: 'SPD',    icon: <Wind size={14} />,      color: 'text-purple-500' },
};

function PokemonSlot({ pokemon, onSearch, label, side }) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allPokemon, setAllPokemon] = useState([]);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.length < 2) { setSuggestions([]); return; }
    
    try {
      // Cache the full list
      let list = allPokemon;
      if (list.length === 0) {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await res.json();
        list = data.results;
        setAllPokemon(list);
      }
      const matches = list.filter(p => p.name.includes(value.toLowerCase())).slice(0, 8);
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

  const borderColor = side === 'left' ? 'border-red-500/30' : 'border-blue-500/30';
  const accentBg = side === 'left' ? 'from-red-500/10 to-transparent' : 'from-blue-500/10 to-transparent';

  if (loading) {
    return (
      <div className={`flex-1 bg-white dark:bg-slate-800 rounded-3xl p-8 flex items-center justify-center border-2 ${borderColor} min-h-[420px]`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={`flex-1 bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-dashed ${borderColor} min-h-[420px] bg-gradient-to-b ${accentBg}`}>
        <p className="text-slate-400 dark:text-slate-500 font-black text-sm mb-4 uppercase tracking-wider">{label}</p>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar Pokémon..."
            className="w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-semibold"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-10 overflow-hidden">
              {suggestions.map(s => {
                const id = s.url.split('/').filter(Boolean).pop();
                return (
                  <button
                    key={s.name}
                    onClick={() => selectPokemon(s.name)}
                    className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-bold capitalize text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                  >
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={s.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span>{s.name}</span>
                    <span className="text-xs text-slate-400 ml-auto">#{String(id).padStart(3, '0')}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center h-56 text-slate-200 dark:text-slate-700">
          <Swords size={64} strokeWidth={1} />
          <p className="text-sm font-bold mt-3 text-slate-400 dark:text-slate-600">Selecciona un Pokémon</p>
        </div>
      </div>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  return (
    <div className={`flex-1 bg-white dark:bg-slate-800 rounded-3xl border-2 ${borderColor} overflow-hidden min-h-[420px] relative`}>
      {/* Remove button */}
      <button
        onClick={() => onSearch(null)}
        className="absolute top-3 right-3 z-10 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-all"
      >
        <X size={16} />
      </button>

      {/* Header with image */}
      <div 
        className="p-6 pb-4 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${typeColorHex[mainType]}33, ${typeColorHex[mainType]}11)` }}
      >
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10" style={{ background: typeColorHex[mainType] }}></div>
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 mx-auto object-contain drop-shadow-xl"
        />
        <h3 className="text-xl font-black capitalize text-slate-800 dark:text-white mt-2">{pokemon.name}</h3>
        <p className="text-xs font-bold text-slate-400">#{String(pokemon.id).padStart(3, '0')}</p>
        <div className="flex gap-1.5 justify-center mt-2">
          {pokemon.types.map(t => (
            <span key={t.type.name} className={`px-3 py-0.5 rounded-full text-[10px] font-black text-white ${typeColors[t.type.name]}`}>
              {t.type.name.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 pt-2 space-y-1.5">
        <div className="text-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
          <span className="ml-2 text-lg font-black text-slate-800 dark:text-white">{totalStats}</span>
        </div>
        {pokemon.stats.map(s => {
          const cfg = statConfig[s.stat.name];
          const pct = Math.min((s.base_stat / 255) * 100, 100);
          return (
            <div key={s.stat.name} className="flex items-center gap-2">
              <div className={`flex items-center gap-1 w-[70px] justify-end ${cfg.color}`}>
                {cfg.icon}
                <span className="text-[10px] font-black">{cfg.label}</span>
              </div>
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full stat-bar-animated transition-all" 
                  style={{ width: `${pct}%`, background: typeColorHex[mainType] }}
                ></div>
              </div>
              <span className="w-8 text-right text-xs font-black text-slate-700 dark:text-slate-300">{s.base_stat}</span>
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

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <Swords size={28} className="text-blue-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {t('comparator') || 'Comparador'}
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">{t('compareDesc') || 'Compara las estadísticas de dos Pokémon lado a lado'}</p>
      </div>

      {/* Pokemon Slots */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <PokemonSlot pokemon={pokemon1} onSearch={setPokemon1} label="Pokémon 1" side="left" />
        
        {/* VS Badge */}
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center shadow-xl">
            <span className="text-white font-black text-lg">VS</span>
          </div>
        </div>

        <PokemonSlot pokemon={pokemon2} onSearch={setPokemon2} label="Pokémon 2" side="right" />
      </div>

      {/* Head-to-Head Comparison */}
      {pokemon1 && pokemon2 && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy size={20} className="text-yellow-500" />
            <h3 className="font-black text-lg text-slate-800 dark:text-white">{t('statComparison') || 'Comparación de Stats'}</h3>
          </div>

          {/* Stat bars face-off */}
          <div className="space-y-3">
            {Object.keys(statConfig).map(stat => {
              const cfg = statConfig[stat];
              const s1 = pokemon1.stats.find(s => s.stat.name === stat)?.base_stat || 0;
              const s2 = pokemon2.stats.find(s => s.stat.name === stat)?.base_stat || 0;
              const total = s1 + s2 || 1;
              const w1 = (s1 / total) * 100;
              const w2 = (s2 / total) * 100;
              const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;

              return (
                <div key={stat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-black w-10 text-right ${winner === 1 ? 'text-green-500' : 'text-slate-400'}`}>
                      {s1}
                    </span>
                    <div className={`flex items-center gap-1 ${cfg.color}`}>
                      {cfg.icon}
                      <span className="text-xs font-black">{cfg.label}</span>
                    </div>
                    <span className={`text-sm font-black w-10 text-left ${winner === 2 ? 'text-green-500' : 'text-slate-400'}`}>
                      {s2}
                    </span>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                    <div 
                      className={`h-full rounded-l-full transition-all duration-700 ${winner === 1 ? 'bg-green-500' : winner === 0 ? 'bg-yellow-400' : 'bg-red-400/60'}`} 
                      style={{ width: `${w1}%` }}
                    ></div>
                    <div 
                      className={`h-full rounded-r-full transition-all duration-700 ${winner === 2 ? 'bg-green-500' : winner === 0 ? 'bg-yellow-400' : 'bg-blue-400/60'}`} 
                      style={{ width: `${w2}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Winner */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            {(() => {
              const total1 = pokemon1.stats.reduce((s, st) => s + st.base_stat, 0);
              const total2 = pokemon2.stats.reduce((s, st) => s + st.base_stat, 0);
              const diff = Math.abs(total1 - total2);
              const winnerPokemon = total1 > total2 ? pokemon1 : total2 > total1 ? pokemon2 : null;
              
              return winnerPokemon ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={winnerPokemon.sprites.other?.['official-artwork']?.front_default || winnerPokemon.sprites.front_default}
                      alt={winnerPokemon.name}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-400 uppercase">{t('winner') || 'Ganador'}</p>
                      <p className="text-2xl font-black capitalize text-green-500">{winnerPokemon.name}</p>
                      <p className="text-xs font-bold text-slate-400">+{diff} stats totales</p>
                    </div>
                    <Trophy size={32} className="text-yellow-500" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black text-yellow-500">{t('tie') || '¡Empate!'}</span>
                  <span className="text-2xl">🤝</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
