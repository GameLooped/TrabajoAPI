import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import { Heart, Shield, BarChart3, Users, HeartOff } from 'lucide-react';

const ALL_LEGENDARY_IDS = new Set([
  144,145,146,150,151,243,244,245,249,250,251,
  377,378,379,380,381,382,383,384,385,386,
  480,481,482,483,484,485,486,487,488,489,490,491,492,493,
  494,638,639,640,641,642,643,644,645,646,647,648,649,
  716,717,718,719,720,721,
  772,773,785,786,787,788,789,790,791,792,800,801,802,807,808,809,
  888,889,890,891,892,893,894,895,896,897,898,
  1001,1002,1003,1004,1007,1008,1014,1015,1016,1017,1024,1025
]);

const typeColorsBg = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

export default function Favorites() {
  const { t } = useLanguage();
  const { favorites, team } = useFavorites();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [view, setView] = useState('favorites');

  const currentList = view === 'favorites' ? favorites : team;

  // Calculate team types
  const teamTypes = new Set();
  team.forEach(p => p.types.forEach(tp => teamTypes.add(tp.type.name)));
  const coveragePct = Math.round((teamTypes.size / 18) * 100);

  return (
    <div>
      {/* Toggle Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setView('favorites')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${view === 'favorites' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
        >
          <Heart size={18} fill={view === 'favorites' ? 'currentColor' : 'none'} />
          {t('favorites') || 'Favoritos'} ({favorites.length})
        </button>
        <button
          onClick={() => setView('team')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${view === 'team' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
        >
          <Shield size={18} fill={view === 'team' ? 'currentColor' : 'none'} />
          {t('myTeam') || 'Mi Equipo'} ({team.length}/6)
        </button>
      </div>

      {/* Team Coverage Analysis */}
      {view === 'team' && team.length > 0 && (
        <div className="mb-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Analysis Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white">{t('teamAnalysis') || 'Análisis del Equipo'}</h3>
              <p className="text-xs text-slate-400">{team.length}/6 Pokémon</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Coverage Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('typeCoverage') || 'Cobertura de tipos'}</span>
                <span className="text-sm font-black text-blue-500">{teamTypes.size} / 18</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" 
                  style={{ width: `${coveragePct}%` }}
                ></div>
              </div>
            </div>

            {/* Type Badges */}
            <div className="flex flex-wrap gap-1.5">
              {['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'].map(type => {
                const hasType = teamTypes.has(type);
                return (
                  <span 
                    key={type} 
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      hasType 
                        ? `${typeColorsBg[type]} text-white shadow-sm` 
                        : 'bg-slate-100 dark:bg-slate-700/50 text-slate-300 dark:text-slate-600 line-through'
                    }`}
                  >
                    {t(`types.${type}`) || type}
                  </span>
                );
              })}
            </div>

            {/* Team Mini Preview */}
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              {team.map(p => (
                <div key={p.id} className="flex flex-col items-center">
                  <img 
                    src={p.sprites.other?.['official-artwork']?.front_default || p.sprites.front_default}
                    alt={p.name}
                    className="w-12 h-12 object-contain drop-shadow-md"
                  />
                  <span className="text-[9px] font-bold capitalize text-slate-500 dark:text-slate-400 truncate w-14 text-center">{p.name}</span>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 6 - team.length }).map((_, i) => (
                <div key={`empty-${i}`} className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <span className="text-slate-300 dark:text-slate-600 text-lg">+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            {view === 'favorites' 
              ? <HeartOff size={36} className="text-slate-300 dark:text-slate-600" />
              : <Shield size={36} className="text-slate-300 dark:text-slate-600" />
            }
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-1">
            {view === 'favorites' ? (t('noFavTitle') || 'Sin favoritos') : (t('noTeamTitle') || 'Equipo vacío')}
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs">
            {view === 'favorites' 
              ? (t('noFavorites') || 'Haz clic en el corazón de cualquier Pokémon para agregarlo aquí.')
              : (t('noTeam') || 'Haz clic en el escudo de cualquier Pokémon para agregar hasta 6 a tu equipo.')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentList.map((pokemon, idx) => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon}
              isLegendary={ALL_LEGENDARY_IDS.has(pokemon.id)}
              index={idx}
              onClick={() => setSelectedPokemon(pokemon)}
            />
          ))}
        </div>
      )}

      <PokemonModal 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
}
