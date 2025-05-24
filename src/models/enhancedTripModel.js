// src/models/enhancedTripModel.js - Modelo Avançado com IA

/**
 * Modelo avançado para viagens com IA e funcionalidades estendidas
 */
export const enhancedTripModel = {
  // Informações básicas
  id: "uuid-gerado",
  name: "Viagem à Europa",
  description: "Texto gerado por IA baseado nas cidades e período", // IA
  customDescription: "Descrição personalizada do usuário (opcional)",
  coverImage: "url-da-imagem",
  
  // Datas gerais da viagem
  startDate: "2025-06-10",
  endDate: "2025-06-25",
  
  // Metadados
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "user-123",
  isPublic: false,
  
  // Grupo de viajantes
  travelers: [
    {
      id: "traveler-1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "+55 11 99999-9999",
      role: "organizador", // organizador, viajante
      avatar: "url-avatar",
      isConfirmed: true
    },
    {
      id: "traveler-2", 
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "+55 11 88888-8888",
      role: "viajante",
      avatar: "url-avatar",
      isConfirmed: false
    }
  ],
  
  // Cidades com informações expandidas
  cities: [
    {
      id: "city-1",
      name: "Paris", // Nome fornecido pelo usuário
      country: "França", // IA - detectado automaticamente
      countryCode: "FR", // IA
      coordinates: { lat: 48.8566, lng: 2.3522 }, // IA
      timezone: "Europe/Paris", // IA
      
      // Período específico nesta cidade
      arrivalDate: "2025-06-10",
      departureDate: "2025-06-15",
      
      // Informações geradas por IA
      aiGenerated: {
        briefDescription: "Paris, a Cidade Luz, é famosa por sua arquitetura icônica, museus mundialmente renomados como o Louvre, e sua rica cultura gastronômica.", // IA
        weatherForecast: {
          season: "Início do Verão",
          avgTemperature: "18-24°C",
          conditions: "Ensolarado com possibilidade de chuvas ocasionais",
          recommendation: "Leve roupas leves e um casaco para as noites mais frescas"
        }, // IA baseado no período
        highlights: [
          "Torre Eiffel",
          "Museu do Louvre", 
          "Champs-Élysées",
          "Montmartre"
        ], // IA
        localCurrency: "Euro (EUR)", // IA
        language: "Francês", // IA
        bestTimeToVisit: "O período escolhido (junho) é ideal para visitar Paris, com dias mais longos e clima agradável." // IA
      },
      
      // Informações customizáveis pelo usuário
      userNotes: "Lembrar de reservar restaurante romântico",
      plannedBudget: 800,
      currency: "EUR",
      
      // Atividades planejadas
      activities: [
        {
          id: "activity-1",
          date: "2025-06-11",
          time: "10:00",
          title: "Torre Eiffel",
          description: "Visita com subida ao topo",
          type: "passeio",
          estimatedDuration: 180, // minutos
          price: 25,
          currency: "EUR"
        }
      ],
      
      // Transporte para próxima cidade
      transportToNext: {
        type: "Trem", // Trem, Avião, Carro, Ônibus
        duration: "3h 20min", // IA - calculado automaticamente
        price: 75,
        currency: "EUR",
        bookingUrl: "",
        notes: "Trem de alta velocidade - reservar com antecedência"
      }
    },
    {
      id: "city-2",
      name: "Roma",
      country: "Itália", // IA
      countryCode: "IT", // IA
      coordinates: { lat: 41.9028, lng: 12.4964 }, // IA
      timezone: "Europe/Rome", // IA
      
      arrivalDate: "2025-06-15",
      departureDate: "2025-06-20",
      
      aiGenerated: {
        briefDescription: "Roma, a Cidade Eterna, oferece uma impressionante coleção de ruínas antigas, arte renascentista e uma vibrante cultura italiana.", // IA
        weatherForecast: {
          season: "Início do Verão",
          avgTemperature: "22-28°C",
          conditions: "Quente e ensolarado",
          recommendation: "Use protetor solar, chapéu e roupas leves. Mantenha-se hidratado."
        }, // IA
        highlights: [
          "Coliseu",
          "Vaticano", 
          "Fontana di Trevi",
          "Pantheon"
        ], // IA
        localCurrency: "Euro (EUR)", // IA
        language: "Italiano", // IA
        bestTimeToVisit: "Junho é uma excelente época para Roma, mas pode estar um pouco quente. Visite atrações principais pela manhã." // IA
      },
      
      userNotes: "Reservar tour do Vaticano",
      plannedBudget: 600,
      currency: "EUR",
      activities: [],
      transportToNext: null // Última cidade
    }
  ],
  
  // Resumo geral da viagem (gerado por IA)
  aiSummary: {
    generatedAt: new Date(),
    overview: "Uma fascinante jornada de 15 dias pela Europa Ocidental, explorando duas das cidades mais icônicas do continente. Esta viagem combina a elegância parisiense com a história milenar de Roma, oferecendo uma experiência cultural rica e diversificada.", // IA
    weatherSummary: "Clima favorável em ambas as cidades durante junho, com temperaturas amenas em Paris (18-24°C) e mais quentes em Roma (22-28°C). Período ideal para turismo ao ar livre.", // IA
    budgetEstimate: {
      total: 1400,
      breakdown: {
        accommodation: 600,
        food: 400,
        transport: 200,
        activities: 150,
        miscellaneous: 50
      },
      currency: "EUR"
    }, // IA
    travelTips: [
      "Reserve atrações principais com antecedência para evitar filas",
      "Leve adaptador universal para tomadas europeias",
      "Considere comprar passes de transporte público para economizar",
      "Experimente a culinária local em restaurantes familiares"
    ], // IA
    packingRecommendations: [
      "Roupas leves para o dia",
      "Casaco leve para as noites",
      "Sapatos confortáveis para caminhadas",
      "Protetor solar e chapéu",
      "Guarda-chuva compacto"
    ] // IA
  },
  
  // Orçamento detalhado
  budget: {
    currency: "EUR",
    totalPlanned: 1400,
    totalSpent: 0,
    categories: {
      accommodation: { planned: 600, spent: 0 },
      food: { planned: 400, spent: 0 },
      transport: { planned: 200, spent: 0 },
      activities: { planned: 150, spent: 0 },
      miscellaneous: { planned: 50, spent: 0 }
    },
    perPerson: true, // Se o orçamento é por pessoa ou total do grupo
    sharedExpenses: [] // Lista de gastos compartilhados
  },
  
  // Checklist inteligente (gerado por IA baseado no destino e época)
  checklist: {
    documents: [
      { id: "doc-1", item: "Passaporte válido", checked: false, aiGenerated: true },
      { id: "doc-2", item: "Seguro viagem Europa", checked: false, aiGenerated: true },
      { id: "doc-3", item: "Cartão de crédito internacional", checked: false, aiGenerated: true }
    ],
    clothing: [
      { id: "cloth-1", item: "Roupas leves para calor", checked: false, aiGenerated: true },
      { id: "cloth-2", item: "Casaco para noites frescas", checked: false, aiGenerated: true },
      { id: "cloth-3", item: "Sapatos confortáveis", checked: false, aiGenerated: true }
    ],
    electronics: [
      { id: "elec-1", item: "Adaptador universal tipo C/F", checked: false, aiGenerated: true },
      { id: "elec-2", item: "Power bank", checked: false, aiGenerated: true }
    ],
    health: [
      { id: "health-1", item: "Protetor solar FPS 50+", checked: false, aiGenerated: true },
      { id: "health-2", item: "Remédios pessoais", checked: false, aiGenerated: false }
    ]
  },
  
  // Configurações de privacidade e compartilhamento
  sharing: {
    isPublic: false,
    allowComments: false,
    sharedWith: [], // Lista de emails com quem a viagem foi compartilhada
    shareableLink: "", // Link único para compartilhamento
    permissions: {
      canEdit: [], // IDs de usuários que podem editar
      canView: []  // IDs de usuários que podem apenas visualizar
    }
  }
};

