// src/pages/EnhancedTripEditor.jsx - VERSÃO CORRIGIDA SEM TEMAS
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

// Importar base de dados local
import { citiesDatabase, cityHelpers } from '../data/citiesDatabase';

const EnhancedTripEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Estados principais
  const [tripData, setTripData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    cities: [],
    travelers: [{ id: 'main', name: '', email: '', role: 'organizador' }],
    image: ''
  });
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(isEditing);
  const [activeTab, setActiveTab] = useState('basic');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  
  // Estados para adicionar cidades
  const [citySearch, setCitySearch] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  // Estados para adicionar viajantes
  const [newTraveler, setNewTraveler] = useState({ name: '', email: '' });

  // Carregar dados da viagem se estiver editando
  const loadTripData = useCallback(async () => {
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
          travelers: data.travelers || [{ id: 'main', name: '', email: '', role: 'organizador' }],
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
  }, [id, navigate]);

  useEffect(() => {
    if (isEditing && id) {
      loadTripData();
    }
  }, [isEditing, id, loadTripData]);

  // Filtrar cidades quando busca muda
  useEffect(() => {
    if (citySearch.length >= 2) {
      const filtered = cityHelpers.searchCities(citySearch);
      setFilteredCities(filtered);
      setShowCityDropdown(true);
    } else {
      setFilteredCities([]);
      setShowCityDropdown(false);
    }
  }, [citySearch]);

  // Função para adicionar cidade da base de dados - CORRIGIDA
  const handleAddCity = (cityData) => {
    console.log('Adicionando cidade:', cityData);
    
    // Verificar se a cidade já foi adicionada
    const cityExists = tripData.cities.some(city => city.id === cityData.id);
    
    if (cityExists) {
      alert(`${cityData.name} já foi adicionada ao roteiro!`);
      return;
    }

    // Calcular datas automáticas
    const totalDays = tripData.startDate && tripData.endDate 
      ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1
      : 3;
    
    const daysPerCity = Math.max(1, Math.floor(totalDays / (tripData.cities.length + 1)));
    
    let startDate = tripData.startDate;
    if (tripData.cities.length > 0) {
      const lastCity = tripData.cities[tripData.cities.length - 1];
      const lastEndDate = new Date(lastCity.endDate || tripData.startDate);
      startDate = new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    
    const endDate = new Date(new Date(startDate).getTime() + (daysPerCity - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Gerar informação climática
    const startMonth = new Date(startDate).getMonth() + 1;
    const weatherInfo = cityHelpers.getWeatherInfo(cityData.id, startMonth);

    // Criar objeto cidade para a viagem
    const tripCity = {
      ...cityData,
      startDate: startDate,
      endDate: endDate,
      weatherInfo: weatherInfo,
      userNotes: '',
      activities: []
    };

    setTripData(prev => ({
      ...prev,
      cities: [...prev.cities, tripCity]
    }));
    
    // Limpar busca e fechar dropdown
    setCitySearch('');
    setShowCityDropdown(false);
    
    alert(`✅ ${cityData.name} adicionada ao roteiro!`);
  };

  // Função para remover cidade
  const handleRemoveCity = (cityId) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.filter(city => city.id !== cityId)
    }));
  };

  // Função para atualizar período da cidade
  const handleUpdateCityDates = (cityId, field, value) => {
    setTripData(prev => ({
      ...prev,
      cities: prev.cities.map(city => 
        city.id === cityId ? { ...city, [field]: value } : city
      )
    }));
  };

  // Função para adicionar viajante
  const handleAddTraveler = () => {
    if (!newTraveler.name.trim()) return;
    
    const traveler = {
      id: `traveler-${Date.now()}`,
      name: newTraveler.name.trim(),
      email: newTraveler.email.trim(),
      role: 'viajante'
    };
    
    setTripData(prev => ({
      ...prev,
      travelers: [...prev.travelers, traveler]
    }));
    
    setNewTraveler({ name: '', email: '' });
  };

  // Função para remover viajante
  const handleRemoveTraveler = (travelerId) => {
    setTripData(prev => ({
      ...prev,
      travelers: prev.travelers.filter(t => t.id !== travelerId)
    }));
  };

  // Função para gerar descrição automática
  const handleGenerateDescription = () => {
    if (tripData.cities.length === 0) {
      alert('Adicione pelo menos uma cidade para gerar a descrição');
      return;
    }

    setIsGeneratingDescription(true);

    setTimeout(() => {
      const duration = tripData.startDate && tripData.endDate 
        ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 1000)) + 1
        : tripData.cities.length * 3;

      const cityNames = tripData.cities.map(city => city.name).join(", ");
      const countries = [...new Set(tripData.cities.map(city => city.country))];
      const countryText = countries.length === 1 ? countries[0] : `${countries.length} países`;

      const description = `Embarque numa jornada inesquecível de ${duration} dias explorando ${cityNames}. Esta viagem por ${countryText} combina história, cultura e paisagens deslumbrantes. Cada destino oferece experiências únicas: desde ${(tripData.cities[0]?.highlights && tripData.cities[0].highlights.length > 0) ? tripData.cities[0].highlights[0] : 'atrações históricas'} até ${(tripData.cities[tripData.cities.length - 1]?.highlights && tripData.cities[tripData.cities.length - 1].highlights.length > 0) ? tripData.cities[tripData.cities.length - 1].highlights[0] : 'pontos turísticos icônicos'}. Uma aventura que criará memórias para toda a vida!`;

      setTripData(prev => ({
        ...prev,
        description: description
      }));

      setIsGeneratingDescription(false);
      alert('✅ Descrição gerada automaticamente!');
    }, 1500);
  };

  // Função para salvar viagem - MELHORADA
  const handleSave = async () => {
    // Validações
    if (!tripData.name.trim()) {
      alert('Por favor, insira o nome da viagem');
      return;
    }
    
    if (!tripData.startDate || !tripData.endDate) {
      alert('Por favor, selecione as datas de início e fim da viagem');
      return;
    }
    
    if (new Date(tripData.startDate) > new Date(tripData.endDate)) {
      alert('A data de início deve ser anterior à data de fim');
      return;
    }

    if (tripData.cities.length === 0) {
      alert('Adicione pelo menos uma cidade ao roteiro');
      return;
    }

    // Verificar se as cidades têm datas definidas
    const citiesWithoutDates = tripData.cities.filter(city => !city.startDate || !city.endDate);
    if (citiesWithoutDates.length > 0) {
      const proceed = window.confirm(
        `${citiesWithoutDates.length} cidade(s) não têm datas definidas. ` +
        'As datas serão calculadas automaticamente baseado no período da viagem. Continuar?'
      );
      
      if (!proceed) return;
      
      // Recalcular datas para todas as cidades
      const updatedCities = tripData.cities.map((city, index) => {
        if (!city.startDate || !city.endDate) {
          const totalDays = Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1;
          const daysPerCity = Math.max(1, Math.floor(totalDays / tripData.cities.length));
          
          const cityStartDate = new Date(new Date(tripData.startDate).getTime() + (index * daysPerCity * 24 * 60 * 60 * 1000));
          const cityEndDate = new Date(cityStartDate.getTime() + ((daysPerCity - 1) * 24 * 60 * 60 * 1000));
          
          return {
            ...city,
            startDate: cityStartDate.toISOString().split('T')[0],
            endDate: cityEndDate.toISOString().split('T')[0],
            weatherInfo: cityHelpers.getWeatherInfo(city.id, cityStartDate.getMonth() + 1)
          };
        }
        return city;
      });
      
      // Atualizar o estado com as novas datas
      setTripData(prev => ({ ...prev, cities: updatedCities }));
    }

    setLoading(true);

    try {
      const tripPayload = {
        name: tripData.name.trim(),
        description: tripData.description.trim(),
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        cities: tripData.cities,
        travelers: tripData.travelers.filter(t => t.name.trim()),
        image: tripData.image || tripData.cities[0]?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        updatedAt: new Date(),
        ...(isEditing ? {} : { createdAt: new Date() })
      };

      if (isEditing) {
        const tripDoc = doc(db, 'viagens', id);
        await updateDoc(tripDoc, tripPayload);
        alert('✅ Viagem atualizada com sucesso!');
        navigate(`/trip/${id}`);
      } else {
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
          maxWidth: '1200px',
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

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 4rem'
      }}>
        {/* Navegação por Tabs */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e0e0e0'
          }}>
            {[
              { id: 'basic', label: '📋 Informações Básicas' },
              { id: 'cities', label: '🏙️ Cidades' },
              { id: 'travelers', label: '👥 Viajantes' },
              { id: 'preview', label: '👁️ Preview' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem 2rem',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#7C9A92' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#666',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conteúdo das Tabs */}
          <div style={{ padding: '2rem' }}>
            
            {/* Tab: Informações Básicas */}
            {activeTab === 'basic' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '2rem'
                }}>
                  📋 Informações Básicas
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '2rem'
                }}>
                  <div>
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
                        onChange={(e) => setTripData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Aventura pela Europa"
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
                          onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
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
                          onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
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
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <label style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#2C3639'
                        }}>
                          Descrição da Viagem
                        </label>
                        
                        <button
                          onClick={handleGenerateDescription}
                          disabled={isGeneratingDescription || tripData.cities.length === 0}
                          style={{
                            backgroundColor: '#D9A6A0',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            cursor: isGeneratingDescription || tripData.cities.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: isGeneratingDescription || tripData.cities.length === 0 ? 0.6 : 1
                          }}
                        >
                          {isGeneratingDescription ? '⏳ Gerando...' : '✨ Gerar Descrição'}
                        </button>
                      </div>
                      
                      <textarea
                        value={tripData.description}
                        onChange={(e) => setTripData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descreva sua viagem ou clique em 'Gerar Descrição' após adicionar cidades..."
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
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#2C3639',
                        marginBottom: '0.5rem'
                      }}>
                        URL da Imagem de Capa (opcional)
                      </label>
                      <input
                        type="url"
                        value={tripData.image}
                        onChange={(e) => setTripData(prev => ({ ...prev, image: e.target.value }))}
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
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        margin: '0.5rem 0 0 0'
                      }}>
                        💡 Se não informar, usaremos a imagem da primeira cidade
                      </p>
                    </div>
                  </div>

                  {/* Preview lateral */}
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    height: 'fit-content'
                  }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      color: '#2C3639',
                      marginBottom: '1rem'
                    }}>
                      📊 Resumo
                    </h4>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '0.8rem',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Nome:</span>
                        <strong>{tripData.name || 'Não definido'}</strong>
                      </div>
                      
                      {tripData.startDate && tripData.endDate && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#666' }}>Duração:</span>
                          <strong>
                            {Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1} dias
                          </strong>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Cidades:</span>
                        <strong>{tripData.cities.length}</strong>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#666' }}>Viajantes:</span>
                        <strong>{tripData.travelers.filter(t => t.name.trim()).length}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Cidades */}
            {activeTab === 'cities' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '1rem'
                }}>
                  🏙️ Cidades do Roteiro
                </h2>

                {/* Dica sobre datas */}
                {(!tripData.startDate || !tripData.endDate) && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    <div>
                      <strong>Dica:</strong> Configure as datas de início e fim da viagem na aba "Informações Básicas" para que as datas das cidades sejam calculadas automaticamente!
                    </div>
                  </div>
                )}

                {/* Buscar e Adicionar Cidades */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginBottom: '2rem',
                  position: 'relative'
                }}>
                  <h4 style={{
                    fontSize: '1.2rem',
                    color: '#2C3639',
                    marginBottom: '1rem'
                  }}>
                    🔍 Buscar e Adicionar Cidades
                  </h4>
                  
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      onFocus={() => {
                        if (filteredCities.length > 0) {
                          setShowCityDropdown(true);
                        }
                      }}
                      placeholder="Digite o nome da cidade (ex: Paris, Roma, Tóquio...)"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    
                    {/* Dropdown de Cidades - CORRIGIDO */}
                    {showCityDropdown && filteredCities.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        border: '2px solid #e0e0e0',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}>
                        {filteredCities.map((city) => (
                          <div
                            key={city.id}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Clicou na cidade:', city);
                              handleAddCity(city);
                            }}
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #f0f0f0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'background-color 0.2s ease',
                              backgroundColor: 'white'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                            }}
                          >
                            <img
                              src={city.imageUrl}
                              alt={city.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', color: '#2C3639' }}>
                                {city.name}, {city.country}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                {city.description.substring(0, 50)}...
                              </div>
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: '#7C9A92',
                              fontWeight: 'bold'
                            }}>
                              Clique para adicionar
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Fechar dropdown quando clicar fora */}
                    {showCityDropdown && (
                      <div
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 999
                        }}
                        onClick={() => setShowCityDropdown(false)}
                      />
                    )}
                  </div>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    margin: '0.5rem 0 0 0'
                  }}>
                    💡 Temos {cityHelpers.getAllCities().length} cidades disponíveis na base de dados
                  </p>
                </div>

                {/* Lista de Cidades Adicionadas */}
                {tripData.cities.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.2rem',
                      color: '#2C3639',
                      margin: '0'
                    }}>
                      📍 Cidades do Roteiro ({tripData.cities.length})
                    </h4>
                    
                    {tripData.cities.map((city, index) => (
                      <div
                        key={city.id}
                        style={{
                          backgroundColor: 'white',
                          border: '2px solid #e8f4f3',
                          borderRadius: '15px',
                          padding: '1.5rem',
                          position: 'relative'
                        }}
                      >
                        {/* Header da cidade */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={city.imageUrl}
                              alt={city.name}
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '10px',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                            <div>
                              <h3 style={{
                                fontSize: '1.4rem',
                                fontFamily: 'Cormorant Garamond, serif',
                                color: '#2C3639',
                                margin: '0 0 0.5rem 0'
                              }}>
                                {index + 1}. {city.name}, {city.country}
                              </h3>
                              
                              <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                                marginBottom: '0.5rem'
                              }}>
                                {(city.tags || []).slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    style={{
                                      backgroundColor: '#e8f4f3',
                                      color: '#7C9A92',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '0.7rem',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              {city.weatherInfo && (
                                <p style={{
                                  fontSize: '0.8rem',
                                  color: '#666',
                                  margin: '0'
                                }}>
                                  {city.weatherInfo}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveCity(city.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Remover
                          </button>
                        </div>

                        {/* Período na cidade */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#2C3639',
                              marginBottom: '0.5rem'
                            }}>
                              Chegada
                            </label>
                            <input
                              type="date"
                              value={city.startDate}
                              onChange={(e) => handleUpdateCityDates(city.id, 'startDate', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                          
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#2C3639',
                              marginBottom: '0.5rem'
                            }}>
                              Partida
                            </label>
                            <input
                              type="date"
                              value={city.endDate}
                              onChange={(e) => handleUpdateCityDates(city.id, 'endDate', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>

                        {/* Highlights da cidade */}
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
                            {(city.highlights || []).slice(0, 5).map((highlight, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#f8f9fa',
                                  color: '#666',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '0.8rem'
                                }}
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Notas da cidade */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#2C3639',
                            marginBottom: '0.5rem'
                          }}>
                            📝 Notas Pessoais
                          </label>
                          <textarea
                            value={city.userNotes}
                            onChange={(e) => handleUpdateCityDates(city.id, 'userNotes', e.target.value)}
                            placeholder="Adicione suas anotações sobre esta cidade..."
                            rows={2}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #e0e0e0',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              outline: 'none',
                              resize: 'vertical',
                              fontFamily: 'Montserrat, sans-serif'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tripData.cities.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Nenhuma cidade adicionada</h3>
                    <p>Use a busca acima para encontrar e adicionar cidades ao seu roteiro</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Viajantes */}
            {activeTab === 'travelers' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '2rem'
                }}>
                  👥 Grupo de Viajantes
                </h2>

                {/* Adicionar novo viajante */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  marginBottom: '2rem'
                }}>
                  <h4 style={{
                    fontSize: '1.2rem',
                    color: '#2C3639',
                    marginBottom: '1rem'
                  }}>
                    ➕ Adicionar Viajante
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr auto',
                    gap: '1rem',
                    alignItems: 'flex-end'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2C3639',
                        marginBottom: '0.5rem'
                      }}>
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={newTraveler.name}
                        onChange={(e) => setNewTraveler(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: João Silva"
                        style={{
                          width: '100%',
                          padding: '12px',
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
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2C3639',
                        marginBottom: '0.5rem'
                      }}>
                        Email (opcional)
                      </label>
                      <input
                        type="email"
                        value={newTraveler.email}
                        onChange={(e) => setNewTraveler(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="joao@email.com"
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={handleAddTraveler}
                      disabled={!newTraveler.name.trim()}
                      style={{
                        backgroundColor: '#7C9A92',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        cursor: !newTraveler.name.trim() ? 'not-allowed' : 'pointer',
                        opacity: !newTraveler.name.trim() ? 0.6 : 1
                      }}
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de viajantes */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {tripData.travelers.map((traveler, index) => (
                    <div
                      key={traveler.id}
                      style={{
                        backgroundColor: 'white',
                        border: traveler.role === 'organizador' ? '2px solid #7C9A92' : '2px solid #e0e0e0',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                      }}>
                        <div>
                          <h4 style={{
                            fontSize: '1.2rem',
                            fontFamily: 'Cormorant Garamond, serif',
                            color: '#2C3639',
                            margin: '0 0 0.5rem 0'
                          }}>
                            {traveler.role === 'organizador' ? '👑' : '👤'} {traveler.name || 'Nome não definido'}
                          </h4>
                          
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#666',
                            margin: '0'
                          }}>
                            {traveler.email && `📧 ${traveler.email}`}
                          </p>
                          
                          <span style={{
                            fontSize: '0.8rem',
                            backgroundColor: traveler.role === 'organizador' ? '#7C9A92' : '#e0e0e0',
                            color: traveler.role === 'organizador' ? 'white' : '#666',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            marginTop: '0.5rem',
                            display: 'inline-block'
                          }}>
                            {traveler.role === 'organizador' ? 'Organizador' : 'Viajante'}
                          </span>
                        </div>
                        
                        {traveler.role !== 'organizador' && (
                          <button
                            onClick={() => handleRemoveTraveler(traveler.id)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✖️
                          </button>
                        )}
                      </div>

                      {traveler.role === 'organizador' && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr',
                          gap: '0.5rem'
                        }}>
                          <input
                            type="text"
                            value={traveler.name}
                            onChange={(e) => {
                              setTripData(prev => ({
                                ...prev,
                                travelers: prev.travelers.map(t => 
                                  t.id === traveler.id ? { ...t, name: e.target.value } : t
                                )
                              }));
                            }}
                            placeholder="Seu nome"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          />
                          
                          <input
                            type="email"
                            value={traveler.email}
                            onChange={(e) => {
                              setTripData(prev => ({
                                ...prev,
                                travelers: prev.travelers.map(t => 
                                  t.id === traveler.id ? { ...t, email: e.target.value } : t
                                )
                              }));
                            }}
                            placeholder="Seu email"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              outline: 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Preview */}
            {activeTab === 'preview' && (
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontFamily: 'Cormorant Garamond, serif',
                  color: '#2C3639',
                  marginBottom: '2rem'
                }}>
                  👁️ Preview da Viagem
                </h2>

                <div style={{
                  backgroundColor: 'white',
                  border: '2px solid #e8f4f3',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  {/* Header Preview */}
                  <div style={{
                    height: '200px',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${tripData.image || tripData.cities[0]?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    <div>
                      <h1 style={{
                        fontSize: '2.5rem',
                        fontFamily: 'Cormorant Garamond, serif',
                        margin: '0 0 1rem 0'
                      }}>
                        {tripData.name || 'Nome da Viagem'}
                      </h1>
                      
                      {tripData.startDate && tripData.endDate && (
                        <p style={{
                          fontSize: '1.1rem',
                          margin: '0'
                        }}>
                          📅 {new Date(tripData.startDate).toLocaleDateString('pt-BR')} - {new Date(tripData.endDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo Preview */}
                  <div style={{ padding: '2rem' }}>
                    {/* Descrição */}
                    {tripData.description && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontFamily: 'Cormorant Garamond, serif',
                          color: '#2C3639',
                          marginBottom: '1rem'
                        }}>
                          📖 Sobre esta viagem
                        </h3>
                        <p style={{
                          fontSize: '1.1rem',
                          lineHeight: '1.6',
                          color: '#666'
                        }}>
                          {tripData.description}
                        </p>
                      </div>
                    )}

                    {/* Cidades */}
                    {tripData.cities.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontFamily: 'Cormorant Garamond, serif',
                          color: '#2C3639',
                          marginBottom: '1rem'
                        }}>
                          🏙️ Roteiro ({tripData.cities.length} cidades)
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem'
                        }}>
                          {tripData.cities.map((city, index) => (
                            <div
                              key={city.id}
                              style={{
                                backgroundColor: '#f8f9fa',
                                padding: '1rem',
                                borderRadius: '10px',
                                borderLeft: '4px solid #7C9A92',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                              }}
                            >
                              <img
                                src={city.imageUrl}
                                alt={city.name}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  borderRadius: '8px',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <h4 style={{
                                  fontSize: '1.2rem',
                                  color: '#2C3639',
                                  margin: '0 0 0.5rem 0'
                                }}>
                                  {index + 1}. {city.name}, {city.country}
                                </h4>
                                
                              {city.startDate && city.endDate ? (
                                <p style={{
                                  fontSize: '0.9rem',
                                  color: '#666',
                                  margin: '0 0 0.5rem 0'
                                }}>
                                  📅 {new Date(city.startDate).toLocaleDateString('pt-BR')} a {new Date(city.endDate).toLocaleDateString('pt-BR')}
                                </p>
                              ) : (
                                <p style={{
                                  fontSize: '0.9rem',
                                  color: '#ff6b6b',
                                  margin: '0 0 0.5rem 0',
                                  fontStyle: 'italic'
                                }}>
                                  📅 Configure as datas da viagem para calcular automaticamente
                                </p>
                              )}
                                
                                <div style={{
                                  display: 'flex',
                                  gap: '0.5rem',
                                  flexWrap: 'wrap'
                                }}>
                                  {(city.highlights || []).slice(0, 3).map((highlight, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        backgroundColor: '#e8f4f3',
                                        color: '#7C9A92',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: '500'
                                      }}
                                    >
                                      {highlight}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Viajantes */}
                    {tripData.travelers.filter(t => t.name.trim()).length > 1 && (
                      <div>
                        <h3 style={{
                          fontSize: '1.5rem',
                          fontFamily: 'Cormorant Garamond, serif',
                          color: '#2C3639',
                          marginBottom: '1rem'
                        }}>
                          👥 Grupo de Viajantes ({tripData.travelers.filter(t => t.name.trim()).length})
                        </h3>
                        
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem'
                        }}>
                          {tripData.travelers.filter(t => t.name.trim()).map((traveler) => (
                            <span
                              key={traveler.id}
                              style={{
                                backgroundColor: traveler.role === 'organizador' ? '#7C9A92' : '#e8f4f3',
                                color: traveler.role === 'organizador' ? 'white' : '#7C9A92',
                                padding: '6px 12px',
                                borderRadius: '15px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                              }}
                            >
                              {traveler.role === 'organizador' ? '👑' : '👤'} {traveler.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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

export default EnhancedTripEditor;