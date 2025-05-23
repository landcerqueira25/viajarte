// src/pages/TripEditor.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

const TripEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Estados do formulário
  const [tripData, setTripData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    cities: [],
    image: ''
  });
  
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(isEditing);

  // Carregar dados da viagem se estiver editando
  useEffect(() => {
    if (isEditing && id) {
      loadTripData();
    }
  }, [id, isEditing]);

  const loadTripData = async () => {
    try {
      const tripDoc = doc(db, 'viagens', id);
      const tripSnapshot = await getDoc(tripDoc);
      
      if (tripSnapshot.exists()) {
        const data = tripSnapshot.data();
        setTripData({
          name: data.name || '',
          description: data.description || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          cities: data.cities || [],
          image: data.image || ''
        });
      } else {
        alert('Viagem não encontrada');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao carregar viagem:', error);
      alert('Erro ao carregar viagem');
      navigate('/dashboard');
    } finally {
      setLoadingTrip(false);
    }
  };

  // Função para calcular duração
  const calculateDuration = () => {
    if (!tripData.startDate || !tripData.endDate) return 0;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Atualizar dados do formulário
  const handleInputChange = (field, value) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Adicionar cidade
  const handleAddCity = () => {
    if (newCity.trim() && !tripData.cities.includes(newCity.trim())) {
      setTripData(prev => ({
        ...prev,
        cities: [...prev.cities, newCity.trim()]
      }));
      setNewCity('');
    }
  };

  // Remover cidade
  const handleRemoveCity = (index) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.filter((_, i) => i !== index)
    }));
  };

  // Salvar viagem
  const handleSave = async () => {
    // Validações
    if (!tripData.name.trim()) {
      alert('Por favor, insira o nome da viagem');
      return;
    }
    
    if (!tripData.startDate || !tripData.endDate) {
      alert('Por favor, selecione as datas de início e fim');
      return;
    }
    
    if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
      alert('A data de início deve ser anterior à data de fim');
      return;
    }

    setLoading(true);

    try {
      const tripPayload = {
        name: tripData.name.trim(),
        description: tripData.description.trim(),
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        cities: tripData.cities,
        image: tripData.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        updatedAt: new Date(),
        ...(isEditing ? {} : { createdAt: new Date() })
      };

      if (isEditing) {
        // Atualizar viagem existente
        const tripDoc = doc(db, 'viagens', id);
        await updateDoc(tripDoc, tripPayload);
        alert('✅ Viagem atualizada com sucesso!');
        navigate(`/trip/${id}`);
      } else {
        // Criar nova viagem
        const docRef = await addDoc(collection(db, 'viagens'), tripPayload);
        alert('✅ Viagem criada com sucesso!');
        navigate(`/trip/${docRef.id}`);
      }
    } catch (error) {
      console.error('Erro ao salvar viagem:', error);
      alert('❌ Erro ao salvar viagem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingTrip) {
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#7C9A92',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              ← Voltar
            </button>
            
            <h1 style={{
              fontSize: '2.5rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              margin: '0'
            }}>
              {isEditing ? '✏️ Editar Viagem' : '🆕 Nova Viagem'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                backgroundColor: '#e0e0e0',
                color: '#666',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                backgroundColor: '#7C9A92',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Salvando...' : (isEditing ? '💾 Salvar Alterações' : '🚀 Criar Viagem')}
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 2rem 4rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem'
        }}>
          {/* Formulário Principal */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '2rem'
            }}>
              Informações Básicas
            </h2>
            
            {/* Nome da Viagem */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2C3639',
                marginBottom: '0.5rem'
              }}>
                Nome da Viagem *
              </label>
              <input
                type="text"
                value={tripData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Europa dos Sonhos"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#7C9A92'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* Datas */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Data de Início *
                </label>
                <input
                  type="date"
                  value={tripData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Data de Fim *
                </label>
                <input
                  type="date"
                  value={tripData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Descrição */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2C3639',
                marginBottom: '0.5rem'
              }}>
                Descrição
              </label>
              <textarea
                value={tripData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Conte um pouco sobre esta viagem..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
            </div>

            {/* URL da Imagem */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2C3639',
                marginBottom: '0.5rem'
              }}>
                URL da Imagem de Capa
              </label>
              <input
                type="url"
                value={tripData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Cidades */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1rem',
                fontWeight: '600',
                color: '#2C3639',
                marginBottom: '0.5rem'
              }}>
                Cidades do Roteiro
              </label>
              
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Ex: Paris"
                  style={{
                    flex: '1',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCity();
                    }
                  }}
                />
                <button
                  onClick={handleAddCity}
                  style={{
                    backgroundColor: '#7C9A92',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  + Adicionar
                </button>
              </div>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                {tripData.cities.map((city, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#e8f4f3',
                      color: '#7C9A92',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    📍 {city}
                    <button
                      onClick={() => handleRemoveCity(index)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#7C9A92',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '0',
                        marginLeft: '0.5rem'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              marginBottom: '1.5rem'
            }}>
              Preview da Viagem
            </h3>
            
            {/* Imagem Preview */}
            <div style={{
              height: '150px',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1rem',
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {tripData.image ? (
                <img
                  src={tripData.image}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div style={{
                display: tripData.image ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#666',
                fontSize: '2rem'
              }}>
                🖼️
              </div>
            </div>
            
            {/* Informações */}
            <h4 style={{
              fontSize: '1.2rem',
              fontFamily: 'Cormorant Garamond, serif',
              color: '#2C3639',
              margin: '0 0 0.5rem 0'
            }}>
              {tripData.name || 'Nome da Viagem'}
            </h4>
            
            {tripData.startDate && tripData.endDate && (
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                margin: '0 0 1rem 0'
              }}>
                📅 {new Date(tripData.startDate).toLocaleDateString('pt-BR')} - {new Date(tripData.endDate).toLocaleDateString('pt-BR')}
                <br />
                ⏱️ {calculateDuration()} dias
              </p>
            )}
            
            {tripData.cities.length > 0 && (
              <div>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#666',
                  margin: '0 0 0.5rem 0'
                }}>
                  🌍 {tripData.cities.length} {tripData.cities.length === 1 ? 'cidade' : 'cidades'}
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.25rem'
                }}>
                  {tripData.cities.slice(0, 3).map((city, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e8f4f3',
                        color: '#7C9A92',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8rem'
                      }}
                    >
                      {city}
                    </span>
                  ))}
                  {tripData.cities.length > 3 && (
                    <span style={{
                      backgroundColor: '#f0f0f0',
                      color: '#666',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      +{tripData.cities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {tripData.description && (
              <p style={{
                color: '#666',
                fontSize: '0.9rem',
                margin: '1rem 0 0 0',
                lineHeight: '1.4'
              }}>
                {tripData.description.length > 100 
                  ? tripData.description.substring(0, 100) + '...' 
                  : tripData.description}
              </p>
            )}
          </div>
        </div>
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

export default TripEditor;