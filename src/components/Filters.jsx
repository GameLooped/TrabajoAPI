import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export default function Filters({ 
  searchTerm, 
  setSearchTerm, 
  selectedType, 
  setSelectedType, 
  selectedRegion, 
  setSelectedRegion, 
  legendariesOnly, 
  setLegendariesOnly 
}) {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const activeFiltersCount = 
    (selectedType ? 1 : 0) + 
    (selectedRegion ? 1 : 0) + 
    (legendariesOnly ? 1 : 0);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300">
      {/* Sleek Main Search Row */}
      <div className="flex gap-2.5 items-center w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3.5 py-2 sm:py-2.5 border border-slate-200/80 dark:border-slate-700/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/80 focus:border-red-500/80 text-sm font-semibold transition-all"
            placeholder={t('searchPlaceholder') || 'Buscar Pokémon...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer select-none shrink-0 ${
            isOpen || activeFiltersCount > 0
              ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20'
              : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-350 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40'
          }`}
        >
          <SlidersHorizontal size={14} className={isOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
          <span className="hidden xs:inline">{lang === 'es' ? 'Filtros' : 'Filters'}</span>
          {activeFiltersCount > 0 && (
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black leading-none ${
              isOpen || activeFiltersCount > 0 ? 'bg-white text-red-500' : 'bg-red-500 text-white'
            }`}>
              {activeFiltersCount}
            </span>
          )}
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Advanced Drawer Panel */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col md:flex-row gap-3 items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full sm:w-44 pl-3.5 pr-10 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{t('allTypes') || 'Todos los tipos'}</option>
              {types.map(type => (
                <option key={type} value={type}>{t(`types.${type}`)}</option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="block w-full sm:w-38 pl-3.5 pr-10 py-2 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              <option value="">{t('allRegions') || 'Todas las Regiones'}</option>
              <option value="kanto">Kanto</option>
              <option value="johto">Johto</option>
              <option value="hoenn">Hoenn</option>
              <option value="sinnoh">Sinnoh</option>
              <option value="unova">Unova</option>
              <option value="kalos">Kalos</option>
              <option value="alola">Alola</option>
              <option value="galar">Galar</option>
              <option value="paldea">Paldea</option>
            </select>
          </div>

          {/* Legendaries Toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 w-full sm:w-auto justify-end sm:justify-start">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={legendariesOnly}
                onChange={(e) => setLegendariesOnly(e.target.checked)}
              />
              <div className={`block w-11 h-6 rounded-full transition-colors ${legendariesOnly ? 'bg-red-500' : 'bg-slate-350 dark:bg-slate-650'}`}></div>
              <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${legendariesOnly ? 'transform translate-x-5' : ''}`}></div>
            </div>
            <span className="font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-350 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {t('legendariesOnly') || 'Solo Legendarios'}
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
