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
    favorites: 'Favoritos',
    myTeam: 'Mi Equipo',
    teamAnalysis: 'Análisis del Equipo',
    typeCoverage: 'Cobertura de tipos',
    noFavorites: 'No tienes favoritos aún. ¡Haz clic en el ❤️ de cualquier Pokémon!',
    noTeam: 'Tu equipo está vacío. ¡Haz clic en el 🛡️ para agregar hasta 6 Pokémon!',
    comparator: 'Comparador',
    compareDesc: 'Compara las estadísticas de dos Pokémon lado a lado',
    statComparison: 'Comparación de Stats',
    winner: 'Ganador',
    tie: '¡Empate!',
    typeChart: 'Tabla de Tipos',
    typeChartDesc: 'Filas = Atacante, Columnas = Defensor',
    randomPokemon: 'Pokémon Aleatorio',
    randomDesc: '¡Descubre un Pokémon al azar!',
    clickForMore: 'Haz clic para ver más detalles',
    pressThePokeball: '¡Presiona la Pokébola!',
    random: 'Aleatorio',
    allRegions: 'Todas las Regiones',
    legendary: 'Legendario',
    whosThat: '¿Quién es ese Pokémon?',
    whosThatDesc: '¡Adivina el Pokémon por su silueta!',
    score: 'Puntos',
    streak: 'Racha',
    best: 'Mejor',
    typeName: 'Escribe el nombre...',
    correct: '¡Correcto!',
    wrong: 'Incorrecto',
    next: 'Siguiente',
    recentHistory: 'Historial reciente',
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
    favorites: 'Favorites',
    myTeam: 'My Team',
    teamAnalysis: 'Team Analysis',
    typeCoverage: 'Type coverage',
    noFavorites: 'No favorites yet. Click the ❤️ on any Pokémon!',
    noTeam: 'Your team is empty. Click the 🛡️ to add up to 6 Pokémon!',
    comparator: 'Comparator',
    compareDesc: 'Compare stats of two Pokémon side by side',
    statComparison: 'Stat Comparison',
    winner: 'Winner',
    tie: 'Tie!',
    typeChart: 'Type Chart',
    typeChartDesc: 'Rows = Attacker, Columns = Defender',
    randomPokemon: 'Random Pokémon',
    randomDesc: 'Discover a random Pokémon!',
    clickForMore: 'Click for more details',
    pressThePokeball: 'Press the Pokéball!',
    random: 'Random',
    allRegions: 'All Regions',
    legendary: 'Legendary',
    whosThat: 'Who\'s That Pokémon?',
    whosThatDesc: 'Guess the Pokémon by its silhouette!',
    score: 'Score',
    streak: 'Streak',
    best: 'Best',
    typeName: 'Type the name...',
    correct: 'Correct!',
    wrong: 'Wrong',
    next: 'Next',
    recentHistory: 'Recent history',
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
