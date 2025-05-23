// src/models/tripModel.js

/**
 * Modelo de dados completo para uma viagem
 * Segue a estrutura NoSQL para fácil implementação com Firebase/Firestore
 */
export const tripModel = {
  id: "uuid-gerado", // gerado automaticamente
  name: "Viagem à Europa", // nome da viagem
  description: "Conhecendo os principais pontos turísticos da Europa",
  coverImage: "url-da-imagem", // URL da imagem de capa
  themeColor: "ocean", // cor principal da viagem (olive, night, ocean, rose, blossom, cloud)
  startDate: "2025-06-10", // data de início da viagem
  endDate: "2025-06-25", // data de término da viagem
  createdAt: "2025-05-22", // data de criação
  updatedAt: "2025-05-22", // data de atualização
  createdBy: "user-123", // ID do usuário criador
  isPublic: false, // indica se o roteiro é público
  
  // Lista de cidades visitadas
  cities: [
    {
      id: "cidade-1", // ID único da cidade
      name: "Paris", // nome da cidade
      country: "França", // país
      emoji: "🇫🇷", // emoji da bandeira do país
      description: "Cidade Luz", // descrição breve
      image: "url-imagem-paris", // imagem principal da cidade
      arrivalDate: "2025-06-10", // data de chegada
      departureDate: "2025-06-15", // data de saída
      transportToNext: "Trem", // meio de transporte para a próxima cidade
      mapUrl: "https://maps.google.com/?q=Paris,França", // URL do Google Maps
      coordinates: { // coordenadas para o mapa
        lat: 48.8566,
        lng: 2.3522
      },
      // Atividades nesta cidade
      activities: [
        {
          id: "atividade-1", // ID único da atividade
          date: "2025-06-11", // data da atividade
          time: "10:00", // horário
          endTime: "13:00", // horário de término (opcional)
          title: "Torre Eiffel", // título da atividade
          description: "Visita à Torre Eiffel com subida até o topo para vista panorâmica da cidade", // descrição
          type: "passeio", // tipo: passeio, alimentação, transporte, descanso
          address: "Champ de Mars, 5 Av. Anatole France, 75007", // endereço
          mapUrl: "https://maps.google.com/?q=Torre+Eiffel", // link para o mapa
          price: 25, // preço em euros
          currency: "EUR", // moeda
          prebooked: true, // indica se já foi reservado
          tags: ["cultural", "turístico", "ícone"], // tags personalizadas
          image: "url-imagem-torre-eiffel", // imagem do local
          notes: "Reservar com antecedência para evitar filas", // notas pessoais
          completed: false, // indica se a atividade foi concluída
        },
        {
          id: "atividade-2",
          date: "2025-06-11",
          time: "13:30",
          endTime: "15:00",
          title: "Almoço em Le Jules Verne",
          description: "Restaurante gastronômico com vista para a cidade",
          type: "alimentação",
          address: "Torre Eiffel, 2º andar",
          mapUrl: "https://maps.google.com/?q=Le+Jules+Verne+Paris",
          price: 150,
          currency: "EUR",
          prebooked: true,
          tags: ["gastronômico", "luxo"],
          image: "url-imagem-restaurante",
          notes: "Reserva confirmada às 13:30",
          completed: false,
        }
      ],
      // Galeria de imagens da cidade
      gallery: [
        {
          id: "imagem-1",
          url: "url-imagem-1",
          caption: "Vista noturna da Torre Eiffel",
          takenAt: "2025-06-11",
        },
        {
          id: "imagem-2",
          url: "url-imagem-2",
          caption: "Arco do Triunfo",
          takenAt: "2025-06-12",
        }
      ]
    },
    {
      id: "cidade-2",
      name: "Roma",
      country: "Itália",
      emoji: "🇮🇹",
      description: "Cidade Eterna",
      image: "url-imagem-roma",
      arrivalDate: "2025-06-15",
      departureDate: "2025-06-20",
      transportToNext: "Avião",
      mapUrl: "https://maps.google.com/?q=Roma,Italia",
      coordinates: {
        lat: 41.9028,
        lng: 12.4964
      },
      activities: [
        {
          id: "atividade-3",
          date: "2025-06-16",
          time: "09:00",
          endTime: "12:00",
          title: "Coliseu",
          description: "Visita ao Coliseu com guia em português",
          type: "passeio",
          address: "Piazza del Colosseo, 1, 00184 Roma",
          mapUrl: "https://maps.google.com/?q=Coliseu+Roma",
          price: 35,
          currency: "EUR",
          prebooked: true,
          tags: ["cultural", "histórico"],
          image: "url-imagem-coliseu",
          notes: "Levar protetor solar e água",
          completed: false,
        }
      ],
      gallery: [
        {
          id: "imagem-3",
          url: "url-imagem-3",
          caption: "Fontana di Trevi",
          takenAt: "2025-06-17",
        }
      ]
    }
  ],
  
  // Checklist de itens para a viagem
  checklist: {
    documentos: [
      { id: "doc-1", item: "Passaporte", checked: true, quantity: 1 },
      { id: "doc-2", item: "Seguro viagem", checked: true, quantity: 1 },
      { id: "doc-3", item: "Cartão de crédito internacional", checked: false, quantity: 2 }
    ],
    roupas: [
      { id: "roupa-1", item: "Camisetas", checked: false, quantity: 7 },
      { id: "roupa-2", item: "Calças", checked: false, quantity: 3 },
      { id: "roupa-3", item: "Casaco", checked: false, quantity: 1 }
    ],
    eletronicos: [
      { id: "elet-1", item: "Celular", checked: false, quantity: 1 },
      { id: "elet-2", item: "Câmera", checked: false, quantity: 1 },
      { id: "elet-3", item: "Adaptador de tomada", checked: false, quantity: 2 }
    ],
    saude: [
      { id: "saude-1", item: "Remédios pessoais", checked: false, quantity: 1 },
      { id: "saude-2", item: "Kit primeiros socorros", checked: false, quantity: 1 }
    ]
  },
  
  // Orçamento da viagem
  budget: {
    currency: "EUR", // moeda principal
    total: 4500, // orçamento total
    spent: 1200, // valor já gasto
    categories: {
      hospedagem: { budget: 1500, spent: 500 },
      alimentacao: { budget: 1000, spent: 200 },
      transporte: { budget: 1200, spent: 400 },
      passeios: { budget: 800, spent: 100 }
    }
  },
  
  // Notas gerais da viagem
  notes: [
    {
      id: "nota-1",
      title: "Informações importantes",
      content: "Lembrar de ativar o roaming internacional um dia antes da viagem",
      createdAt: "2025-05-22"
    },
    {
      id: "nota-2",
      title: "Contatos de emergência",
      content: "Embaixada do Brasil em Paris: +33 1 45 61 63 00",
      createdAt: "2025-05-22"
    }
  ]
};

