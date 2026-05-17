import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const typeColors = {
  normal: 'bg-stone-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-orange-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-800',
  ghost: 'bg-indigo-800',
  dragon: 'bg-indigo-600',
  dark: 'bg-slate-800',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300',
};

export default function PokemonCard({ pokemon, onClick }) {
  const { t } = useLanguage();
  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || 'bg-slate-200';

  return (
    <div 
      onClick={onClick}
      className={`relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-transform hover:-translate-y-2 hover:shadow-xl ${bgColor} bg-opacity-20 dark:bg-opacity-30`}
    >
      <div className={`absolute top-0 left-0 w-full h-24 ${bgColor} bg-opacity-60 dark:bg-opacity-80 rounded-b-[40%]`}></div>
      
      <div className="relative p-6 pt-8 flex flex-col items-center">
        <div className="absolute top-4 right-4 text-slate-700/50 font-bold text-xl">
          #{String(pokemon.id).padStart(3, '0')}
        </div>
        
        <div className="w-32 h-32 mb-4 relative z-10 flex items-center justify-center">
          <img 
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="w-full h-full object-contain drop-shadow-xl transition-transform group-hover:scale-110"
          />
        </div>
        
        <h2 className="text-2xl font-bold capitalize text-slate-800 dark:text-white mb-2">{pokemon.name}</h2>
        
        <div className="flex gap-2 mb-4 flex-wrap justify-center">
          {pokemon.types.map((typeInfo) => (
            <span 
              key={typeInfo.type.name}
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm ${typeColors[typeInfo.type.name]}`}
            >
              {t(`types.${typeInfo.type.name}`).toUpperCase()}
            </span>
          ))}
        </div>

        <div className="w-full grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-1">{t('height')}</p>
            <p className="font-bold text-slate-800 dark:text-white">{pokemon.height / 10} m</p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-1">{t('weight')}</p>
            <p className="font-bold text-slate-800 dark:text-white">{pokemon.weight / 10} kg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