/**
 * Modelo para criar nova viagem (valores iniciais)
 */
export const newEnhancedTripModel = {
  name: "",
  description: "", // Será gerado por IA após adicionar cidades
  customDescription: "",
  coverImage: "",
  startDate: "",
  endDate: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "",
  isPublic: false,
  travelers: [
    {
      id: "traveler-main",
      name: "",
      email: "",
      role: "organizador",
      isConfirmed: true
    }
  ],
  cities: [],
  aiSummary: null, // Será gerado após salvar
  budget: {
    currency: "BRL",
    totalPlanned: 0,
    totalSpent: 0,
    categories: {
      accommodation: { planned: 0, spent: 0 },
      food: { planned: 0, spent: 0 },
      transport: { planned: 0, spent: 0 },
      activities: { planned: 0, spent: 0 },
      miscellaneous: { planned: 0, spent: 0 }
    },
    perPerson: true,
    sharedExpenses: []
  },
  checklist: {
    documents: [],
    clothing: [],
    electronics: [],
    health: []
  },
  sharing: {
    isPublic: false,
    allowComments: false,
    sharedWith: [],
    shareableLink: "",
    permissions: {
      canEdit: [],
      canView: []
    }
  }
};

/**
 * APIs e serviços para funcionalidades de IA
 */
