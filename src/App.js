// src/App.js - VERSÃO CORRIGIDA E SIMPLIFICADA
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar páginas com try/catch para evitar erros de build
let Home, Dashboard, TripView, TripEditor, Settings;

try {
  Home = require('./pages/Home.jsx').default;
} catch (e) {
  console.error('Erro ao importar Home:', e);
  Home = () => <div>Erro ao carregar página Home</div>;
}

try {
  Dashboard = require('./pages/Dashboard.jsx').default;
} catch (e) {
  console.error('Erro ao importar Dashboard:', e);
  Dashboard = () => <div>Erro ao carregar Dashboard</div>;
}

try {
  TripView = require('./pages/TripView.jsx').default;
} catch (e) {
  console.error('Erro ao importar TripView:', e);
  TripView = () => <div>Erro ao carregar TripView</div>;
}

try {
  TripEditor = require('./pages/EnhancedTripEditor').default;
} catch (e) {
  console.error('Erro ao importar TripEditor:', e);
  TripEditor = () => <div>Erro ao carregar TripEditor</div>;
}

try {
  Settings = require('./pages/Settings.jsx').default;
} catch (e) {
  console.error('Erro ao importar Settings:', e);
  Settings = () => <div>Erro ao carregar Settings</div>;
}

// Importar estilos
import './index.css';

// Componente de erro
const ErrorBoundary = ({ children, fallback = "Algo deu errado" }) => {
  try {
    return children;
  } catch (error) {
    console.error('ErrorBoundary capturou erro:', error);
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: '#f8f9fa',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
            Oops! Algo deu errado
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            {fallback}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#7C9A92',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🔄 Recarregar Página
          </button>
        </div>
      </div>
    );
  }
};

// Página 404
const NotFound = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧭</div>
      <h1 style={{ fontSize: '2rem', color: '#2C3639', marginBottom: '1rem' }}>
        404 - Página Não Encontrada
      </h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
        A página que você procura não foi encontrada.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          backgroundColor: '#7C9A92',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        🏠 Voltar ao Início
      </button>
    </div>
  </div>
);

function App() {
  console.log('🚀 Viajarte iniciando...');

  return (
    <ErrorBoundary fallback="Erro geral da aplicação">
      <Router>
        <div className="App">
          <Routes>
            {/* Página inicial */}
            <Route 
              path="/" 
              element={
                <ErrorBoundary fallback="Erro na página Home">
                  <Home />
                </ErrorBoundary>
              } 
            />
            
            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ErrorBoundary fallback="Erro no Dashboard">
                  <Dashboard />
                </ErrorBoundary>
              } 
            />
            
            {/* Visualizar viagem */}
            <Route 
              path="/trip/:id" 
              element={
                <ErrorBoundary fallback="Erro ao visualizar viagem">
                  <TripView />
                </ErrorBoundary>
              } 
            />
            
            {/* Criar nova viagem */}
            <Route 
              path="/trip/new" 
              element={
                <ErrorBoundary fallback="Erro no editor de viagem">
                  <TripEditor />
                </ErrorBoundary>
              } 
            />
            
            {/* Editar viagem */}
            <Route 
              path="/trip/:id/edit" 
              element={
                <ErrorBoundary fallback="Erro no editor de viagem">
                  <TripEditor />
                </ErrorBoundary>
              } 
            />
            
            {/* Configurações */}
            <Route 
              path="/settings" 
              element={
                <ErrorBoundary fallback="Erro nas configurações">
                  <Settings />
                </ErrorBoundary>
              } 
            />

            {/* Redirecionamentos */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/viagens" element={<Navigate to="/dashboard" replace />} />
            <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;