import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Pokedex from './pages/Pokedex';
import Items from './pages/Items';
import Berries from './pages/Berries';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import TypeChart from './pages/TypeChart';
import RandomPokemon from './pages/RandomPokemon';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route element={<Layout />}>
                <Route path="/pokedex" element={<Pokedex />} />
                <Route path="/items" element={<Items />} />
                <Route path="/berries" element={<Berries />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/typechart" element={<TypeChart />} />
                <Route path="/random" element={<RandomPokemon />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </FavoritesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