export const aiServices = {
  // Serviço para detectar país da cidade
  getCityInfo: async (cityName) => {
    // Aqui você integraria com APIs como:
    // - OpenWeatherMap Geocoding API
    // - Google Places API
    // - REST Countries API
    
    // Exemplo de implementação mock:
    const mockCityData = {
      "Paris": {
        country: "França",
        countryCode: "FR", 
        coordinates: { lat: 48.8566, lng: 2.3522 },
        timezone: "Europe/Paris"
      },
      "Roma": {
        country: "Itália",
        countryCode: "IT",
        coordinates: { lat: 41.9028, lng: 12.4964 },
        timezone: "Europe/Rome"
      },
      "Tokyo": {
        country: "Japão",
        countryCode: "JP",
        coordinates: { lat: 35.6762, lng: 139.6503 },
        timezone: "Asia/Tokyo"
      }
    };
    
    return mockCityData[cityName] || {
      country: "País não identificado",
      countryCode: "XX",
      coordinates: { lat: 0, lng: 0 },
      timezone: "UTC"
    };
  },
  
  // Serviço para gerar descrição da cidade
  generateCityDescription: async (cityName, country, startDate, endDate) => {
    // Aqui você integraria com APIs como:
    // - OpenAI GPT API
    // - Google Gemini API
    // - Anthropic Claude API
    
    // Mock implementation
    const descriptions = {
      "Paris": "Paris, a Cidade Luz, é famosa por sua arquitetura icônica, museus mundialmente renomados como o Louvre, e sua rica cultura gastronômica.",
      "Roma": "Roma, a Cidade Eterna, oferece uma impressionante coleção de ruínas antigas, arte renascentista e uma vibrante cultura italiana."
    };
    
    return descriptions[cityName] || `${cityName} é um destino fascinante com rica história e cultura única.`;
  },
  
  // Serviço para prever clima
  getWeatherForecast: async (cityName, startDate, endDate) => {
    // Aqui você integraria com APIs como:
    // - OpenWeatherMap API
    // - WeatherAPI
    // - AccuWeather API
    
    // Mock implementation baseada na época do ano
    const month = new Date(startDate).getMonth();
    const seasonData = {
      "Paris": {
        summer: { season: "Verão", avgTemp: "18-24°C", conditions: "Ensolarado com chuvas ocasionais" },
        winter: { season: "Inverno", avgTemp: "3-8°C", conditions: "Frio com possibilidade de neve" }
      }
    };
    
    const season = month >= 5 && month <= 8 ? "summer" : "winter";
    return seasonData[cityName]?.[season] || {
      season: "Clima variável",
      avgTemp: "15-25°C", 
      conditions: "Consulte previsão local"
    };
  },
  
  // Serviço para gerar resumo da viagem
  generateTripSummary: async (tripData) => {
    // Integração com IA para análise completa da viagem
    return {
      overview: "Uma fascinante jornada explorando destinos únicos com experiências culturais ricas.",
      weatherSummary: "Clima favorável durante o período da viagem.",
      budgetEstimate: { total: 1000, currency: "BRL" },
      travelTips: ["Reserve com antecedência", "Leve documentos organizados"],
      packingRecommendations: ["Roupas confortáveis", "Protetor solar"]
    };
  }
};