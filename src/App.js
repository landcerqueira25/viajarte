// src/App.js - VERSÃO SEGURA PARA BUILD NO NETLIFY
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações diretas e seguras
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TripView from './pages/TripView';
import TripEditor from './pages/EnhancedTripEditor';
import Settings from './pages/Settings';

// Importar estilos
import './index.css';

// Componente de erro para fallback
const ErrorFallback = ({ error, resetError }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    textAlign: 'center'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      maxWidth: '500px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>
        Oops! Algo deu errado
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Houve um erro inesperado. Vamos tentar recarregar a página.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
          🔄 Recarregar
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#D9A6A0',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🏠 Início
        </button>
      </div>
      {error && (
        <details style={{
          marginTop: '1rem',
          textAlign: 'left',
          fontSize: '0.8rem',
          color: '#666'
        }}>
          <summary>Ver detalhes do erro</summary>
          <pre style={{ 
            marginTop: '0.5rem', 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {error.toString()}
          </pre>
        </details>
      )}
    </div>
  </div>
);

// Página 404 customizada
const NotFound = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#f8f9fa',
    textAlign: 'center'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧭</div>
      <h1 style={{ 
        fontSize: '2rem', 
        color: '#2C3639', 
        marginBottom: '1rem',
        fontFamily: 'Cormorant Garamond, serif'
      }}>
        404 - Página Não Encontrada
      </h1>
      <p style={{ 
        color: '#666', 
        fontSize: '1.1rem',
        marginBottom: '1.5rem'
      }}>
        A página que você procura não foi encontrada.
      </p>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        color: '#666'
      }}>
        <strong>URL:</strong> {window.location.pathname}
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#7C9A92',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🏠 Página Inicial
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            backgroundColor: '#D9A6A0',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          📊 Dashboard
        </button>
      </div>
    </div>
  </div>
);

// Wrapper para componentes com tratamento de erro
const SafeRoute = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error('Erro na rota:', error);
    return <ErrorFallback error={error} />;
  }
};

// Componente principal
function App() {
  console.log('🚀 Viajarte iniciando...', {
    url: window.location.href,
    pathname: window.location.pathname
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial */}
          <Route 
            path="/" 
            element={
              <SafeRoute>
                <Home />
              </SafeRoute>
            } 
          />
          
          {/* Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <SafeRoute>
                <Dashboard />
              </SafeRoute>
            } 
          />
          
          {/* Visualizar viagem */}
          <Route 
            path="/trip/:id" 
            element={
              <SafeRoute>
                <TripView />
              </SafeRoute>
            } 
          />
          
          {/* Criar nova viagem */}
          <Route 
            path="/trip/new" 
            element={
              <SafeRoute>
                <TripEditor />
              </SafeRoute>
            } 
          />
          
          {/* Editar viagem */}
          <Route 
            path="/trip/:id/edit" 
            element={
              <SafeRoute>
                <TripEditor />
              </SafeRoute>
            } 
          />
          
          {/* Configurações */}
          <Route 
            path="/settings" 
            element={
              <SafeRoute>
                <Settings />
              </SafeRoute>
            } 
          />

          {/* Redirecionamentos */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/viagens" element={<Navigate to="/dashboard" replace />} />
          <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />
          
          {/* Catch-all para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;