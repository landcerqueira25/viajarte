// src/App.js - VERSÃO ATUALIZADA USANDO BASE LOCAL
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar todas as páginas com tratamento de erro
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TripView from './pages/TripView.jsx';
import TripEditor from './pages/EnhancedTripEditor'; // Usar o editor com base local
import Settings from './pages/Settings.jsx';

// Importar estilos
import './index.css';

// Componente de erro simples
const ErrorPage = ({ error, pageName }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
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
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '500px'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ 
        fontSize: '1.5rem', 
        color: '#dc3545', 
        marginBottom: '1rem',
        fontFamily: 'Cormorant Garamond, serif'
      }}>
        Erro ao Carregar {pageName || 'Página'}
      </h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Aconteceu um problema. Vamos tentar algumas soluções:
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#7C9A92',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
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
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🏠 Início
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🧹 Limpar Cache
        </button>
      </div>
      {error && (
        <details style={{ 
          marginTop: '1rem', 
          textAlign: 'left',
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Ver erro técnico
          </summary>
          <pre style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.8rem',
            color: '#dc3545',
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

// Página 404 personalizada
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
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
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center'
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
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
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
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          📊 Dashboard
        </button>
      </div>
    </div>
  </div>
);

// Wrapper para capturar erros de cada componente
const SafeComponent = ({ Component, fallbackName }) => {
  try {
    return <Component />;
  } catch (error) {
    console.error(`Erro no componente ${fallbackName}:`, error);
    return <ErrorPage error={error} pageName={fallbackName} />;
  }
};

function App() {
  console.log('🚀 Viajarte iniciando com Base Local...', {
    url: window.location.href,
    pathname: window.location.pathname,
    timestamp: new Date().toLocaleTimeString()
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Página inicial - Home */}
          <Route 
            path="/" 
            element={<SafeComponent Component={Home} fallbackName="Home" />} 
          />
          
          {/* Dashboard - lista de viagens */}
          <Route 
            path="/dashboard" 
            element={<SafeComponent Component={Dashboard} fallbackName="Dashboard" />} 
          />
          
          {/* Visualizar uma viagem específica */}
          <Route 
            path="/trip/:id" 
            element={<SafeComponent Component={TripView} fallbackName="Visualização da Viagem" />} 
          />
          
          {/* Criar nova viagem */}
          <Route 
            path="/trip/new" 
            element={<SafeComponent Component={TripEditor} fallbackName="Editor de Viagem" />} 
          />
          
          {/* Editar viagem existente */}
          <Route 
            path="/trip/:id/edit" 
            element={<SafeComponent Component={TripEditor} fallbackName="Editor de Viagem" />} 
          />
          
          {/* Configurações */}
          <Route 
            path="/settings" 
            element={<SafeComponent Component={Settings} fallbackName="Configurações" />} 
          />

          {/* Redirecionamentos para compatibilidade */}
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/viagens" element={<Navigate to="/dashboard" replace />} />
          <Route path="/configuracoes" element={<Navigate to="/settings" replace />} />
          
          {/* Catch-all: qualquer rota não encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;