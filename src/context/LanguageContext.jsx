import React, { createContext, useState, useContext } from 'react';

const translations = {
  es: {
    login: 'Iniciar Sesión',
    register: 'Crear Cuenta',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    enter: 'Entrar',
    searchPlaceholder: 'Buscar Pokémon por nombre...',
    loadMore: 'Cargar más Pokémon',
    loading: 'Cargando...',
    legendariesOnly: 'Solo Legendarios',
    allTypes: 'Todos los tipos',
    height: 'Altura',
    weight: 'Peso',
    logout: 'Cerrar Sesión',
    welcome: 'Bienvenido',
    baseStats: 'Estadísticas Base',
    profile: 'Perfil',
    evolutions: 'Evoluciones',
    moves: 'Movimientos',
    abilities: 'Habilidades',
    habitat: 'Hábitat',
    captureRate: 'Tasa de Captura',
    growthRate: 'Crecimiento',
    eggGroups: 'Grupos Huevo',
    color: 'Color',
    items: 'Objetos',
    berries: 'Bayas',
    pokemon: 'Pokémon',
    weaknesses: 'Debilidades',
    resistances: 'Resistencias',
    immunities: 'Inmunidades',
    imageStyle: 'Estilo de Imagen',
    styleOfficial: 'Oficial',
    styleAnimated: 'Animado',
    stylePixel: 'Clásico',
    types: {
      normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
      grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
      ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
      rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
      steel: 'Acero', fairy: 'Hada'
    },
    stats: {
      hp: 'PS',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      speed: 'Velocidad'
    }
  },
  en: {
    login: 'Login',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    enter: 'Enter',
    searchPlaceholder: 'Search Pokemon by name...',
    loadMore: 'Load more Pokémon',
    loading: 'Loading...',
    legendariesOnly: 'Legendaries Only',
    allTypes: 'All types',
    height: 'Height',
    weight: 'Weight',
    logout: 'Logout',
    welcome: 'Welcome',
    baseStats: 'Base Stats',
    profile: 'Profile',
    evolutions: 'Evolutions',
    moves: 'Moves',
    abilities: 'Abilities',
    habitat: 'Habitat',
    captureRate: 'Capture Rate',
    growthRate: 'Growth Rate',
    eggGroups: 'Egg Groups',
    color: 'Color',
    items: 'Items',
    berries: 'Berries',
    pokemon: 'Pokémon',
    weaknesses: 'Weaknesses',
    resistances: 'Resistances',
    immunities: 'Immunities',
    imageStyle: 'Image Style',
    styleOfficial: 'Official',
    styleAnimated: 'Animated',
    stylePixel: 'Classic',
    types: {
      normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
      grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
      ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
      rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
      steel: 'Steel', fairy: 'Fairy'
    },
    stats: {
      hp: 'HP',
      attack: 'Attack',
      defense: 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      speed: 'Speed'
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es'); // Default spanish

  const toggleLanguage = () => {
    setLang(prev => (prev === 'es' ? 'en' : 'es'));
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
