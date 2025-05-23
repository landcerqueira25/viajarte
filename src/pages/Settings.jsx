// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  
  // Estados das configurações
  const [settings, setSettings] = useState({
    // Perfil
    name: 'Letícia Cerqueira',
    email: 'leticia@viajarte.com',
    avatar: '',
    
    // Preferências
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    notifications: {
      email: true,
      push: false,
      reminders: true
    },
    
    // Privacidade
    profilePublic: false,
    shareTrips: true,
    dataAnalytics: true
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Atualizar configuração
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Atualizar configuração aninhada
  const updateNestedSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Salvar configurações
  const handleSave = async () => {
    setLoading(true);
    
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      alert('✅ Configurações salvas com sucesso!');
    }, 1000);
  };

  // Exportar dados
  const handleExportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'viajarte-configuracoes.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('📥 Dados exportados com sucesso!');
  };

  // Resetar configurações
  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações? Esta ação não pode ser desfeita.')) {
      setSettings({
        name: '',
        email: '',
        avatar: '',
        theme: 'light',
        language: 'pt-BR',
        currency: 'BRL',
        notifications: {
          email: true,
          push: false,
          reminders: true
        },
        profilePublic: false,
        shareTrips: true,
        dataAnalytics: true
      });
      alert('🔄 Configurações resetadas!');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: 'Montserrat, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#7C9A92',
        color: 'white',
        padding: '2rem'
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
                color: 'white',
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
              margin: '0'
            }}>
              ⚙️ Configurações
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                backgroundColor: '#D9A6A0',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Salvando...' : '💾 Salvar'}
            </button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '2rem'
      }}>
        {/* Menu Lateral */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          height: 'fit-content',
          position: 'sticky',
          top: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontFamily: 'Cormorant Garamond, serif',
            color: '#2C3639',
            marginBottom: '1.5rem'
          }}>
            Configurações
          </h3>
          
          {[
            { id: 'profile', label: '👤 Perfil', icon: '👤' },
            { id: 'preferences', label: '🎨 Preferências', icon: '🎨' },
            { id: 'notifications', label: '🔔 Notificações', icon: '🔔' },
            { id: 'privacy', label: '🔒 Privacidade', icon: '🔒' },
            { id: 'data', label: '📊 Dados', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#e8f4f3' : 'transparent',
                color: activeTab === tab.id ? '#7C9A92' : '#666',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: '0.5rem',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '2rem'
              }}>
                👤 Informações do Perfil
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSetting('name', e.target.value)}
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
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => updateSetting('email', e.target.value)}
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
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Avatar (URL)
                </label>
                <input
                  type="url"
                  value={settings.avatar}
                  onChange={(e) => updateSetting('avatar', e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
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
          )}

          {/* Tab: Preferências */}
          {activeTab === 'preferences' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '2rem'
              }}>
                🎨 Preferências
              </h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Tema
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="light">☀️ Claro</option>
                  <option value="dark">🌙 Escuro</option>
                  <option value="auto">🤖 Automático</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Idioma
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="pt-BR">🇧🇷 Português (Brasil)</option>
                  <option value="en-US">🇺🇸 English (US)</option>
                  <option value="es-ES">🇪🇸 Español</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2C3639',
                  marginBottom: '0.5rem'
                }}>
                  Moeda
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSetting('currency', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="BRL">💰 Real (R$)</option>
                  <option value="USD">💵 Dólar ($)</option>
                  <option value="EUR">💶 Euro (€)</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab: Notificações */}
          {activeTab === 'notifications' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '2rem'
              }}>
                🔔 Notificações
              </h2>
              
              {[
                { key: 'email', label: '📧 Notificações por Email', description: 'Receber atualizações importantes por email' },
                { key: 'push', label: '📱 Notificações Push', description: 'Notificações do navegador em tempo real' },
                { key: 'reminders', label: '⏰ Lembretes de Viagem', description: 'Lembretes sobre datas e preparativos' }
              ].map((notification) => (
                <div key={notification.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      color: '#2C3639',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {notification.label}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      margin: '0'
                    }}>
                      {notification.description}
                    </p>
                  </div>
                  
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.notifications[notification.key]}
                      onChange={(e) => updateNestedSetting('notifications', notification.key, e.target.checked)}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      backgroundColor: settings.notifications[notification.key] ? '#7C9A92' : '#ccc',
                      borderRadius: '24px',
                      transition: '0.4s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: settings.notifications[notification.key] ? '26px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.4s'
                      }}></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Privacidade */}
          {activeTab === 'privacy' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '2rem'
              }}>
                🔒 Privacidade
              </h2>
              
              {[
                { key: 'profilePublic', label: '👥 Perfil Público', description: 'Permitir que outros usuários vejam seu perfil' },
                { key: 'shareTrips', label: '🌍 Compartilhar Viagens', description: 'Permitir compartilhamento público das suas viagens' },
                { key: 'dataAnalytics', label: '📊 Análise de Dados', description: 'Permitir coleta de dados para melhorar a experiência' }
              ].map((privacy) => (
                <div key={privacy.key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '1.1rem',
                      color: '#2C3639',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {privacy.label}
                    </h4>
                    <p style={{
                      fontSize: '0.9rem',
                      color: '#666',
                      margin: '0'
                    }}>
                      {privacy.description}
                    </p>
                  </div>
                  
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '50px',
                    height: '24px'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings[privacy.key]}
                      onChange={(e) => updateSetting(privacy.key, e.target.checked)}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      backgroundColor: settings[privacy.key] ? '#7C9A92' : '#ccc',
                      borderRadius: '24px',
                      transition: '0.4s'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: settings[privacy.key] ? '26px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.4s'
                      }}></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Dados */}
          {activeTab === 'data' && (
            <div>
              <h2 style={{
                fontSize: '2rem',
                fontFamily: 'Cormorant Garamond, serif',
                color: '#2C3639',
                marginBottom: '2rem'
              }}>
                📊 Gerenciar Dados
              </h2>
              
              <div style={{
                display: 'grid',
                gap: '2rem'
              }}>
                <div style={{
                  padding: '2rem',
                  border: '2px solid #e8f4f3',
                  borderRadius: '12px',
                  backgroundColor: '#f8fffe'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#2C3639',
                    marginBottom: '1rem'
                  }}>
                    📥 Exportar Dados
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '1.5rem'
                  }}>
                    Baixe uma cópia de todos os seus dados do Viajarte.
                  </p>
                  <button
                    onClick={handleExportData}
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
                    📥 Exportar Dados
                  </button>
                </div>
                
                <div style={{
                  padding: '2rem',
                  border: '2px solid #fff4e6',
                  borderRadius: '12px',
                  backgroundColor: '#fffcf7'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#2C3639',
                    marginBottom: '1rem'
                  }}>
                    🔄 Resetar Configurações
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '1.5rem'
                  }}>
                    Restaurar todas as configurações para os valores padrão.
                  </p>
                  <button
                    onClick={handleReset}
                    style={{
                      backgroundColor: '#D9A6A0',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Resetar
                  </button>
                </div>
                
                <div style={{
                  padding: '2rem',
                  border: '2px solid #ffe6e6',
                  borderRadius: '12px',
                  backgroundColor: '#fff8f8'
                }}>
                  <h3 style={{
                    fontSize: '1.3rem',
                    color: '#dc3545',
                    marginBottom: '1rem'
                  }}>
                    ⚠️ Zona de Perigo
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '1.5rem'
                  }}>
                    Excluir permanentemente sua conta e todos os dados associados.
                  </p>
                  <button
                    onClick={() => alert('Esta funcionalidade será implementada em breve.')}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Excluir Conta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;