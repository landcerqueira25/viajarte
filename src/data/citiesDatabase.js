// src/data/citiesDatabase.js
// BASE DE DADOS DE CIDADES - VERSÃO CORRIGIDA PARA EVITAR ERROS

export const citiesDatabase = {
  // 🇫🇷 FRANÇA
  "paris": {
    id: "paris",
    name: "Paris",
    country: "França",
    countryCode: "FR",
    continent: "Europa",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    timezone: "Europe/Paris",
    currency: "EUR",
    language: "Francês",
    description: "A Cidade Luz, famosa pela Torre Eiffel, Louvre e charme parisiense",
    highlights: ["Torre Eiffel", "Museu do Louvre", "Champs-Élysées", "Arco do Triunfo", "Montmartre"],
    bestMonths: [4, 5, 6, 9, 10],
    averageTemp: { spring: "15-20°C", summer: "20-25°C", autumn: "15-20°C", winter: "5-10°C" },
    imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80",
    tags: ["romance", "arte", "história", "gastronomia"]
  },

  // 🇳🇱 HOLANDA
  "amsterda": {
    id: "amsterda",
    name: "Amsterdã",
    country: "Holanda",
    countryCode: "NL",
    continent: "Europa",
    coordinates: { lat: 52.3676, lng: 4.9041 },
    timezone: "Europe/Amsterdam",
    currency: "EUR",
    language: "Holandês",
    description: "Cidade dos canais, museus impressionantes e atmosfera única",
    highlights: ["Canais", "Museu Van Gogh", "Casa de Anne Frank", "Distrito da Luz Vermelha", "Vondelpark"],
    bestMonths: [4, 5, 6, 7, 8, 9],
    averageTemp: { spring: "10-15°C", summer: "15-22°C", autumn: "10-15°C", winter: "2-8°C" },
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
    tags: ["canais", "museus", "bicicletas", "liberal"]
  },

  // 🇩🇪 ALEMANHA
  "berlim": {
    id: "berlim",
    name: "Berlim",
    country: "Alemanha",
    countryCode: "DE",
    continent: "Europa",
    coordinates: { lat: 52.5200, lng: 13.4050 },
    timezone: "Europe/Berlin",
    currency: "EUR",
    language: "Alemão",
    description: "Capital alemã rica em história, arte e vida noturna vibrante",
    highlights: ["Portão de Brandemburgo", "Muro de Berlim", "Ilha dos Museus", "Reichstag", "East Side Gallery"],
    bestMonths: [5, 6, 7, 8, 9],
    averageTemp: { spring: "10-18°C", summer: "18-24°C", autumn: "10-18°C", winter: "0-5°C" },
    imageUrl: "https://images.unsplash.com/photo-1587330979470-3end1dd31c6c?w=800&q=80",
    tags: ["história", "arte", "vida noturna", "cultura"]
  },

  // 🇨🇿 REPÚBLICA TCHECA
  "praga": {
    id: "praga",
    name: "Praga",
    country: "República Tcheca",
    countryCode: "CZ",
    continent: "Europa",
    coordinates: { lat: 49.7437, lng: 15.3386 },
    timezone: "Europe/Prague",
    currency: "CZK",
    language: "Tcheco",
    description: "Cidade medieval encantadora, conhecida como a 'Cidade Dourada'",
    highlights: ["Castelo de Praga", "Ponte Carlos", "Praça da Cidade Velha", "Relógio Astronômico", "Bairro Judeu"],
    bestMonths: [4, 5, 6, 9, 10],
    averageTemp: { spring: "8-18°C", summer: "15-25°C", autumn: "8-18°C", winter: "-2-5°C" },
    imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",
    tags: ["medieval", "castelos", "cerveja", "arquitetura"]
  },

  // 🇦🇹 ÁUSTRIA
  "viena": {
    id: "viena",
    name: "Viena",
    country: "Áustria",
    countryCode: "AT",
    continent: "Europa",
    coordinates: { lat: 48.2082, lng: 16.3738 },
    timezone: "Europe/Vienna",
    currency: "EUR",
    language: "Alemão",
    description: "Capital imperial austríaca, famosa pela música clássica e arquitetura",
    highlights: ["Palácio de Schönbrunn", "Ópera de Viena", "Catedral de Santo Estêvão", "Palácio Belvedere", "Prater"],
    bestMonths: [4, 5, 6, 9, 10],
    averageTemp: { spring: "10-20°C", summer: "18-26°C", autumn: "10-20°C", winter: "0-8°C" },
    imageUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80",
    tags: ["imperial", "música", "palácios", "cafés"]
  },

  // 🇨🇭 SUÍÇA
  "zurique": {
    id: "zurique",
    name: "Zurique",
    country: "Suíça",
    countryCode: "CH",
    continent: "Europa",
    coordinates: { lat: 47.3769, lng: 8.5417 },
    timezone: "Europe/Zurich",
    currency: "CHF",
    language: "Alemão",
    description: "Centro financeiro suíço com paisagens alpinas deslumbrantes",
    highlights: ["Lago de Zurique", "Centro Histórico", "Grossmünster", "Bahnhofstrasse", "Uetliberg"],
    bestMonths: [5, 6, 7, 8, 9],
    averageTemp: { spring: "8-18°C", summer: "15-24°C", autumn: "8-18°C", winter: "0-6°C" },
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tags: ["lagos", "montanhas", "luxo", "natureza"]
  },

  // 🇮🇹 ITÁLIA
  "roma": {
    id: "roma",
    name: "Roma",
    country: "Itália",
    countryCode: "IT",
    continent: "Europa",
    coordinates: { lat: 41.9028, lng: 12.4964 },
    timezone: "Europe/Rome",
    currency: "EUR",
    language: "Italiano",
    description: "A Cidade Eterna, berço da civilização ocidental e arte renascentista",
    highlights: ["Coliseu", "Vaticano", "Fontana di Trevi", "Pantheon", "Fórum Romano"],
    bestMonths: [4, 5, 6, 9, 10],
    averageTemp: { spring: "15-22°C", summer: "22-30°C", autumn: "15-22°C", winter: "8-15°C" },
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    tags: ["história", "arte", "religião", "gastronomia"]
  }
};

