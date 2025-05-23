// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirecionar de / para /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          {/* Página do Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Página de visualização da viagem */}
          <Route path="/trip/:id" element={<TripView />} />
          
          {/* Futuramente: outras rotas */}
          {/* <Route path="/trip/new" element={<TripEditor />} /> */}
          {/* <Route path="/trip/:id/edit" element={<TripEditor />} /> */}
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;