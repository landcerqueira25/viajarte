// src/pages/Dashboard.jsx
// VERSÃO ULTRA SEGURA - ERRO DE OBJETOS CORRIGIDO

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
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
  const [deleteModal, setDeleteModal] = useState({ show: false, trip: null });
  const [deletingId, setDeletingId] = useState(null);

  // 🛡️ FUNÇÃO ULTRA SEGURA - Extrair nome da cidade
  const getCityName = (city) => {
    console.log('🔍 getCityName input:', typeof city, city);
    
    // Se é null, undefined ou falsy
    if (!city) {
      console.log('⚠️ getCityName: cidade vazia');
      return '';
    }
    
    // Se é uma string, retorna direto
    if (typeof city === 'string') {
      console.log('✅ getCityName: string encontrada:', city);
      return city.trim();
    }
    
    // Se é um objeto, tenta extrair o nome
    if (typeof city === 'object') {
      console.log('🔍 getCityName: objeto detectado:', Object.keys(city));
      
      // Prioridade: name, title, nome, city
      if (city.name && typeof city.name === 'string') {
        return city.name.trim();
      }
      if (city.title && typeof city.title === 'string') {
        return city.title.trim();
      }
      if (city.nome && typeof city.nome === 'string') {
        return city.nome.trim();
      }
      if (city.city && typeof city.city === 'string') {
        return city.city.trim();
      }
      
      console.log('⚠️ getCityName: objeto sem propriedade name válida');
      return 'Cidade';
    }
    
    // Se é número, converte para string
    if (typeof city === 'number') {
      return String(city);
    }
    
    // Fallback: converte para string
    console.log('⚠️ getCityName: convertendo para string:', typeof city);
    try {
      return String(city).trim();
    } catch (error) {
      console.error('❌ getCityName: erro na conversão:', error);
      return 'Cidade';
    }
  };

  // 🛡️ FUNÇÃO ULTRA SEGURA - Extrair lista de cidades
  const getCitiesList = (cities) => {
    console.log('🔍 getCitiesList input:', typeof cities, cities);
    
    // Se não é array ou está vazio
    if (!Array.isArray(cities) || cities.length === 0) {
      console.log('⚠️ getCitiesList: não é array ou está vazio');
      return [];
    }
    
    // Mapear cada cidade para nome seguro
    const safeNames = cities.map((city, index) => {
      try {
        const name = getCityName(city);
        console.log(`✅ getCitiesList[${index}]:`, name);
        return name || `Cidade ${index + 1}`;
      } catch (error) {
        console.error(`❌ getCitiesList[${index}]: erro`, error);
        return `Cidade ${index + 1}`;
      }
    }).filter(name => name && name.length > 0);
    
    console.log('✅ getCitiesList resultado:', safeNames);
    return safeNames;
  };

  // 🛡️ FUNÇÃO ULTRA SEGURA - Formatar dados da viagem
  const sanitizeTrip = (trip) => {
    console.log('🔍 sanitizeTrip input:', trip);
    
    if (!trip || typeof trip !== 'object') {
      console.log('⚠️ sanitizeTrip: entrada inválida');
      return null;
    }
    
    try {
      const sanitized = {
        id: trip.id || `trip-${Date.now()}`,
        name: (trip.name && typeof trip.name === 'string') ? trip.name.trim() : 'Viagem sem nome',
        description: (trip.description && typeof trip.description === 'string') ? trip.description.trim() : '',
        startDate: trip.startDate || new Date().toISOString().split('T')[0],
        endDate: trip.endDate || new Date().toISOString().split('T')[0],
        cities: getCitiesList(trip.cities),
        image: (trip.image && typeof trip.image === 'string') ? trip.image : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      };
      
      console.log('✅ sanitizeTrip resultado:', sanitized);
      return sanitized;
    } catch (error) {
      console.error('❌ sanitizeTrip: erro na sanitização:', error);
      return null;
    }
  };

  // Carregar viagens do Firebase
  const loadTrips = useCallback(async () => {
    try {
      console.log('🔄 Carregando viagens...');
      const querySnapshot = await getDocs(collection(db, 'viagens'));
      const loadedTrips = [];
      
      querySnapshot.forEach((docSnapshot) => {
        try {
          const tripData = { id: docSnapshot.id, ...docSnapshot.data() };
          const sanitizedTrip = sanitizeTrip(tripData);
          
          if (sanitizedTrip) {
            loadedTrips.push(sanitizedTrip);
            console.log('✅ Viagem carregada:', sanitizedTrip.name);
          } else {
            console.log('⚠️ Viagem ignorada (dados inválidos):', docSnapshot.id);
          }
        } catch (error) {
          console.error('❌ Erro ao processar viagem:', docSnapshot.id, error);
        }
      });
      
      if (loadedTrips.length > 0) {
        console.log(`✅ ${loadedTrips.length} viagens carregadas do Firebase`);
        setTrips(loadedTrips);
      } else {
        console.log('ℹ️ Nenhuma viagem no Firebase, usando exemplos');
        // Sanitizar também os exemplos
        const sanitizedDefaults = defaultTrips.map(sanitizeTrip).filter(Boolean);
        setTrips(sanitizedDefaults);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar viagens:', error);
      const sanitizedDefaults = defaultTrips.map(sanitizeTrip).filter(Boolean);
      setTrips(sanitizedDefaults);
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
    if (tripId && !String(tripId).startsWith('exemplo-')) {
      navigate(`/trip/${tripId}`);
    } else {
      alert('Esta é uma viagem de exemplo. Crie uma viagem real para visualizar os detalhes!');
    }
  };

  // Abrir modal de confirmação de exclusão
  const handleDeleteClick = (e, trip) => {
    e.stopPropagation(); // Evita que clique no card
    setDeleteModal({ show: true, trip });
  };

  // Confirmar exclusão da viagem
  const confirmDelete = async () => {
    if (!deleteModal.trip) return;
    
    setDeletingId(deleteModal.trip.id);
    
    try {
      // Se for uma viagem real (não exemplo), deletar do Firebase
      if (!String(deleteModal.trip.id).startsWith('exemplo-')) {
        await deleteDoc(doc(db, 'viagens', deleteModal.trip.id));
      }
      
      // Remover da lista local
      setTrips(prev => prev.filter(trip => trip.id !== deleteModal.trip.id));
      
      // Fechar modal
      setDeleteModal({ show: false, trip: null });
      
      // Mostrar sucesso
      const isExample = String(deleteModal.trip.id).startsWith('exemplo-');
      alert(isExample ? '✅ Viagem de exemplo removida!' : '✅ Viagem excluída com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir viagem:', error);
      alert('❌ Erro ao excluir viagem: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Cancelar exclusão
  const cancelDelete = () => {
    setDeleteModal({ show: false, trip: null });
  };

  // Calcular dias restantes para a viagem
  const calculateDaysUntilTrip = (startDate) => {
    try {
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
    } catch (error) {
      console.error('Erro ao calcular dias:', error);
      return { text: 'Data inválida', color: '#666', bgColor: '#f0f0f0' };
    }
  };

  // 🛡️ FILTRAR VIAGENS - ULTRA SEGURO
  const filteredTrips = trips.filter(trip => {
    if (!searchTerm.trim()) return true;
    
    try {
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Busca no nome da viagem
      const nameMatch = trip.name && 
        String(trip.name).toLowerCase().includes(searchLower);
      
      // Busca nas cidades (já sanitizadas como strings)
      const cityMatch = Array.isArray(trip.cities) && trip.cities.length > 0 && 
        trip.cities.some(cityName => {
          return cityName && 
            String(cityName).toLowerCase().includes(searchLower);
        });
      
      // Busca na descrição
      const descriptionMatch = trip.description && 
        String(trip.description).toLowerCase().includes(searchLower);
      
      return nameMatch || cityMatch || descriptionMatch;
    } catch (error) {
      console.error('Erro no filtro:', error);
      return false;
    }
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
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transform: deleteModal.show ? 'scale(1)' : 'scale(0.9)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🗑️
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#dc3545',
                margin: '0 0 1rem 0'
              }}>
                Excluir Viagem?
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#666',
                margin: '0 0 0.5rem 0'
              }}>
                Tem certeza que deseja excluir:
              </p>
              <p style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2C3639',
                margin: '0'
              }}>
                "{deleteModal.trip?.name || 'Esta viagem'}"?
              </p>
            </div>

            <div style={{
              backgroundColor: '#fff8f8',
              border: '2px solid #ffe6e6',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '2rem'
            }}>
              <p style={{
                color: '#dc3545',
                fontSize: '0.9rem',
                margin: '0',
                textAlign: 'center'
              }}>
                ⚠️ {String(deleteModal.trip?.id || '').startsWith('exemplo-') 
                  ? 'Esta viagem de exemplo será removida da lista.'
                  : 'Esta ação não pode ser desfeita. Todos os dados da viagem serão perdidos permanentemente.'
                }
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelDelete}
                disabled={deletingId === deleteModal.trip?.id}
                style={{
                  backgroundColor: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: deletingId === deleteModal.trip?.id ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: deletingId === deleteModal.trip?.id ? 0.6 : 1
                }}
              >
                Cancelar
              </button>
              
              <button
                onClick={confirmDelete}
                disabled={deletingId === deleteModal.trip?.id}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  cursor: deletingId === deleteModal.trip?.id ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: deletingId === deleteModal.trip?.id ? 0.6 : 1
                }}
              >
                {deletingId === deleteModal.trip?.id ? '⏳ Excluindo...' : '🗑️ Excluir Viagem'}
              </button>
            </div>
          </div>
        </div>
      )}

     // Apenas a parte da Navbar do Dashboard com visual limpo
