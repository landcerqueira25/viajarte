// src/pages/TripView.jsx - VERSÃO ATUALIZADA COM BASE LOCAL
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const TripView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Carregar dados da viagem
  useEffect(() => {
    const loadTrip = async () => {
      try {
        const tripDoc = doc(db, 'viagens', id);
        const tripSnapshot = await getDoc(tripDoc);
        
        if (tripSnapshot.exists()) {
          const tripData = { id: tripSnapshot.id, ...tripSnapshot.data() };
          setTrip(tripData);
        } else {
          console.error('Viagem não encontrada');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao carregar viagem:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTrip();
    }
  }, [id, navigate]);

  // Função para extrair nome da cidade (compatível com base local)
  const getCityName = (city) => {
    if (typeof city === 'string') {
      return city;
    }
    return city?.name || city?.title || 'Cidade';
  };

  // Função para extrair país da cidade
  const getCityCountry = (city) => {
    if (typeof city === 'string') {
      return ''; // Não temos país para strings simples
    }
    return city?.country || '';
  };

  // Função para extrair imagem da cidade
  const getCityImage = (city) => {
    if (typeof city === 'object' && city?.imageUrl) {
      return city.imageUrl;
    }
    // Imagem padrão para cidades
    return 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  };

  // Função para calcular duração da viagem
  const calculateDuration = () => {
    if (!trip) return 0;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

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
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Carregando viagem...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#2C3639', marginBottom: '1rem' }}>
          Viagem não encontrada
        </h2>
        <button
          onClick={() => navigate('/dashboard')}
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
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Header da Viagem */}
      <div style={{
        position: 'relative',
        height: '400px',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${trip.image || getCityImage(trip.cities?.[0]) || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        color: 'white'
      }}>
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          ←
        </button>

        {/* Botões de Ação */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate(`/trip/${id}/edit`)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            ✏️ Editar
          </button>
          <button
            onClick={() => alert('Função de compartilhar será implementada em breve!')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)'
            }}
          >
            📤 Compartilhar
          </button>
        </div>

        {/* Informações da Viagem */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontFamily: 'Cormorant Garamond, serif',
            margin: '0 0 1rem 0',
            fontWeight: 'bold'
          }}>
            {trip.name}
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: '1.1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ⏱️ {calculateDuration()} dias
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🌍 {trip.cities?.length || 0} cidades
            </div>
            {trip.travelers && trip.travelers.filter(t => t.name && t.name.trim()).length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👥 {trip.travelers.filter(t => t.name && t.name.trim()).length} viajantes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: '0',
        zIndex: '10'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '0'
        }}>
          {[
            { id: 'overview', label: '📋 Visão Geral' },
            { id: 'cities', label: '🏙️ Cidades' },
            { id: 'travelers', label: '👥 Viajantes' },
            { id: 'timeline', label: '📅 Cronograma' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#7C9A92' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #7C9A92' : '3px solid transparent',
                fontSize: '1rem',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Tab: Visão Geral */}
        {activeTab === 'overview' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Descrição */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1rem'
                }}>
                  📖 Sobre esta viagem
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  color: '#666',
                  margin: '0'
                }}>
                  {trip.description || 'Uma viagem incrível aguarda você! Explore novos destinos, descubra culturas fascinantes e crie memórias inesquecíveis nesta aventura única.'}
                </p>
              </div>

              {/* Estatísticas */}
              <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1.5rem'
                }}>
                  📊 Resumo
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Duração:</span>
                    <strong>{calculateDuration()} dias</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Cidades:</span>
                    <strong>{trip.cities?.length || 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Viajantes:</span>
                    <strong>
                      {trip.travelers?.filter(t => t.name && t.name.trim()).length || 1}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#666' }}>Criado em:</span>
                    <strong>
                      {trip.createdAt ? 
                        (trip.createdAt.seconds ? 
                          new Date(trip.createdAt.seconds * 1000).toLocaleDateString('pt-BR') :
                          new Date(trip.createdAt).toLocaleDateString('pt-BR')
                        ) : 'N/A'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview das Cidades */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '1.5rem'
              }}>
                🗺️ Destinos da Viagem
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {trip.cities?.map((city, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: 'center',
                      padding: '1rem',
                      borderRadius: '10px',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setActiveTab('cities')}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8f4f3';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img
                      src={getCityImage(city)}
                      alt={getCityName(city)}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginBottom: '0.5rem'
                      }}
                    />
                    <h4 style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: '#2C3639',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {getCityName(city)}
                    </h4>
                    {getCityCountry(city) && (
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        margin: '0'
                      }}>
                        {getCityCountry(city)}
                      </p>
                    )}
                  </div>
                ))}
                
                {/* Caso não tenha cidades */}
                {(!trip.cities || trip.cities.length === 0) && (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#666',
                    gridColumn: '1 / -1'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <p>Nenhuma cidade adicionada ainda.</p>
                    <button
                      onClick={() => navigate(`/trip/${id}/edit`)}
                      style={{
                        backgroundColor: '#7C9A92',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                      }}
                    >
                      Adicionar Cidades
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Cidades */}
        {activeTab === 'cities' && (
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              🏙️ Explore as Cidades
            </h2>
            
            {trip.cities && trip.cities.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {trip.cities.map((city, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                    }}
                  >
                    <div style={{
                      height: '200px',
                      backgroundImage: `url(${getCityImage(city)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        backgroundColor: 'rgba(124, 154, 146, 0.9)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        Destino {index + 1}
                      </div>
                    </div>
                    
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontFamily: 'Cormorant Garamond, serif',
                        color: '#2C3639',
                        margin: '0 0 0.5rem 0'
                      }}>
                        {getCityName(city)}
                        {getCityCountry(city) && (
                          <span style={{ fontSize: '1.1rem', color: '#666', fontWeight: 'normal' }}>
                            , {getCityCountry(city)}
                          </span>
                        )}
                      </h3>

                      {/* Datas da estadia */}
                      {city.startDate && city.endDate && (
                        <div style={{
                          backgroundColor: '#e8f4f3',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ fontSize: '0.9rem', color: '#7C9A92', fontWeight: '600' }}>
                            📅 Período de Estadia
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                            {new Date(city.startDate).toLocaleDateString('pt-BR')} - {new Date(city.endDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      )}

                      {/* Informação climática */}
                      {city.weatherInfo && (
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '0.8rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.9rem',
                          color: '#666'
                        }}>
                          {city.weatherInfo}
                        </div>
                      )}

                      {/* Highlights */}
                      {city.highlights && city.highlights.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <h5 style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#2C3639',
                            marginBottom: '0.5rem'
                          }}>
                            ⭐ Principais Atrações
                          </h5>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            {city.highlights.slice(0, 4).map((highlight, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#e8f4f3',
                                  color: '#7C9A92',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem',
                                  fontWeight: '500'
                                }}
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {city.tags && city.tags.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            {city.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#f0f0f0',
                                  color: '#666',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.7rem'
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notas pessoais */}
                      {city.userNotes && (
                        <div style={{
                          borderTop: '1px solid #e0e0e0',
                          paddingTop: '1rem'
                        }}>
                          <h5 style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#2C3639',
                            marginBottom: '0.5rem'
                          }}>
                            📝 Notas Pessoais
                          </h5>
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            margin: '0',
                            fontStyle: 'italic'
                          }}>
                            {city.userNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏙️</div>
                <h3 style={{
                  fontSize: '2rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1rem'
                }}>
                  Nenhuma cidade adicionada
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Adicione cidades ao seu roteiro para começar a planejar sua viagem!
                </p>
                <button
                  onClick={() => navigate(`/trip/${id}/edit`)}
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
                  ✏️ Editar Viagem
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Viajantes */}
        {activeTab === 'travelers' && (
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              👥 Grupo de Viajantes
            </h2>
            
            {trip.travelers && trip.travelers.filter(t => t.name && t.name.trim()).length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {trip.travelers.filter(t => t.name && t.name.trim()).map((traveler, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      border: traveler.role === 'organizador' ? '2px solid #7C9A92' : '2px solid #e0e0e0',
                      borderRadius: '15px',
                      padding: '2rem',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: traveler.role === 'organizador' ? '#7C9A92' : '#e0e0e0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      fontSize: '2rem'
                    }}>
                      {traveler.role === 'organizador' ? '👑' : '👤'}
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontFamily: 'Cormorant Garamond, serif',
                      color: '#2C3639',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {traveler.name}
                    </h3>
                    
                    {traveler.email && (
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        margin: '0 0 1rem 0'
                      }}>
                        📧 {traveler.email}
                      </p>
                    )}
                    
                    <span style={{
                      fontSize: '0.8rem',
                      backgroundColor: traveler.role === 'organizador' ? '#7C9A92' : '#e0e0e0',
                      color: traveler.role === 'organizador' ? 'white' : '#666',
                      padding: '6px 12px',
                      borderRadius: '15px',
                      fontWeight: 'bold'
                    }}>
                      {traveler.role === 'organizador' ? 'Organizador da Viagem' : 'Participante'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
                <h3 style={{
                  fontSize: '2rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1rem'
                }}>
                  Viagem Solo
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Esta é uma viagem individual. Você pode adicionar companheiros editando a viagem.
                </p>
                <button
                  onClick={() => navigate(`/trip/${id}/edit`)}
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
                  ✏️ Adicionar Viajantes
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab: Cronograma */}
        {activeTab === 'timeline' && (
          <div>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              📅 Cronograma da Viagem
            </h2>
            
            {trip.cities && trip.cities.length > 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '2rem'
              }}>
                <div style={{ position: 'relative' }}>
                  {trip.cities.map((city, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: index === trip.cities.length - 1 ? '0' : '2rem',
                        position: 'relative'
                      }}
                    >
                      {/* Linha do tempo */}
                      <div style={{
                        width: '4px',
                        height: index === trip.cities.length - 1 ? '40px' : '100%',
                        backgroundColor: '#7C9A92',
                        position: 'absolute',
                        left: '18px',
                        top: '40px'
                      }}></div>
                      
                      {/* Ponto da timeline */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#7C9A92',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        marginRight: '1.5rem',
                        flexShrink: 0,
                        zIndex: 1,
                        position: 'relative'
                      }}>
                        {index + 1}
                      </div>
                      
                      {/* Conteúdo */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '1.5rem',
                          borderRadius: '10px',
                          borderLeft: '4px solid #7C9A92'
                        }}>
                          <h4 style={{
                            fontSize: '1.3rem',
                            fontFamily: 'Cormorant Garamond, serif',
                            color: '#2C3639',
                            margin: '0 0 0.5rem 0'
                          }}>
                            {getCityName(city)}
                            {getCityCountry(city) && (
                              <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>
                                , {getCityCountry(city)}
                              </span>
                            )}
                          </h4>
                          
                          {city.startDate && city.endDate && (
                            <p style={{
                              fontSize: '0.9rem',
                              color: '#7C9A92',
                              fontWeight: '600',
                              margin: '0 0 1rem 0'
                            }}>
                              📅 {new Date(city.startDate).toLocaleDateString('pt-BR')} - {new Date(city.endDate).toLocaleDateString('pt-BR')}
                              <span style={{ color: '#666', fontWeight: 'normal', marginLeft: '1rem' }}>
                                ({Math.ceil((new Date(city.endDate) - new Date(city.startDate)) / (1000 * 60 * 60 * 24)) + 1} dias)
                              </span>
                            </p>
                          )}
                          
                          {city.weatherInfo && (
                            <p style={{
                              fontSize: '0.9rem',
                              color: '#666',
                              margin: '0 0 1rem 0'
                            }}>
                              {city.weatherInfo}
                            </p>
                          )}
                          
                          {city.highlights && city.highlights.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                              <strong style={{ fontSize: '0.9rem', color: '#2C3639' }}>Principais Atrações:</strong>
                              <div style={{ marginTop: '0.5rem' }}>
                                {city.highlights.slice(0, 4).map((highlight, idx) => (
                                  <span
                                    key={idx}
                                    style={{
                                      display: 'inline-block',
                                      backgroundColor: '#e8f4f3',
                                      color: '#7C9A92',
                                      padding: '4px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.8rem',
                                      marginRight: '0.5rem',
                                      marginBottom: '0.5rem'
                                    }}
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {city.userNotes && (
                            <div style={{
                              backgroundColor: '#fff',
                              padding: '1rem',
                              borderRadius: '8px',
                              border: '1px solid #e0e0e0'
                            }}>
                              <strong style={{ fontSize: '0.9rem', color: '#2C3639' }}>Notas:</strong>
                              <p style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                margin: '0.5rem 0 0 0',
                                fontStyle: 'italic'
                              }}>
                                {city.userNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{
                  fontSize: '2rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1rem'
                }}>
                  Nenhum cronograma disponível
                </h3>
                <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                  Adicione cidades à sua viagem para visualizar o cronograma detalhado.
                </p>
                <button
                  onClick={() => navigate(`/trip/${id}/edit`)}
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
                  ✏️ Editar Viagem
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botão Flutuante para Editar */}
      <button
        onClick={() => navigate(`/trip/${id}/edit`)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#D9A6A0',
          color: 'white',
          border: 'none',
          padding: '1rem',
          borderRadius: '50%',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(217, 166, 160, 0.4)',
          zIndex: '100',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(217, 166, 160, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(217, 166, 160, 0.4)';
        }}
        title="Editar Viagem"
      >
        ✏️
      </button>

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

export default TripView;