// 🔍 FUNÇÕES DE BUSCA E FILTRO - VERSÃO SEGURA
export const cityHelpers = {
  // Buscar cidade por ID
  getCityById: (cityId) => {
    const city = citiesDatabase[cityId?.toLowerCase()];
    if (!city) return null;
    
    // Garantir que todos os arrays existem
    return {
      ...city,
      highlights: city.highlights || [],
      tags: city.tags || [],
      bestMonths: city.bestMonths || [],
      activities: city.activities || []
    };
  },

  // Buscar cidades por país
  getCitiesByCountry: (country) => {
    if (!country) return [];
    
    return Object.values(citiesDatabase).filter(city => 
      city.country && city.country.toLowerCase().includes(country.toLowerCase())
    ).map(city => ({
      ...city,
      highlights: city.highlights || [],
      tags: city.tags || [],
      bestMonths: city.bestMonths || [],
      activities: city.activities || []
    }));
  },

  // Buscar cidades por nome (busca parcial)
  searchCities: (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      return cityHelpers.getAllCities();
    }
    
    const term = searchTerm.toLowerCase();
    return Object.values(citiesDatabase).filter(city =>
      (city.name && city.name.toLowerCase().includes(term)) ||
      (city.country && city.country.toLowerCase().includes(term)) ||
      (city.tags && Array.isArray(city.tags) && city.tags.some(tag => 
        tag && tag.toLowerCase().includes(term)
      ))
    ).map(city => ({
      ...city,
      highlights: city.highlights || [],
      tags: city.tags || [],
      bestMonths: city.bestMonths || [],
      activities: city.activities || []
    }));
  },

  // Obter todas as cidades
  getAllCities: () => {
    return Object.values(citiesDatabase).map(city => ({
      ...city,
      highlights: city.highlights || [],
      tags: city.tags || [],
      bestMonths: city.bestMonths || [],
      activities: city.activities || []
    }));
  },

  // Obter países únicos
  getCountries: () => {
    const countries = [...new Set(Object.values(citiesDatabase)
      .map(city => city.country)
      .filter(Boolean)
    )];
    return countries.sort();
  },

  // Obter cidades por tags
  getCitiesByTag: (tag) => {
    if (!tag) return [];
    
    return Object.values(citiesDatabase).filter(city =>
      city.tags && Array.isArray(city.tags) && 
      city.tags.includes(tag.toLowerCase())
    ).map(city => ({
      ...city,
      highlights: city.highlights || [],
      tags: city.tags || [],
      bestMonths: city.bestMonths || [],
      activities: city.activities || []
    }));
  },

  // Calcular distância aproximada entre duas cidades (fórmula simplificada)
  calculateDistance: (city1Id, city2Id) => {
    const city1 = citiesDatabase[city1Id];
    const city2 = citiesDatabase[city2Id];
    
    if (!city1 || !city2 || !city1.coordinates || !city2.coordinates) return 0;
    
    const lat1 = city1.coordinates.lat * Math.PI / 180;
    const lat2 = city2.coordinates.lat * Math.PI / 180;
    const deltaLat = (city2.coordinates.lat - city1.coordinates.lat) * Math.PI / 180;
    const deltaLng = (city2.coordinates.lng - city1.coordinates.lng) * Math.PI / 180;
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371 * c; // Raio da Terra em km
    
    return Math.round(distance);
  },

  // Sugerir próximas cidades baseado na localização
  getSuggestedCities: (currentCityId, maxDistance = 1000) => {
    const currentCity = citiesDatabase[currentCityId];
    if (!currentCity) return [];
    
    return Object.values(citiesDatabase)
      .filter(city => city.id !== currentCityId)
      .map(city => ({
        ...city,
        highlights: city.highlights || [],
        tags: city.tags || [],
        bestMonths: city.bestMonths || [],
        activities: city.activities || [],
        distance: cityHelpers.calculateDistance(currentCityId, city.id)
      }))
      .filter(city => city.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  },

  // Gerar descrição de clima baseado no mês
  getWeatherInfo: (cityId, month) => {
    const city = citiesDatabase[cityId];
    if (!city || !city.averageTemp) return "Consulte a previsão local";
    
    let season, temp, description;
    
    if ([3, 4, 5].includes(month)) {
      season = "Primavera";
      temp = city.averageTemp.spring || "15-20°C";
      description = "clima ameno e agradável";
    } else if ([6, 7, 8].includes(month)) {
      season = "Verão";
      temp = city.averageTemp.summer || "20-25°C";
      description = "dias mais longos e ensolarados";
    } else if ([9, 10, 11].includes(month)) {
      season = "Outono";
      temp = city.averageTemp.autumn || "15-20°C";
      description = "clima fresco e paisagens coloridas";
    } else {
      season = "Inverno";
      temp = city.averageTemp.winter || "5-15°C";
      description = "clima frio, possível neve";
    }
    
    const isRecommended = city.bestMonths && Array.isArray(city.bestMonths) && 
                         city.bestMonths.includes(month);
    const recommendation = isRecommended ? 
      "Excelente época para visitar!" : 
      "Boa época, mas verifique as condições climáticas.";
    
    return `🌤️ ${season}: ${temp}, ${description}. ${recommendation}`;
  }
};

