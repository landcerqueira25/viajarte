// src/pages/Dashboard.jsx - VERSÃO CORRIGIDA E SIMPLIFICADA
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import Logo from '../components/Logo';

// Viagens de exemplo (fallback)
const defaultTrips = [
  {
    id: 'exemplo-1',
    name: "Europa dos Sonhos",
    startDate: "2025-06-10",
    endDate: "2025-06-25",
    cities: ["Paris", "Roma", "Barcelona"],
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Uma jornada incrível pela Europa"
  },
  {
    id: 'exemplo-2', 
    name: "Aventura na Ásia",
    startDate: "2025-09-05",
    endDate: "2025-09-20",
    cities: ["Tóquio", "Seoul"],
    image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "Descobrindo a Ásia moderna"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, trip: null });
  const [error, setError] = useState(null);

  // Função segura para extrair nome da cidade
  const getCityName = (city) => {
    try {
      if (!city) return '';
      if (typeof city === 'string') return city;
      if (typeof city === 'object' && city.name) return city.name;
      return String(city);
    } catch (e) {
      console.error('Erro ao extrair nome da cidade:', e);
      return 'Cidade';
    }
  };

  // Função segura para processar lista de cidades
  const processCities = (cities) => {
    try {
      if (!Array.isArray(cities)) return [];
      return cities.map(city => getCityName(city)).filter(name => name);
    } catch (e) {
      console.error('Erro ao processar cidades:', e);
      return [];
    }
  };

  // Função segura para sanitizar dados da viagem
  const sanitizeTrip = (trip) => {
    try {
      if (!trip || typeof trip !== 'object') return null;
      
      return {
        id: trip.id || `trip-${Date.now()}`,
        name: trip.name || 'Viagem sem nome',
        description: trip.description || '',
        startDate: trip.startDate || new Date().toISOString().split('T')[0],
        endDate: trip.endDate || new Date().toISOString().split('T')[0],
        cities: processCities(trip.cities || []),
        image: trip.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      };
    } catch (e) {
      console.error('Erro ao sanitizar viagem:', e);
      return null;
    }
  };

  // Carregar viagens
  const loadTrips = async () => {
    try {
      console.log('Carregando viagens...');
      
      // Tentar carregar do Firebase
      const querySnapshot = await getDocs(collection(db, 'viagens'));
      const loadedTrips = [];
      
      querySnapshot.forEach((docSnapshot) => {
        try {
          const tripData = { id: docSnapshot.id, ...docSnapshot.data() };
          const sanitizedTrip = sanitizeTrip(tripData);
          if (sanitizedTrip) {
            loadedTrips.push(sanitizedTrip);
          }
        } catch (e) {
          console.error('Erro ao processar viagem:', e);
        }
      });
      
      // Se tem viagens, usar elas, senão usar exemplos
      if (loadedTrips.length > 0) {
        console.log(`Carregadas ${loadedTrips.length} viagens do Firebase`);
        setTrips(loadedTrips);
      } else {
        console.log('Usando viagens de exemplo');
        setTrips(defaultTrips);
      }
      
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      setError('Erro ao carregar viagens. Usando dados de exemplo.');
      setTrips(defaultTrips);
    } finally {
      setLoading(false);
    }
  };

  // Carregar viagens ao inicializar
  useEffect(() => {
    loadTrips();
  }, []);

  // Navegar para criar nova viagem
  const handleNewTrip = () => {
    try {
      navigate('/trip/new');
    } catch (e) {
      console.error('Erro ao navegar:', e);
    }
  };

  // Navegar para visualizar viagem
  const handleTripClick = (tripId) => {
    try {
      if (tripId && !String(tripId).startsWith('exemplo-')) {
        navigate(`/trip/${tripId}`);
      } else {
        alert('Esta é uma viagem de exemplo. Crie uma viagem real para visualizar os detalhes!');
      }
    } catch (e) {
      console.error('Erro ao navegar para viagem:', e);
    }
  };

  // Confirmar exclusão da viagem
  const confirmDelete = async () => {
    if (!deleteModal.trip) return;
    
    try {
      // Se for uma viagem real (não exemplo), deletar do Firebase
      if (!String(deleteModal.trip.id).startsWith('exemplo-')) {
        await deleteDoc(doc(db, 'viagens', deleteModal.trip.id));
      }
      
      // Remover da lista local
      setTrips(prev => prev.filter(trip => trip.id !== deleteModal.trip.id));
      
      // Fechar modal
      setDeleteModal({ show: false, trip: null });
      
      alert('✅ Viagem excluída com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir viagem:', error);
      alert('❌ Erro ao excluir viagem: ' + error.message);
    }
  };

  // Filtrar viagens
  const filteredTrips = trips.filter(trip => {
    if (!searchTerm.trim()) return true;
    
    try {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = trip.name && trip.name.toLowerCase().includes(searchLower);
      const cityMatch = trip.cities && trip.cities.some(city => 
        String(city).toLowerCase().includes(searchLower)
      );
      const descriptionMatch = trip.description && trip.description.toLowerCase().includes(searchLower);
      
      return nameMatch || cityMatch || descriptionMatch;
    } catch (e) {
      console.error('Erro no filtro:', e);
      return false;
    }
  });

  // Loading
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #7C9A92',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Carregando suas viagens...</p>
        </div>
      </div>
    );
  }

  // Erro
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: 'Montserrat, sans-serif',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '2rem', borderRadius: '10px' }}>
          <h2 style={{ color: '#dc3545' }}>Oops! Algo deu errado</h2>
          <p style={{ color: '#666' }}>{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadTrips();
            }}
            style={{
              backgroundColor: '#7C9A92',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* Modal de Confirmação de Exclusão */}
      {deleteModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ fontSize: '1.5rem', color: '#dc3545', textAlign: 'center' }}>
              Excluir Viagem?
            </h3>
            <p style={{ textAlign: 'center', margin: '1rem 0' }}>
              Tem certeza que deseja excluir "{deleteModal.trip?.name}"?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteModal({ show: false, trip: null })}
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        backgroundColor: '#7C9A92',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Logo 
          size="medium" 
          color="white" 
          onClick={() => navigate('/')}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Configurações
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            margin: '0',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#2C3639'
          }}>
            Minhas Viagens ✈️
          </h1>
          
          <button 
            onClick={handleNewTrip}
            style={{
              backgroundColor: '#7C9A92',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ✨ Nova Viagem
          </button>
        </div>

        {/* Search */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar viagens..."
            style={{
              width: '100%',
              padding: '15px 20px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1.1rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Lista de Viagens */}
        {filteredTrips.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '20px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✈️</div>
            <h3 style={{
              fontSize: '2rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '1rem'
            }}>
              {searchTerm ? 'Nenhuma viagem encontrada' : 'Nenhuma viagem ainda'}
            </h3>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
              {searchTerm ? 
                'Tente outro termo de busca.' :
                'Que tal começar planejando sua primeira aventura?'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleNewTrip}
                style={{
                  backgroundColor: '#7C9A92',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                ✨ Criar Primeira Viagem
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {filteredTrips.map((trip, index) => (
              <div 
                key={trip.id || `trip-${index}`} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleTripClick(trip.id)}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={trip.image} 
                    alt={trip.name} 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }} 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                    }}
                  />
                  
                  {/* Botão de Excluir */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ show: true, trip });
                    }}
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: 'rgba(220, 53, 69, 0.9)',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    🗑️
                  </button>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    margin: '0 0 1rem 0',
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#2C3639'
                  }}>
                    {trip.name}
                  </h3>
                  
                  <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#666'
                  }}>
                    📅 {new Date(trip.startDate).toLocaleDateString('pt-BR')} - {new Date(trip.endDate).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {/* Cidades */}
                  {trip.cities && trip.cities.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      {trip.cities.slice(0, 3).map((city, cityIndex) => (
                        <span key={cityIndex} style={{
                          backgroundColor: '#e8f4f3',
                          color: '#7C9A92',
                          padding: '4px 10px',
                          borderRadius: '15px',
                          fontSize: '0.8rem'
                        }}>
                          📍 {String(city)}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {trip.description && (
                    <p style={{
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0',
                      lineHeight: '1.4'
                    }}>
                      {trip.description.length > 100 
                        ? trip.description.substring(0, 100) + '...' 
                        : trip.description
                      }
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={handleNewTrip}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#7C9A92',
            color: 'white',
            border: 'none',
            padding: '1rem',
            borderRadius: '50%',
            fontSize: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(124, 154, 146, 0.4)',
            zIndex: '100'
          }}
        >
          ✨
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;