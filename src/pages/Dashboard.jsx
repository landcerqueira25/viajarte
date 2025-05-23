// src/pages/Dashboard.jsx
// VERSÃO COM FIREBASE CONECTADO!

import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState('🔄 Testando conexão...');

  // Testar conexão com Firebase ao carregar
  useEffect(() => {
    testFirebaseConnection();
    loadTrips();
  }, []);

  // Função para testar Firebase
  const testFirebaseConnection = async () => {
    try {
      // Tentar adicionar um documento de teste
      await addDoc(collection(db, 'teste'), {
        mensagem: 'Firebase funcionando!',
        timestamp: new Date(),
        teste: true
      });
      setFirebaseStatus('✅ Firebase conectado com sucesso!');
    } catch (error) {
      console.error('Erro Firebase:', error);
      setFirebaseStatus('❌ Erro na conexão: ' + error.message);
    }
  };

  // Carregar viagens do Firebase
  const loadTrips = async () => {
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
    }
  };

  // Adicionar viagem de exemplo ao Firebase
  const addSampleTrip = async () => {
    setLoading(true);
    try {
      const newTrip = {
        name: 'Viagem Teste Firebase',
        startDate: '2025-08-01',
        endDate: '2025-08-15', 
        cities: ['São Paulo', 'Rio de Janeiro'],
        description: 'Viagem criada para testar o Firebase!',
        createdAt: new Date(),
        image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      };

      const docRef = await addDoc(collection(db, 'viagens'), newTrip);
      
      // Adicionar à lista local
      setTrips(prev => [...prev, { id: docRef.id, ...newTrip }]);
      
      alert('✅ Viagem salva no Firebase com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('❌ Erro ao salvar: ' + error.message);
    }
    setLoading(false);
  };

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

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
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
        <div style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          fontFamily: 'Cormorant Garamond, serif'
        }}>
          🌟 Viajarte
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#2C3639',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          LC
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
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={addSampleTrip}
              disabled={loading}
              style={{
                backgroundColor: '#D9A6A0',
                color: 'white',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                opacity: loading ? 0.6 : 1
              }}>
              {loading ? '⏳ Salvando...' : '🧪 Testar Firebase'}
            </button>
            
            <button style={{
              backgroundColor: '#7C9A92',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}>
              + Nova Viagem
            </button>
          </div>
        </div>

        {/* Firebase Status */}
        <div style={{
          backgroundColor: firebaseStatus.includes('✅') ? '#f0fff4' : 
                         firebaseStatus.includes('❌') ? '#fef2f2' : '#f0f9ff',
          border: `3px solid ${firebaseStatus.includes('✅') ? '#22c55e' : 
                              firebaseStatus.includes('❌') ? '#ef4444' : '#3b82f6'}`,
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '2rem' }}>🔥</div>
          <div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              color: firebaseStatus.includes('✅') ? '#15803d' : 
                     firebaseStatus.includes('❌') ? '#dc2626' : '#1d4ed8',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem'
            }}>
              Status do Firebase
            </h3>
            <p style={{
              margin: '0',
              fontSize: '1.1rem',
              color: firebaseStatus.includes('✅') ? '#166534' : 
                     firebaseStatus.includes('❌') ? '#b91c1c' : '#1e40af'
            }}>
              {firebaseStatus}
            </p>
          </div>
        </div>

        {/* Search */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar viagens..."
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontFamily: 'Montserrat, sans-serif'
            }}
          />
        </div>

        {/* Trips */}
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
          fontFamily: 'Cormorant Garamond, serif',
          color: '#2C3639'
        }}>
          🌍 Suas Viagens ({trips.length})
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {trips.map((trip, index) => (
            <div key={trip.id || index} style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: trip.id && trip.id.startsWith('exemplo-') ? 'none' : '3px solid #22c55e'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            }}>
              <img src={trip.image} alt={trip.name} style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover'
              }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    margin: '0',
                    fontFamily: 'Cormorant Garamond, serif',
                    color: '#2C3639'
                  }}>
                    {trip.name}
                  </h3>
                  {!trip.id?.startsWith('exemplo-') && (
                    <span style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      FIREBASE
                    </span>
                  )}
                </div>
                
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  color: '#666'
                }}>
                  📅 {new Date(trip.startDate).toLocaleDateString('pt-BR')} a {new Date(trip.endDate).toLocaleDateString('pt-BR')}
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {trip.cities.map((city, cityIndex) => (
                    <span key={cityIndex} style={{
                      backgroundColor: '#e8f4f3',
                      color: '#7C9A92',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      📍 {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;