import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ItemCard({ item }) {
  const { lang } = useLanguage();

  // Find flavor text in current language, fallback to english
  const entry = item.flavor_text_entries.find(e => e.language.name === lang);
  const fallback = item.flavor_text_entries.find(e => e.language.name === 'en');
  const description = entry ? entry.text : (fallback ? fallback.text : 'No description available.');

  // Find name in current language
  const nameEntry = item.names.find(n => n.language.name === lang);
  const displayName = nameEntry ? nameEntry.name : item.name.replace('-', ' ');

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center">
      <div className="w-20 h-20 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
        <img 
          src={item.sprites.default} 
          alt={displayName} 
          className="w-12 h-12 object-contain"
        />
      </div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-white capitalize mb-2">{displayName}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