// Cole isso no seu Dashboard.jsx, substituindo a seção <nav>

      {/* Navbar Limpa */}
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
            letterSpacing: '1px'
          }}
        >
          Viajarte
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            Configurações
          </button>

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
            border: '2px solid rgba(255,255,255,0.3)',
            fontSize: '0.9rem'
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
              const isExample = String(trip.id).startsWith('exemplo-');
              
              return (
                <div 
                  key={trip.id || `trip-${index}`} 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: isExample ? '2px solid #f0f0f0' : '2px solid #e8f4f3',
                    position: 'relative'
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
                    {!isExample && (
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

                    {/* Botão de Excluir */}
                    <button
                      onClick={(e) => handleDeleteClick(e, trip)}
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        backgroundColor: 'rgba(220, 53, 69, 0.9)',
                        color: 'white',
                        border: 'none',
                        padding: '8px',
                        borderRadius: '50%',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc3545';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      title="Excluir viagem"
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
                      {String(trip.name)}
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
                    
                    {/* 🛡️ RENDERIZAÇÃO ULTRA SEGURA DAS CIDADES */}
                    {Array.isArray(trip.cities) && trip.cities.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        {trip.cities.slice(0, 3).map((cityName, cityIndex) => (
                          <span key={`city-${cityIndex}`} style={{
                            backgroundColor: '#e8f4f3',
                            color: '#7C9A92',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}>
                            📍 {String(cityName)}
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
                        {String(trip.description)}
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