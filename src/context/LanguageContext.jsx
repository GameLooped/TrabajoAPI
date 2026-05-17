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
    types: {
      normal: 'Normal', fire: 'Fuego', water: 'Agua', electric: 'Eléctrico',
      grass: 'Planta', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
      ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', bug: 'Bicho',
      rock: 'Roca', ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro',
      steel: 'Acero', fairy: 'Hada'
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
    types: {
      normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
      grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
      ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
      rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
      steel: 'Steel', fairy: 'Fairy'
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
