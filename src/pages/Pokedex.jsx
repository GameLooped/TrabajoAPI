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
  const [selectedRegion, setSelectedRegion] = useState('');
  const [legendariesOnly, setLegendariesOnly] = useState(false);
  const [legendaryIds, setLegendaryIds] = useState(new Set()); // To store which IDs are legendary

  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const regionData = {
    kanto: { offset: 0, limit: 151 },
    johto: { offset: 151, limit: 100 },
    hoenn: { offset: 251, limit: 135 },
    sinnoh: { offset: 386, limit: 107 },
    unova: { offset: 493, limit: 156 },
    kalos: { offset: 649, limit: 72 },
    alola: { offset: 721, limit: 88 },
    galar: { offset: 809, limit: 89 }, // Includes Hisui
    paldea: { offset: 898, limit: 127 }
  };

  // On mount
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/');
    } else {
      fetchPokemonBatch(0, 50, true);
    }
  }, [navigate]);

  // Fetch pokemon in batches
  const fetchPokemonBatch = async (currentOffset, limit = 50, clearList = false) => {
    try {
      if (clearList) {
        setPokemonList([]);
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
      const data = await res.json();
      
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokeRes = await fetch(pokemon.url);
        return pokeRes.json();
      });

      const newPokemon = await Promise.all(pokemonPromises);
      
      setPokemonList(prev => {
        if (clearList) return newPokemon;
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNew = newPokemon.filter(p => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });

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

  // When Region changes, fetch specific range
  useEffect(() => {
    if (selectedRegion) {
      const { offset: rOffset, limit: rLimit } = regionData[selectedRegion];
      fetchPokemonBatch(rOffset, rLimit, true);
    } else if (pokemonList.length > 0 && clearListCalled.current) {
      // Avoid fetching on first mount since it's handled above, but if cleared, fetch default
      fetchPokemonBatch(0, 50, true);
      setOffset(0);
    }
  }, [selectedRegion]);

  const clearListCalled = React.useRef(false);
  useEffect(() => { clearListCalled.current = true; }, []);

  const handleLoadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchPokemonBatch(newOffset, 50, false);
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
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
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
                isLegendary={legendaryIds.has(pokemon.id)}
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
        
        {!loading && filteredList.length > 0 && !selectedRegion && (
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
