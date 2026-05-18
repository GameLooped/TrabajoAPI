import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (pokemon) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === pokemon.id);
      if (exists) {
        return prev.filter(p => p.id !== pokemon.id);
      } else {
        // Store minimal data to save space
        return [...prev, {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
          sprites: {
            front_default: pokemon.sprites.front_default,
            other: {
              'official-artwork': {
                front_default: pokemon.sprites.other?.['official-artwork']?.front_default
              }
            }
          },
          height: pokemon.height,
          weight: pokemon.weight,
          stats: pokemon.stats,
          abilities: pokemon.abilities,
          moves: pokemon.moves?.slice(0, 20) || [], // limit moves to save space
          species: pokemon.species,
          cries: pokemon.cries
        }];
      }
    });
  };

  const isFavorite = (id) => favorites.some(p => p.id === id);

  // Team management (max 6)
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('pokemonTeam');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('pokemonTeam', JSON.stringify(team));
  }, [team]);

  const toggleTeamMember = (pokemon) => {
    setTeam(prev => {
      const exists = prev.find(p => p.id === pokemon.id);
      if (exists) {
        return prev.filter(p => p.id !== pokemon.id);
      } else if (prev.length < 6) {
        return [...prev, {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
          sprites: {
            front_default: pokemon.sprites.front_default,
            other: {
              'official-artwork': {
                front_default: pokemon.sprites.other?.['official-artwork']?.front_default
              }
            }
          },
          height: pokemon.height,
          weight: pokemon.weight,
          stats: pokemon.stats,
          abilities: pokemon.abilities,
          species: pokemon.species
        }];
      }
      return prev; // Team full
    });
  };

  const isInTeam = (id) => team.some(p => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, team, toggleTeamMember, isInTeam }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
