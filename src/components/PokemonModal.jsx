import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { X, Volume2, Sparkles, Image as ImageIcon, Layers } from 'lucide-react';

const typeColors = {
  normal: 'bg-stone-400', fire: 'bg-red-500', water: 'bg-blue-500', electric: 'bg-yellow-400',
  grass: 'bg-green-500', ice: 'bg-cyan-300', fighting: 'bg-orange-700', poison: 'bg-purple-500',
  ground: 'bg-yellow-600', flying: 'bg-indigo-300', psychic: 'bg-pink-500', bug: 'bg-lime-500',
  rock: 'bg-yellow-800', ghost: 'bg-indigo-800', dragon: 'bg-indigo-600', dark: 'bg-slate-800',
  steel: 'bg-slate-400', fairy: 'bg-pink-300',
};

// Same set from Pokedex — needed to detect legendary in modal
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

export default function PokemonModal({ pokemon, onClose }) {
  const { t, lang } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isShiny, setIsShiny] = useState(false);
  
  const [speciesData, setSpeciesData] = useState(null);
  const [description, setDescription] = useState('');
  const [evolutionChain, setEvolutionChain] = useState([]);
  const [typeRelations, setTypeRelations] = useState({ weaknesses: [], resistances: [], immunities: [] });
  const [imageStyle, setImageStyle] = useState('official'); // official, showdown, pixel
  const [isLoadingExtra, setIsLoadingExtra] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    if (pokemon) {
      setActiveTab('profile');
      setIsShiny(false);
      setIsLoadingExtra(true);
      setEvolutionChain([]);
      setDescription('');
      setTypeRelations({ weaknesses: [], resistances: [], immunities: [] });

      if (pokemon.cries && pokemon.cries.latest) {
        audioRef.current = new Audio(pokemon.cries.latest);
        audioRef.current.volume = 0.5;
      } else {
        audioRef.current = null;
      }

      fetch(pokemon.species.url)
        .then(res => res.json())
        .then(data => {
          setSpeciesData(data);
          
          // Find Description
          const entry = data.flavor_text_entries.find(e => e.language.name === lang);
          const fallback = data.flavor_text_entries.find(e => e.language.name === 'en');
          if (entry) setDescription(entry.flavor_text.replace(/[\f\n\r]/g, ' '));
          else if (fallback) setDescription(fallback.flavor_text.replace(/[\f\n\r]/g, ' '));

          // Fetch Evolution Chain
          if (data.evolution_chain && data.evolution_chain.url) {
            return fetch(data.evolution_chain.url).then(res => res.json());
          }
          return null;
        })
        .then(evoData => {
          if (evoData) {
            const extractEvolutions = (node, chainList = []) => {
              if (!node) return chainList;
              const id = node.species.url.split('/').filter(Boolean).pop();
              chainList.push({ name: node.species.name, id });
              if (node.evolves_to && node.evolves_to.length > 0) {
                // For branching evolutions we just take the first path for simplicity, or map all. 
                // We map all branches:
                node.evolves_to.forEach(branch => extractEvolutions(branch, chainList));
              }
              return chainList;
            };
            
            // Handle branching properly by creating a linear or unique list of all evolutions
            const uniqueEvos = [];
            const rawEvos = extractEvolutions(evoData.chain);
            // filter duplicates (Eevee branches will just be listed)
            rawEvos.forEach(evo => {
              if (!uniqueEvos.find(e => e.id === evo.id)) uniqueEvos.push(evo);
            });
            
            setEvolutionChain(uniqueEvos);
          }
          setIsLoadingExtra(false);
        })
        .catch(err => {
          console.error("Error fetching species/evo:", err);
          setIsLoadingExtra(false);
        });

      // Fetch Type Relations
      const typePromises = pokemon.types.map(tInfo => fetch(tInfo.type.url).then(res => res.json()));
      Promise.all(typePromises).then(typesData => {
        const damageMultipliers = {};
        typesData.forEach(typeData => {
          const rel = typeData.damage_relations;
          rel.double_damage_from.forEach(t => { damageMultipliers[t.name] = (damageMultipliers[t.name] || 1) * 2; });
          rel.half_damage_from.forEach(t => { damageMultipliers[t.name] = (damageMultipliers[t.name] || 1) * 0.5; });
          rel.no_damage_from.forEach(t => { damageMultipliers[t.name] = 0; });
        });

        const weaknesses = Object.keys(damageMultipliers).filter(t => damageMultipliers[t] > 1);
        const resistances = Object.keys(damageMultipliers).filter(t => damageMultipliers[t] < 1 && damageMultipliers[t] > 0);
        const immunities = Object.keys(damageMultipliers).filter(t => damageMultipliers[t] === 0);

        setTypeRelations({ weaknesses, resistances, immunities });
      }).catch(err => console.error("Error fetching types:", err));
    }
  }, [pokemon, lang]);

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType] || 'bg-slate-200';
  const isLegendary = ALL_LEGENDARY_IDS.has(pokemon.id);

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play blocked:', e));
    }
  };

  let spriteUrl = '';
  if (imageStyle === 'official') {
    spriteUrl = isShiny 
      ? (pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny)
      : (pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default);
  } else if (imageStyle === 'showdown') {
    spriteUrl = isShiny 
      ? (pokemon.sprites.other?.showdown?.front_shiny || pokemon.sprites.front_shiny)
      : (pokemon.sprites.other?.showdown?.front_default || pokemon.sprites.front_default);
  } else {
    spriteUrl = isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Image & Core Info */}
        <div className={`w-full md:w-2/5 p-6 md:p-8 flex flex-col items-center justify-center relative shrink-0 ${isLegendary ? 'legendary-rainbow-bg' : `${bgColor} bg-opacity-20 dark:bg-opacity-40`}`}>
          <div className="absolute top-4 left-4 text-slate-600/50 dark:text-slate-400/50 font-black text-5xl">
            #{String(pokemon.id).padStart(3, '0')}
          </div>
          
          <img 
            src={spriteUrl} 
            alt={pokemon.name} 
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain drop-shadow-2xl z-10 transition-transform duration-500 hover:scale-110"
          />

          <div className="flex gap-4 mt-6 z-10">
            {audioRef.current && (
              <button 
                onClick={playCry}
                className="bg-white/80 dark:bg-slate-700/80 p-3 rounded-full shadow-md text-slate-800 dark:text-slate-200 hover:scale-110 transition-transform"
                title="Play Cry"
              >
                <Volume2 size={24} />
              </button>
            )}
            <button 
              onClick={() => setIsShiny(!isShiny)}
              className={`p-3 rounded-full shadow-md transition-transform hover:scale-110 ${isShiny ? 'bg-yellow-400 text-yellow-900' : 'bg-white/80 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200'}`}
              title="Toggle Shiny"
            >
              {isShiny ? <Sparkles size={24} /> : <Sparkles size={24} className="opacity-50" />}
            </button>
            <button 
              onClick={() => {
                if (imageStyle === 'official') setImageStyle('showdown');
                else if (imageStyle === 'showdown') setImageStyle('pixel');
                else setImageStyle('official');
              }}
              className="bg-white/80 dark:bg-slate-700/80 p-3 rounded-full shadow-md text-slate-800 dark:text-slate-200 hover:scale-110 transition-transform"
              title={t('imageStyle') || 'Image Style'}
            >
              {imageStyle === 'official' && <ImageIcon size={24} />}
              {imageStyle === 'showdown' && <Layers size={24} />}
              {imageStyle === 'pixel' && <div className="font-bold text-xs w-6 h-6 flex items-center justify-center">8b</div>}
            </button>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-full backdrop-blur-sm z-10">
            {imageStyle === 'official' ? t('styleOfficial') : imageStyle === 'showdown' ? t('styleAnimated') : t('stylePixel')}
          </div>
        </div>

        {/* Right Side: Data Tabs */}
        <div className="w-full md:w-3/5 flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-800">
          {/* Header */}
          <div className="p-6 pb-0 flex justify-between items-start shrink-0">
            <div>
              <h2 className="text-4xl font-black capitalize text-slate-800 dark:text-white mb-2">{pokemon.name}</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
                {pokemon.types.map((typeInfo) => (
                  <span 
                    key={typeInfo.type.name}
                    className={`px-4 py-1 rounded-full text-sm font-bold text-white shadow-sm ${typeColors[typeInfo.type.name]}`}
                  >
                    {t(`types.${typeInfo.type.name}`).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-800 dark:text-slate-100" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 gap-6 shrink-0">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'profile' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {t('profile')}
            </button>
            <button 
              onClick={() => setActiveTab('evolutions')}
              className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'evolutions' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {t('evolutions')}
            </button>
            <button 
              onClick={() => setActiveTab('moves')}
              className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'moves' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {t('moves')}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {description && (
                  <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed border-l-4 border-red-500 pl-4 py-1">
                    "{description}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-1">{t('height')}</p>
                    <p className="font-bold text-slate-800 dark:text-white text-lg">{pokemon.height / 10} m</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-500 dark:text-slate-400 font-semibold text-xs mb-1">{t('weight')}</p>
                    <p className="font-bold text-slate-800 dark:text-white text-lg">{pokemon.weight / 10} kg</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('abilities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.abilities.map(ab => (
                      <span key={ab.ability.name} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-semibold capitalize border border-slate-200 dark:border-slate-600">
                        {ab.ability.name.replace('-', ' ')} {ab.is_hidden && '(Hidden)'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TYPE RELATIONS */}
                <div className="space-y-4 bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  {typeRelations.weaknesses.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('weaknesses') || 'Weaknesses'}</h4>
                      <div className="flex flex-wrap gap-1">
                        {typeRelations.weaknesses.map(type => (
                          <span key={type} className={`px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm ${typeColors[type]}`}>
                            {t(`types.${type}`).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {typeRelations.resistances.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('resistances') || 'Resistances'}</h4>
                      <div className="flex flex-wrap gap-1">
                        {typeRelations.resistances.map(type => (
                          <span key={type} className={`px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm ${typeColors[type]}`}>
                            {t(`types.${type}`).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {typeRelations.immunities.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-2">{t('immunities') || 'Immunities'}</h4>
                      <div className="flex flex-wrap gap-1">
                        {typeRelations.immunities.map(type => (
                          <span key={type} className={`px-2 py-0.5 rounded text-xs font-bold text-white shadow-sm ${typeColors[type]}`}>
                            {t(`types.${type}`).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {speciesData && (
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold">{t('captureRate')}</p>
                      <p className="font-bold text-slate-800 dark:text-white">{speciesData.capture_rate}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold">{t('habitat')}</p>
                      <p className="font-bold text-slate-800 dark:text-white capitalize">{speciesData.habitat ? speciesData.habitat.name : 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold">{t('growthRate')}</p>
                      <p className="font-bold text-slate-800 dark:text-white capitalize">{speciesData.growth_rate.name.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 font-semibold">{t('color')}</p>
                      <p className="font-bold text-slate-800 dark:text-white capitalize">{speciesData.color.name}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{t('baseStats')}</h3>
                  <div className="space-y-3">
                    {pokemon.stats.map(statInfo => {
                      const percentage = Math.min((statInfo.base_stat / 255) * 100, 100);
                      return (
                        <div key={statInfo.stat.name}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="capitalize text-slate-600 dark:text-slate-300">{t(`stats.${statInfo.stat.name}`) || statInfo.stat.name}</span>
                            <span className="text-slate-800 dark:text-white font-bold">{statInfo.base_stat}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div className={`h-2 rounded-full ${bgColor}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* EVOLUTIONS TAB */}
            {activeTab === 'evolutions' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full">
                {isLoadingExtra ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                ) : evolutionChain.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {evolutionChain.map((evo, index) => (
                      <div key={evo.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                        <img 
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                          alt={evo.name}
                          className="w-16 h-16 drop-shadow-md"
                        />
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">#{String(evo.id).padStart(3, '0')}</p>
                          <p className="text-lg font-bold text-slate-800 dark:text-white capitalize">{evo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">No evolution data available.</p>
                )}
              </div>
            )}

            {/* MOVES TAB */}
            {activeTab === 'moves' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pokemon.moves.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm capitalize">
                        {m.move.name.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
