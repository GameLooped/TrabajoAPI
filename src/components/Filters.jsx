import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';

export default function Filters({ searchTerm, setSearchTerm, selectedType, setSelectedType, legendariesOnly, setLegendariesOnly }) {
  const { t } = useLanguage();

  const types = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="block w-full sm:w-48 pl-3 pr-10 py-3 text-base border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border"
        >
          <option value="">{t('allTypes')}</option>
          {types.map(type => (
            <option key={type} value={type}>{t(`types.${type}`)}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={legendariesOnly}
              onChange={(e) => setLegendariesOnly(e.target.checked)}
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${legendariesOnly ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${legendariesOnly ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {t('legendariesOnly')}
          </span>
        </label>
      </div>
    </div>
  );
}
