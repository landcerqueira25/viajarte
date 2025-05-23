// src/App.js - VERSÃO MÍNIMA QUE FUNCIONA
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar apenas as páginas que EXISTEM
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';

// Importar estilos
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirecionar de / para /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Dashboard - lista de viagens */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Visualizar uma viagem específica */}
          <Route path="/trip/:id" element={<TripView />} />
          
          {/* Rotas futuras - por enquanto redirecionam para dashboard */}
          <Route path="/trip/new" element={<Navigate to="/dashboard" />} />
          <Route path="/trip/:id/edit" element={<Navigate to="/dashboard" />} />
          <Route path="/settings" element={<Navigate to="/dashboard" />} />
          
          {/* Catch-all: qualquer rota não encontrada vai para dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;