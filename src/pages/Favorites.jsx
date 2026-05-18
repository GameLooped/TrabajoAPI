import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import PokemonCard from '../components/PokemonCard';
import PokemonModal from '../components/PokemonModal';
import { Heart, Trash2 } from 'lucide-react';

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

export default function Favorites() {
  const { t } = useLanguage();
  const { favorites, team } = useFavorites();
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [view, setView] = useState('favorites'); // 'favorites' | 'team'

  const currentList = view === 'favorites' ? favorites : team;

  return (
    <div>
      {/* Toggle */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setView('favorites')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${view === 'favorites' ? 'bg-red-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
        >
          <Heart size={18} fill={view === 'favorites' ? 'currentColor' : 'none'} />
          {t('favorites') || 'Favoritos'} ({favorites.length})
        </button>
        <button
          onClick={() => setView('team')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${view === 'team' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
        >
          🛡️ {t('myTeam') || 'Mi Equipo'} ({team.length}/6)
        </button>
      </div>

      {/* Team Coverage Analysis */}
      {view === 'team' && team.length > 0 && (
        <div className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-3">📊 {t('teamAnalysis') || 'Análisis del Equipo'}</h3>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const allTypes = new Set();
              team.forEach(p => p.types.forEach(t => allTypes.add(t.type.name)));
              return [...allTypes].map(type => (
                <span key={type} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-bold capitalize">
                  {type}
                </span>
              ));
            })()}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
            {t('typeCoverage') || 'Cobertura de tipos'}: {(() => {
              const allTypes = new Set();
              team.forEach(p => p.types.forEach(t => allTypes.add(t.type.name)));
              return allTypes.size;
            })()} / 18
          </p>
        </div>
      )}

      {currentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-6xl mb-4">{view === 'favorites' ? '💔' : '🛡️'}</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            {view === 'favorites' 
              ? (t('noFavorites') || 'No tienes favoritos aún. ¡Haz clic en el ❤️ de cualquier Pokémon!')
              : (t('noTeam') || 'Tu equipo está vacío. ¡Haz clic en el 🛡️ para agregar hasta 6 Pokémon!')
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
