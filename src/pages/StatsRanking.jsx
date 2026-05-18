import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import PokemonModal from '../components/PokemonModal';
import { Trophy, Crown, Medal, Zap, Shield, Swords, Heart, Wind, Brain, ChevronDown } from 'lucide-react';

const typeColorHex = {
  normal:'#A8A77A', fire:'#EE8130', water:'#6390F0', electric:'#F7D02C',
  grass:'#7AC74C', ice:'#96D9D6', fighting:'#C22E28', poison:'#A33EA1',
  ground:'#E2BF65', flying:'#A98FF3', psychic:'#F95587', bug:'#A6B91A',
  rock:'#B6A136', ghost:'#735797', dragon:'#6F35FC', dark:'#705746',
  steel:'#B7B7CE', fairy:'#D685AD'
};

const statOptions = [
  { key: 'hp', label: 'HP', icon: <Heart size={18} />, color: 'text-red-500', bg: 'bg-red-500' },
  { key: 'attack', label: 'Ataque', icon: <Swords size={18} />, color: 'text-orange-500', bg: 'bg-orange-500' },
  { key: 'defense', label: 'Defensa', icon: <Shield size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-500' },
  { key: 'special-attack', label: 'Atq. Esp.', icon: <Brain size={18} />, color: 'text-blue-500', bg: 'bg-blue-500' },
  { key: 'special-defense', label: 'Def. Esp.', icon: <Zap size={18} />, color: 'text-green-500', bg: 'bg-green-500' },
  { key: 'speed', label: 'Velocidad', icon: <Wind size={18} />, color: 'text-purple-500', bg: 'bg-purple-500' },
  { key: 'total', label: 'Total', icon: <Crown size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-500' },
];

const podiumIcons = [
  <Crown size={20} className="text-yellow-400" />,
  <Medal size={20} className="text-slate-400" />,
  <Medal size={20} className="text-amber-700" />,
];

export default function StatsRanking() {
  const { t } = useLanguage();
  const [selectedStat, setSelectedStat] = useState('total');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Load a large batch of pokemon for ranking
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch top pokemon - we'll get 200 pokemon to have good coverage
        const promises = [];
        for (let i = 0; i < 4; i++) {
          promises.push(
            fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${i * 50}`)
              .then(r => r.json())
          );
        }
        const pages = await Promise.all(promises);
        const allResults = pages.flatMap(p => p.results);
        
        const pokemonPromises = allResults.map(p => fetch(p.url).then(r => r.json()));
        const data = await Promise.all(pokemonPromises);
        setAllPokemon(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Sort by selected stat
  useEffect(() => {
    if (allPokemon.length === 0) return;
    
    let sorted;
    if (selectedStat === 'total') {
      sorted = [...allPokemon].sort((a, b) => {
        const totalA = a.stats.reduce((s, st) => s + st.base_stat, 0);
        const totalB = b.stats.reduce((s, st) => s + st.base_stat, 0);
        return totalB - totalA;
      });
    } else {
      sorted = [...allPokemon].sort((a, b) => {
        const statA = a.stats.find(s => s.stat.name === selectedStat)?.base_stat || 0;
        const statB = b.stats.find(s => s.stat.name === selectedStat)?.base_stat || 0;
        return statB - statA;
      });
    }
    setRanking(sorted.slice(0, 15));
  }, [selectedStat, allPokemon]);

  const getStatValue = (pokemon) => {
    if (selectedStat === 'total') {
      return pokemon.stats.reduce((s, st) => s + st.base_stat, 0);
    }
    return pokemon.stats.find(s => s.stat.name === selectedStat)?.base_stat || 0;
  };

  const currentStatConfig = statOptions.find(s => s.key === selectedStat);
  const maxStat = ranking.length > 0 ? getStatValue(ranking[0]) : 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-3">
          <Trophy size={28} className="text-yellow-500" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            {t('statsRanking') || 'Ranking de Stats'}
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('statsRankingDesc') || 'Los Pokémon más poderosos por estadística'}</p>
      </div>

      {/* Stat Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {statOptions.map(stat => (
          <button
            key={stat.key}
            onClick={() => setSelectedStat(stat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              selectedStat === stat.key
                ? `${stat.bg} text-white shadow-lg`
                : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {stat.icon}
            {stat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
      ) : (
        <>
          {/* Podium - Top 3 */}
          {ranking.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {/* 2nd Place */}
              <div 
                className="flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={() => setSelectedPokemon(ranking[1])}
              >
                <img src={ranking[1].sprites.other?.['official-artwork']?.front_default || ranking[1].sprites.front_default} alt={ranking[1].name} className="w-20 h-20 object-contain drop-shadow-lg" />
                <div className="bg-slate-200 dark:bg-slate-700 rounded-t-xl w-24 h-20 flex flex-col items-center justify-center">
                  <Medal size={18} className="text-slate-400 mb-1" />
                  <p className="text-xs font-black capitalize text-slate-700 dark:text-slate-200 truncate w-20 text-center">{ranking[1].name}</p>
                  <p className="text-sm font-black text-slate-500">{getStatValue(ranking[1])}</p>
                </div>
              </div>

              {/* 1st Place */}
              <div 
                className="flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={() => setSelectedPokemon(ranking[0])}
              >
                <img src={ranking[0].sprites.other?.['official-artwork']?.front_default || ranking[0].sprites.front_default} alt={ranking[0].name} className="w-28 h-28 object-contain drop-shadow-2xl" />
                <div className="bg-yellow-400 dark:bg-yellow-500 rounded-t-xl w-28 h-28 flex flex-col items-center justify-center">
                  <Crown size={22} className="text-yellow-800 mb-1" />
                  <p className="text-sm font-black capitalize text-yellow-900 truncate w-24 text-center">{ranking[0].name}</p>
                  <p className="text-xl font-black text-yellow-800">{getStatValue(ranking[0])}</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div 
                className="flex flex-col items-center cursor-pointer hover:-translate-y-1 transition-transform"
                onClick={() => setSelectedPokemon(ranking[2])}
              >
                <img src={ranking[2].sprites.other?.['official-artwork']?.front_default || ranking[2].sprites.front_default} alt={ranking[2].name} className="w-20 h-20 object-contain drop-shadow-lg" />
                <div className="bg-amber-700/30 dark:bg-amber-800/40 rounded-t-xl w-24 h-16 flex flex-col items-center justify-center">
                  <Medal size={18} className="text-amber-700 mb-1" />
                  <p className="text-xs font-black capitalize text-slate-700 dark:text-slate-200 truncate w-20 text-center">{ranking[2].name}</p>
                  <p className="text-sm font-black text-amber-700">{getStatValue(ranking[2])}</p>
                </div>
              </div>
            </div>
          )}

          {/* Full Ranking List */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {ranking.map((pokemon, idx) => {
              const value = getStatValue(pokemon);
              const pct = (value / maxStat) * 100;
              const mainType = pokemon.types[0].type.name;
              return (
                <div 
                  key={pokemon.id}
                  onClick={() => setSelectedPokemon(pokemon)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all ${idx < ranking.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}
                >
                  {/* Rank */}
                  <div className="w-8 text-center">
                    {idx < 3 ? podiumIcons[idx] : (
                      <span className="text-sm font-black text-slate-400">{idx + 1}</span>
                    )}
                  </div>

                  {/* Sprite */}
                  <img 
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-10 h-10 object-contain"
                  />

                  {/* Name & Type */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold capitalize text-sm text-slate-800 dark:text-white truncate">{pokemon.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      {pokemon.types.map(tp => (
                        <span key={tp.type.name} className="w-2.5 h-2.5 rounded-full" style={{ background: typeColorHex[tp.type.name] }}></span>
                      ))}
                    </div>
                  </div>

                  {/* Stat Bar */}
                  <div className="w-32 hidden sm:block">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full stat-bar-animated ${currentStatConfig.bg}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Value */}
                  <span className={`font-black text-sm w-12 text-right ${currentStatConfig.color}`}>{value}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <PokemonModal 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
}
