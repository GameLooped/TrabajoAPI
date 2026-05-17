import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import PokemonModal from '../components/PokemonModal';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [legendariesOnly, setLegendariesOnly] = useState(false);
  const [legendaryIds, setLegendaryIds] = useState(new Set()); // To store which IDs are legendary

  const { t, lang, toggleLanguage } = useLanguage();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // On mount
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/');
    } else {
      fetchAllPokemon();
    }
  }, [navigate]);

  // Initial bulk fetch for names to allow search/filtering
  const fetchAllPokemon = async () => {
    try {
      setLoading(true);
      // Fetch a larger amount (e.g. 151 for Gen 1, or more) to allow local filtering
      // To keep it performant for the demo, let's fetch 151
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();
      
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokeRes = await fetch(pokemon.url);
        return pokeRes.json();
      });

      const newPokemon = await Promise.all(pokemonPromises);
      setPokemonList(newPokemon);
      setFilteredList(newPokemon);

      // Pre-fetch some legendary species info in background for the first 151 
      // (Articuno=144, Zapdos=145, Moltres=146, Mewtwo=150, Mew=151 is mythical but let's count it)
      const legends = new Set([144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251]); // Hardcoded some for quick demo, a real app would fetch species data
      setLegendaryIds(legends);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setLoading(false);
    }
  };

  // Apply filters whenever states change
  useEffect(() => {
    let result = pokemonList;

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedType) {
      result = result.filter(p => p.types.some(tInfo => tInfo.type.name === selectedType));
    }

    if (legendariesOnly) {
      result = result.filter(p => legendaryIds.has(p.id));
    }

    setFilteredList(result);
  }, [searchTerm, selectedType, legendariesOnly, pokemonList, legendaryIds]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-800 dark:border-slate-900 relative overflow-hidden flex items-center justify-center">
             <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800 dark:border-slate-900"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-white border border-slate-800 dark:border-slate-900 relative z-10"></div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Nexus<span className="text-red-500">Dex</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">{t('welcome')}, Ash!</span>
          <div className="flex gap-2">
            <button 
              onClick={toggleTheme}
              className="bg-white/80 dark:bg-slate-800/80 p-2 rounded-full shadow-sm text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleLanguage}
              className="bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full shadow-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            >
              {lang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-4 py-2 rounded-full font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </header>

      <main>
        <Filters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          legendariesOnly={legendariesOnly}
          setLegendariesOnly={setLegendariesOnly}
        />

        {pokemonList.length === 0 && loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
            {filteredList.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 font-medium text-lg">
                No Pokémon found matching your criteria.
              </div>
            )}
          </div>
        )}
        
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      </main>
    </div>
  );
}
