// src/services/aiService.js
// ⚠️ ARQUIVO DEPRECIADO - NÃO UTILIZADO MAIS
// A aplicação agora usa a base de dados local em /src/data/citiesDatabase.js

console.warn('⚠️ aiService.js está depreciado. Use citiesDatabase.js no lugar.');

// Este arquivo pode ser removido com segurança
// Mantido apenas para compatibilidade durante a transição

export const aiService = {
  // Funções depreciadas - não use
  getCityInfo: () => {
    throw new Error('Use cityHelpers.getCityById() da base local');
  },
  
  getWeatherInfo: () => {
    throw new Error('Use cityHelpers.getWeatherInfo() da base local');
  },
  
  generateTripDescription: () => {
    throw new Error('Use a geração automática no TripEditor');
  },
  
  createCityWithAI: () => {
    throw new Error('Use handleAddCity() com a base local');
  }
};

export const debugAI = {
  testConnection: () => {
    console.log('🗂️ Usando base de dados local - APIs externas não necessárias');
    return { openweather: false, gemini: false };
  }
};

export default aiService;