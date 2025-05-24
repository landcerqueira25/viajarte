// src/pages/Dashboard.jsx
// VERSÃO FINAL LIMPA - SEM ELEMENTOS DE TESTE DO FIREBASE

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Viagens de exemplo (fallback)
const defaultTrips = [
  {
    id: 'exemplo-1',
    name: "Europa dos Sonhos",
    startDate: "2025-06-10",
    endDate: "2025-06-25",
    cities: ["Paris", "Roma", "Barcelona"],
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 'exemplo-2', 
    name: "Aventura na Ásia",
    startDate: "2025-09-05",
    endDate: "2025-09-20",
    cities: ["Tóquio", "Seoul"],
    image: "https://images.unsplash.com/photo-1535139262971-c51845709a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar viagens do Firebase
  const loadTrips = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'viagens'));
      const loadedTrips = [];
      
      querySnapshot.forEach((doc) => {
        loadedTrips.push({ id: doc.id, ...doc.data() });
      });
      
      if (loadedTrips.length > 0) {
        setTrips(loadedTrips);
      } else {
        // Se não tem viagens no Firebase, usar exemplos
        setTrips(defaultTrips);
      }
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
      setTrips(defaultTrips);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar viagens ao inicializar
  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  // Navegar para criar nova viagem
  const handleNewTrip = () => {
    navigate('/trip/new');
  };

  // Navegar para visualizar viagem
  const handleTripClick = (tripId) => {
    if (tripId && !tripId.startsWith('exemplo-')) {
      navigate(`/trip/${tripId}`);
    } else {
      alert('Esta é uma viagem de exemplo. Crie uma viagem real para visualizar os detalhes!');
    }
  };

  // Calcular dias restantes para a viagem
  const calculateDaysUntilTrip = (startDate) => {
    const today = new Date();
    const tripStart = new Date(startDate);
    const diffTime = tripStart - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Concluída', color: '#666', bgColor: '#f0f0f0' };
    } else if (diffDays === 0) {
      return { text: 'Hoje!', color: '#dc3545', bgColor: '#ffe6e6' };
    } else if (diffDays === 1) {
      return { text: 'Amanhã!', color: '#fd7e14', bgColor: '#fff3e0' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays} dias`, color: '#fd7e14', bgColor: '#fff3e0' };
    } else if (diffDays <= 30) {
      return { text: `${diffDays} dias`, color: '#ffc107', bgColor: '#fffbf0' };
    } else {
      return { text: `${diffDays} dias`, color: '#28a745', bgColor: '#f0fff4' };
    }
  };

  // Filtrar viagens baseado na busca - CORRIGIDO
  const filteredTrips = trips.filter(trip => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = trip.name.toLowerCase().includes(searchLower);
    const cityMatch = trip.cities && trip.cities.length > 0 && 
      trip.cities.some(city => city.toLowerCase().includes(searchLower));
    const descriptionMatch = trip.description && 
      trip.description.toLowerCase().includes(searchLower);
    
    return nameMatch || cityMatch || descriptionMatch;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontFamily: 'Montserrat, sans-serif'
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

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f9fa' }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: '#7C9A92',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            fontFamily: 'Cormorant Garamond, serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🌟 Viajarte
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Botão Home */}
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            🏠 Home
          </button>

          {/* Botão Configurações */}
          <button
            onClick={() => navigate('/settings')}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            ⚙️ Configurações
          </button>

          {/* Avatar */}
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#2C3639',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
          onClick={() => navigate('/settings')}
          >
            LC
          </div>
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
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(124, 154, 146, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 154, 146, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 154, 146, 0.3)';
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Buscar viagens por nome, cidade ou descrição..."
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7C9A92'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✖️
              </button>
            )}
          </div>
        </div>

        {/* Trips Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            margin: '0',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#2C3639'
          }}>
            🌍 Suas Viagens ({filteredTrips.length})
          </h2>
          
          {searchTerm && (
            <span style={{
              fontSize: '1rem',
              color: '#666',
              backgroundColor: '#f0f0f0',
              padding: '8px 16px',
              borderRadius: '20px'
            }}>
              Filtrando por: "{searchTerm}"
            </span>
          )}
        </div>
        
        {filteredTrips.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {searchTerm ? '🔍' : '✈️'}
            </div>
            <h3 style={{
              fontSize: '2rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '1rem'
            }}>
              {searchTerm ? 'Nenhuma viagem encontrada' : 'Nenhuma viagem ainda'}
            </h3>
            <p style={{
              color: '#666',
              fontSize: '1.1rem',
              marginBottom: '2rem'
            }}>
              {searchTerm ? 
                `Não encontramos viagens que contenham "${searchTerm}". Tente outro termo de busca.` :
                'Que tal começar planejando sua primeira aventura?'
              }
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
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
                🔄 Limpar Busca
              </button>
            ) : (
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
            {filteredTrips.map((trip, index) => {
              const daysInfo = calculateDaysUntilTrip(trip.startDate);
              
              return (
                <div 
                  key={trip.id || index} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: trip.id && trip.id.startsWith('exemplo-') ? '2px solid #f0f0f0' : '2px solid #e8f4f3'
                  }}
                  onClick={() => handleTripClick(trip.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img src={trip.image} alt={trip.name} style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }} />
                    
                    {/* Badge de dias restantes */}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      backgroundColor: daysInfo.bgColor,
                      color: daysInfo.color,
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      border: `1px solid ${daysInfo.color}`,
                      backdropFilter: 'blur(10px)'
                    }}>
                      {daysInfo.text}
                    </div>
                    
                    {/* Badge Firebase/Exemplo */}
                    {trip.id && !trip.id.startsWith('exemplo-') && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        SALVA
                      </div>
                    )}
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
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            📍 {city}
                          </span>
                        ))}
                        {trip.cities.length > 3 && (
                          <span style={{
                            backgroundColor: '#f0f0f0',
                            color: '#666',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.8rem'
                          }}>
                            +{trip.cities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {trip.description && (
                      <p style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        margin: '0',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {trip.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Action Button - Nova Viagem */}
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
            zIndex: '100',
            transition: 'all 0.3s ease',
            width: '60px',
            height: '60px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 154, 146, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 154, 146, 0.4)';
          }}
          title="Criar Nova Viagem"
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