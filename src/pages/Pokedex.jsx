import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Filters from '../components/Filters';
import PokemonModal from '../components/PokemonModal';
import { useLanguage } from '../context/LanguageContext';

// Complete legendary & mythical IDs across ALL generations
const ALL_LEGENDARY_IDS = new Set([
  // Gen 1 - Kanto
  144, 145, 146, 150, 151,
  // Gen 2 - Johto
  243, 244, 245, 249, 250, 251,
  // Gen 3 - Hoenn
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  // Gen 4 - Sinnoh
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493,
  // Gen 5 - Unova
  494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  // Gen 6 - Kalos
  716, 717, 718, 719, 720, 721,
  // Gen 7 - Alola
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809,
  // Gen 8 - Galar
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898,
  // Gen 9 - Paldea
  1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024, 1025
]);

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

  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const clearListCalled = useRef(false);

  const regionData = {
    kanto: { offset: 0, limit: 151 },
    johto: { offset: 151, limit: 100 },
    hoenn: { offset: 251, limit: 135 },
    sinnoh: { offset: 386, limit: 107 },
    unova: { offset: 493, limit: 156 },
    kalos: { offset: 649, limit: 72 },
    alola: { offset: 721, limit: 88 },
    galar: { offset: 809, limit: 89 },
    paldea: { offset: 898, limit: 127 }
  };

  const regionLegendaries = {
    kanto: [144, 145, 146, 150, 151],
    johto: [243, 244, 245, 249, 250, 251],
    hoenn: [377, 378, 379, 380, 381, 382, 383, 384, 385, 386],
    sinnoh: [480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493],
    unova: [494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649],
    kalos: [716, 717, 718, 719, 720, 721],
    alola: [772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 801, 802, 807, 808, 809],
    galar: [888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898],
    paldea: [1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024, 1025]
  };

  // On mount
  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) {
      navigate('/');
    } else {
      fetchPokemonBatch(0, 50, true);
    }
  }, [navigate]);

  // Fetch pokemon in batches (by offset/limit from the list endpoint)
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
      
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Fetch specific pokemon by their IDs (for legendaries)
  const fetchPokemonByIds = async (ids) => {
    try {
      setPokemonList([]);
      setLoading(true);

      const pokemonPromises = ids.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return res.json();
      });

      const results = await Promise.all(pokemonPromises);
      setPokemonList(results.sort((a, b) => a.id - b.id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching legendary Pokemon:", error);
      setLoading(false);
    }
  };

  // React to region + legendary changes
  useEffect(() => {
    if (!clearListCalled.current) return; // skip first render

    if (legendariesOnly) {
      if (selectedRegion) {
        // Fetch legendaries of that specific region
        fetchPokemonByIds(regionLegendaries[selectedRegion] || []);
      } else {
        // Fetch ALL legendaries
        fetchPokemonByIds([...ALL_LEGENDARY_IDS]);
      }
    } else {
      if (selectedRegion) {
        const { offset: rOffset, limit: rLimit } = regionData[selectedRegion];
        fetchPokemonBatch(rOffset, rLimit, true);
      } else {
        fetchPokemonBatch(0, 50, true);
        setOffset(0);
      }
    }
  }, [selectedRegion, legendariesOnly]);

  useEffect(() => { clearListCalled.current = true; }, []);

  const handleLoadMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    fetchPokemonBatch(newOffset, 50, false);
  };

  // Apply text/type filters
  useEffect(() => {
    let result = pokemonList;

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedType) {
      result = result.filter(p => p.types.some(tInfo => tInfo.type.name === selectedType));
    }

    setFilteredList(result);
  }, [searchTerm, selectedType, pokemonList]);

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

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id} 
                pokemon={pokemon} 
                isLegendary={ALL_LEGENDARY_IDS.has(pokemon.id)}
                onClick={() => setSelectedPokemon(pokemon)}
              />
            ))}
            {filteredList.length === 0 && !loading && (
              <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 font-medium text-lg">
                No Pokémon found matching your criteria.
              </div>
            )}
          </div>
        )}
        
        {!loading && filteredList.length > 0 && !selectedRegion && !legendariesOnly && (
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
