// src/App.js - VERSÃO CORRIGIDA PARA NETLIFY
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar todas as páginas com extensões explícitas
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TripView from './pages/TripView.jsx';
import TripEditor from './pages/EnhancedTripEditor';
import Settings from './pages/Settings.jsx';

// Importar estilos
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial - Home */}
          <Route path="/" element={<Home />} />
          
          {/* Dashboard - lista de viagens */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Visualizar uma viagem específica */}
          <Route path="/trip/:id" element={<TripView />} />
          
          {/* Criar nova viagem */}
          <Route path="/trip/new" element={<TripEditor />} />
          
          {/* Editar viagem existente */}
          <Route path="/trip/:id/edit" element={<TripEditor />} />
          
          {/* Configurações */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Catch-all: qualquer rota não encontrada vai para Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;