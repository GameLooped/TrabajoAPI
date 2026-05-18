import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import PokemonModal from '../components/PokemonModal';
import { useLanguage } from '../context/LanguageContext';

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [legendariesOnly, setLegendariesOnly] = useState(false);
  const [legendaryIds, setLegendaryIds] = useState(new Set()); // To store which IDs are legendary

  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // On mount
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/');
    } else {
      fetchPokemonBatch(0);
    }
  }, [navigate]);

  // Fetch pokemon in batches
  const fetchPokemonBatch = async (currentOffset) => {
    try {
      if (currentOffset === 0) setLoading(true);
      else setIsLoadingMore(true);

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${currentOffset}`);
      const data = await res.json();
      
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokeRes = await fetch(pokemon.url);
        return pokeRes.json();
      });

      const newPokemon = await Promise.all(pokemonPromises);
      
      setPokemonList(prev => {
        // Prevent duplicates in StrictMode
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNew = newPokemon.filter(p => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

      // Pre-fetch some legendary species info in background
      const legends = new Set([144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493]); 
      setLegendaryIds(prev => new Set([...prev, ...legends]));
      
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchPokemonBatch(newOffset);
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

  // Handle logout is now in Layout.jsx

  return (
    <div className="relative">
      <main>
        <div className="sticky top-[140px] md:top-24 z-40 mb-8 transition-all">
          <Filters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            legendariesOnly={legendariesOnly}
            setLegendariesOnly={setLegendariesOnly}
          />
        </div>

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
        
        {!loading && filteredList.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-slate-800 hover:bg-slate-900 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-70 flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  {t('loading')}
                </>
              ) : (
                t('loadMore') || 'Load More'
              )}
            </button>
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