// 🎨 TEMAS DE VIAGEM PRÉ-DEFINIDOS
export const travelThemes = {
  "europa-classica": {
    name: "Europa Clássica",
    description: "Roteiro pelos destinos mais icônicos da Europa",
    cities: ["paris", "amsterda", "berlim", "praga", "viena", "roma"],
    duration: "14-21 dias",
    highlights: ["Arte e história", "Arquitetura medieval", "Gastronomia europeia"]
  },
  
  "capitais-imperiais": {
    name: "Capitais Imperiais",
    description: "Explore as antigas capitais dos impérios europeus",
    cities: ["viena", "berlim", "praga", "roma"],
    duration: "10-14 dias",
    highlights: ["Palácios imperiais", "Museus históricos", "Arquitetura majestosa"]
  },
  
  "rota-romantica": {
    name: "Rota Romântica",
    description: "Cidades perfeitas para casais e lua de mel",
    cities: ["paris", "praga", "viena", "roma"],
    duration: "8-12 dias",
    highlights: ["Atmosfera romântica", "Jantar à luz de velas", "Paisagens encantadoras"]
  },
  
  "arte-e-museus": {
    name: "Arte e Museus",
    description: "Para os amantes da arte e cultura",
    cities: ["paris", "amsterda", "berlim", "viena", "roma"],
    duration: "12-16 dias",
    highlights: ["Museus mundiais", "Galerias de arte", "Patrimônio cultural"]
  }
};

export default citiesDatabase;