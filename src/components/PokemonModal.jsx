import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X } from 'lucide-react';

const typeColors = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

export default function PokemonModal({ pokemon, onClose }) {
  const { t, lang } = useLanguage();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (pokemon) {
      setDescription(''); // Reset description when opening a new pokemon
      fetch(pokemon.species.url)
        .then(res => res.json())
        .then(data => {
          const entry = data.flavor_text_entries.find(
            e => e.language.name === lang
          );
          const fallbackEntry = data.flavor_text_entries.find(
            e => e.language.name === 'en'
          );
          
          if (entry) {
            setDescription(entry.flavor_text.replace(/[\f\n\r]/g, ' '));
          } else if (fallbackEntry) {
            setDescription(fallbackEntry.flavor_text.replace(/[\f\n\r]/g, ' '));
          } else {
            setDescription('');
          }
        })
        .catch(err => console.error("Error fetching species:", err));
    }
  }, [pokemon, lang]);
  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || 'bg-slate-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 p-2 rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-6 h-6 text-slate-800 dark:text-slate-100" />
        </button>

        {/* Left Side: Image */}
        <div className={`w-full md:w-2/5 p-8 flex flex-col items-center justify-center ${bgColor} bg-opacity-20 dark:bg-opacity-40`}>
          <div className="text-slate-600/50 dark:text-slate-400/50 font-bold text-4xl mb-4 self-start">
            #{String(pokemon.id).padStart(3, '0')}
          </div>
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl"
          />
          <div className="flex gap-2 mt-6 flex-wrap justify-center">
            {pokemon.types.map((typeInfo) => (
              <span 
                key={typeInfo.type.name}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm ${typeColors[typeInfo.type.name]}`}
              >
                {t(`types.${typeInfo.type.name}`).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Stats and Description */}
        <div className="w-full md:w-3/5 p-8 flex flex-col justify-center">
          <h2 className="text-4xl font-black capitalize text-slate-800 dark:text-white mb-2">{pokemon.name}</h2>
          
          {description ? (
            <p className="text-slate-600 dark:text-slate-300 italic mb-6 text-sm leading-relaxed">
              "{description}"
            </p>
          ) : (
            <div className="mb-6 h-10 flex items-center">
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded"></div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mb-1">{t('height')}</p>
              <p className="font-bold text-slate-800 dark:text-white text-lg">{pokemon.height / 10} m</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
              <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm mb-1">{t('weight')}</p>
              <p className="font-bold text-slate-800 dark:text-white text-lg">{pokemon.weight / 10} kg</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('baseStats') || 'Base Stats'}</h3>
          <div className="space-y-3">
            {pokemon.stats.map(statInfo => {
              const percentage = Math.min((statInfo.base_stat / 255) * 100, 100);
              return (
                <div key={statInfo.stat.name}>
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="capitalize text-slate-600 dark:text-slate-300">{t(`stats.${statInfo.stat.name}`) || statInfo.stat.name}</span>
                    <span className="text-slate-800 dark:text-white">{statInfo.base_stat}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${bgColor}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