/**
 * Modelo para criar uma nova viagem (valores iniciais)
 */
export const newTripModel = {
  name: "",
  description: "",
  coverImage: "",
  themeColor: "ocean",
  startDate: "",
  endDate: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: "",
  isPublic: false,
  cities: [],
  checklist: {
    documentos: [],
    roupas: [],
    eletronicos: [],
    saude: []
  },
  budget: {
    currency: "BRL",
    total: 0,
    spent: 0,
    categories: {
      hospedagem: { budget: 0, spent: 0 },
      alimentacao: { budget: 0, spent: 0 },
      transporte: { budget: 0, spent: 0 },
      passeios: { budget: 0, spent: 0 }
    }
  },
  notes: []
};

/**
 * Modelo para criar uma nova cidade
 */
export const newCityModel = {
  name: "",
  country: "",
  emoji: "",
  description: "",
  image: "",
  arrivalDate: "",
  departureDate: "",
  transportToNext: "",
  mapUrl: "",
  coordinates: {
    lat: 0,
    lng: 0
  },
  activities: [],
  gallery: []
};

/**
 * Modelo para criar uma nova atividade
 */
export const newActivityModel = {
  date: "",
  time: "",
  endTime: "",
  title: "",
  description: "",
  type: "passeio", // padrão: passeio
  address: "",
  mapUrl: "",
  price: 0,
  currency: "BRL", // padrão: BRL
  prebooked: false,
  tags: [],
  image: "",
  notes: "",
  completed: false
};

/**
 * Dados para popular checklists padrão
 */
export const defaultChecklistItems = {
  documentos: [
    { item: "Passaporte", quantity: 1 },
    { item: "Seguro viagem", quantity: 1 },
    { item: "Cartão de crédito internacional", quantity: 2 },
    { item: "Cópias dos documentos", quantity: 1 }
  ],
  roupas: [
    { item: "Camisetas", quantity: 7 },
    { item: "Calças", quantity: 3 },
    { item: "Casaco", quantity: 1 },
    { item: "Roupas íntimas", quantity: 7 },
    { item: "Meias", quantity: 7 },
    { item: "Pijamas", quantity: 2 },
    { item: "Traje de banho", quantity: 2 }
  ],
  eletronicos: [
    { item: "Celular", quantity: 1 },
    { item: "Carregador", quantity: 1 },
    { item: "Adaptador de tomada", quantity: 2 },
    { item: "Power bank", quantity: 1 },
    { item: "Fones de ouvido", quantity: 1 }
  ],
  saude: [
    { item: "Remédios pessoais", quantity: 1 },
    { item: "Kit primeiros socorros", quantity: 1 },
    { item: "Protetor solar", quantity: 1 },
    { item: "Repelente", quantity: 1 },
    { item: "Máscara facial", quantity: 5 },
    { item: "Álcool em gel", quantity: 1 }
  ]
};

/**
 * Lista de tipos de atividades
 */
export const activityTypes = [
  { id: "passeio", label: "Passeio", color: "olive", icon: "🏛️" },
  { id: "alimentacao", label: "Alimentação", color: "rose", icon: "🍽️" },
  { id: "transporte", label: "Transporte", color: "ocean", icon: "🚆" },
  { id: "descanso", label: "Descanso", color: "night", icon: "🛌" },
  { id: "evento", label: "Evento", color: "blossom", icon: "🎭" }
];

/**
 * Lista de tags comuns para atividades
 */
export const commonTags = [
  "cultural", "histórico", "gastronômico", "natureza", "aventura", 
  "relaxante", "romântico", "praia", "museu", "shopping", 
  "parque", "noturno", "família", "esporte", "religioso"
];
