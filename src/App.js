// src/App.js - VERSÃO COMPLETA COM TODAS AS PÁGINAS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar todas as páginas
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import TripEditor from './pages/TripEditor';
import Settings from './pages/Settings';

// Importar estilos
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
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
          
          {/* Rota catch-all: qualquer rota não encontrada vai para Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;