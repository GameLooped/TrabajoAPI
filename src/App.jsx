import React, { useState, useEffect } from 'react';
import './index.css';
import PokemonCard from './components/PokemonCard';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextUrl, setNextUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20');

  const fetchPokemonData = async (url) => {
    try {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      
      setNextUrl(data.next);

      // Fetch details for each pokemon
      const pokemonPromises = data.results.map(async (pokemon) => {
        const pokeRes = await fetch(pokemon.url);
        return pokeRes.json();
      });

      const newPokemon = await Promise.all(pokemonPromises);
      setPokemonList((prev) => [...prev, ...newPokemon]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData('https://pokeapi.co/api/v2/pokemon?limit=20');
  }, []);

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-4">
          <span className="text-red-500">Poké</span>dex
          <div className="w-8 h-8 rounded-full bg-white border-4 border-slate-800 relative overflow-hidden flex items-center justify-center">
             <div className="absolute top-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800"></div>
             <div className="w-2 h-2 rounded-full bg-white border border-slate-800 relative z-10"></div>
          </div>
        </h1>
        <p className="text-slate-500 mt-4 text-lg">
          Browse through the incredible world of Pokémon
        </p>
      </header>

      <main>
        {pokemonList.length === 0 && loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              {nextUrl && (
                <button 
                  onClick={() => fetchPokemonData(nextUrl)}
                  disabled={loading}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    'Load More Pokémon'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
