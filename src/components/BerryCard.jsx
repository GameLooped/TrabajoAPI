import React from 'react';

export default function BerryCard({ berry }) {
  const displayName = berry.name.replace('-', ' ');
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`;

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center">
      <div className="w-20 h-20 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
        <img 
          src={spriteUrl} 
          alt={displayName} 
          className="w-12 h-12 object-contain"
        />
      </div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-white capitalize mb-2">{displayName}</h3>
      
      <div className="w-full mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
          <p className="text-slate-400 font-bold mb-1">Size</p>
          <p className="text-slate-800 dark:text-slate-200 font-semibold">{berry.size} mm</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">
          <p className="text-slate-400 font-bold mb-1">Firmness</p>
          <p className="text-slate-800 dark:text-slate-200 font-semibold capitalize">{berry.firmness.name.replace('-', ' ')}</p>
        </div>
      </div>
    </div>
  );
}
