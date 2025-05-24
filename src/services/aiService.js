// src/services/aiService.js
// SERVIÇO REAL DE IA COM SUAS CHAVES

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Mapeamento de códigos de país para nomes em português
const countryNames = {
  'AD': 'Andorra', 'AE': 'Emirados Árabes Unidos', 'AF': 'Afeganistão', 'AG': 'Antígua e Barbuda',
  'AI': 'Anguilla', 'AL': 'Albânia', 'AM': 'Armênia', 'AO': 'Angola', 'AQ': 'Antártica',
  'AR': 'Argentina', 'AS': 'Samoa Americana', 'AT': 'Áustria', 'AU': 'Austrália', 'AW': 'Aruba',
  'AX': 'Ilhas Åland', 'AZ': 'Azerbaijão', 'BA': 'Bósnia e Herzegovina', 'BB': 'Barbados',
  'BD': 'Bangladesh', 'BE': 'Bélgica', 'BF': 'Burkina Faso', 'BG': 'Bulgária', 'BH': 'Bahrein',
  'BI': 'Burundi', 'BJ': 'Benin', 'BL': 'São Bartolomeu', 'BM': 'Bermudas', 'BN': 'Brunei',
  'BO': 'Bolívia', 'BQ': 'Bonaire', 'BR': 'Brasil', 'BS': 'Bahamas', 'BT': 'Butão',
  'BV': 'Ilha Bouvet', 'BW': 'Botsuana', 'BY': 'Bielorrússia', 'BZ': 'Belize', 'CA': 'Canadá',
  'CC': 'Ilhas Cocos', 'CD': 'República Democrática do Congo', 'CF': 'República Centro-Africana',
  'CG': 'Congo', 'CH': 'Suíça', 'CI': 'Costa do Marfim', 'CK': 'Ilhas Cook', 'CL': 'Chile',
  'CM': 'Camarões', 'CN': 'China', 'CO': 'Colômbia', 'CR': 'Costa Rica', 'CU': 'Cuba',
  'CV': 'Cabo Verde', 'CW': 'Curaçao', 'CX': 'Ilha Christmas', 'CY': 'Chipre', 'CZ': 'República Tcheca',
  'DE': 'Alemanha', 'DJ': 'Djibouti', 'DK': 'Dinamarca', 'DM': 'Dominica', 'DO': 'República Dominicana',
  'DZ': 'Argélia', 'EC': 'Equador', 'EE': 'Estônia', 'EG': 'Egito', 'EH': 'Saara Ocidental',
  'ER': 'Eritreia', 'ES': 'Espanha', 'ET': 'Etiópia', 'FI': 'Finlândia', 'FJ': 'Fiji',
  'FK': 'Ilhas Malvinas', 'FM': 'Micronésia', 'FO': 'Ilhas Faroé', 'FR': 'França', 'GA': 'Gabão',
  'GB': 'Reino Unido', 'GD': 'Granada', 'GE': 'Geórgia', 'GF': 'Guiana Francesa', 'GG': 'Guernsey',
  'GH': 'Gana', 'GI': 'Gibraltar', 'GL': 'Groenlândia', 'GM': 'Gâmbia', 'GN': 'Guiné',
  'GP': 'Guadalupe', 'GQ': 'Guiné Equatorial', 'GR': 'Grécia', 'GS': 'Geórgia do Sul',
  'GT': 'Guatemala', 'GU': 'Guam', 'GW': 'Guiné-Bissau', 'GY': 'Guiana', 'HK': 'Hong Kong',
  'HM': 'Ilhas Heard e McDonald', 'HN': 'Honduras', 'HR': 'Croácia', 'HT': 'Haiti', 'HU': 'Hungria',
  'ID': 'Indonésia', 'IE': 'Irlanda', 'IL': 'Israel', 'IM': 'Ilha de Man', 'IN': 'Índia',
  'IO': 'Território Britânico do Oceano Índico', 'IQ': 'Iraque', 'IR': 'Irã', 'IS': 'Islândia',
  'IT': 'Itália', 'JE': 'Jersey', 'JM': 'Jamaica', 'JO': 'Jordânia', 'JP': 'Japão',
  'KE': 'Quênia', 'KG': 'Quirguistão', 'KH': 'Camboja', 'KI': 'Kiribati', 'KM': 'Comores',
  'KN': 'São Cristóvão e Névis', 'KP': 'Coreia do Norte', 'KR': 'Coreia do Sul', 'KW': 'Kuwait',
  'KY': 'Ilhas Cayman', 'KZ': 'Cazaquistão', 'LA': 'Laos', 'LB': 'Líbano', 'LC': 'Santa Lúcia',
  'LI': 'Liechtenstein', 'LK': 'Sri Lanka', 'LR': 'Libéria', 'LS': 'Lesoto', 'LT': 'Lituânia',
  'LU': 'Luxemburgo', 'LV': 'Letônia', 'LY': 'Líbia', 'MA': 'Marrocos', 'MC': 'Mônaco',
  'MD': 'Moldávia', 'ME': 'Montenegro', 'MF': 'São Martinho', 'MG': 'Madagascar', 'MH': 'Ilhas Marshall',
  'MK': 'Macedônia do Norte', 'ML': 'Mali', 'MM': 'Mianmar', 'MN': 'Mongólia', 'MO': 'Macau',
  'MP': 'Ilhas Marianas do Norte', 'MQ': 'Martinica', 'MR': 'Mauritânia', 'MS': 'Montserrat',
  'MT': 'Malta', 'MU': 'Maurício', 'MV': 'Maldivas', 'MW': 'Malawi', 'MX': 'México',
  'MY': 'Malásia', 'MZ': 'Moçambique', 'NA': 'Namíbia', 'NC': 'Nova Caledônia', 'NE': 'Níger',
  'NF': 'Ilha Norfolk', 'NG': 'Nigéria', 'NI': 'Nicarágua', 'NL': 'Holanda', 'NO': 'Noruega',
  'NP': 'Nepal', 'NR': 'Nauru', 'NU': 'Niue', 'NZ': 'Nova Zelândia', 'OM': 'Omã',
  'PA': 'Panamá', 'PE': 'Peru', 'PF': 'Polinésia Francesa', 'PG': 'Papua-Nova Guiné', 'PH': 'Filipinas',
  'PK': 'Paquistão', 'PL': 'Polônia', 'PM': 'São Pedro e Miquelão', 'PN': 'Pitcairn',
  'PR': 'Porto Rico', 'PS': 'Palestina', 'PT': 'Portugal', 'PW': 'Palau', 'PY': 'Paraguai',
  'QA': 'Catar', 'RE': 'Reunião', 'RO': 'Romênia', 'RS': 'Sérvia', 'RU': 'Rússia',
  'RW': 'Ruanda', 'SA': 'Arábia Saudita', 'SB': 'Ilhas Salomão', 'SC': 'Seychelles', 'SD': 'Sudão',
  'SE': 'Suécia', 'SG': 'Singapura', 'SH': 'Santa Helena', 'SI': 'Eslovênia', 'SJ': 'Svalbard e Jan Mayen',
  'SK': 'Eslováquia', 'SL': 'Serra Leoa', 'SM': 'San Marino', 'SN': 'Senegal', 'SO': 'Somália',
  'SR': 'Suriname', 'SS': 'Sudão do Sul', 'ST': 'São Tomé e Príncipe', 'SV': 'El Salvador',
  'SX': 'Sint Maarten', 'SY': 'Síria', 'SZ': 'Eswatini', 'TC': 'Ilhas Turks e Caicos',
  'TD': 'Chade', 'TF': 'Territórios Franceses do Sul', 'TG': 'Togo', 'TH': 'Tailândia',
  'TJ': 'Tajiquistão', 'TK': 'Tokelau', 'TL': 'Timor-Leste', 'TM': 'Turquemenistão', 'TN': 'Tunísia',
  'TO': 'Tonga', 'TR': 'Turquia', 'TT': 'Trinidad e Tobago', 'TV': 'Tuvalu', 'TW': 'Taiwan',
  'TZ': 'Tanzânia', 'UA': 'Ucrânia', 'UG': 'Uganda', 'UM': 'Ilhas Ultramarinas dos EUA',
  'US': 'Estados Unidos', 'UY': 'Uruguai', 'UZ': 'Uzbequistão', 'VA': 'Vaticano', 'VC': 'São Vicente e Granadinas',
  'VE': 'Venezuela', 'VG': 'Ilhas Virgens Britânicas', 'VI': 'Ilhas Virgens Americanas', 'VN': 'Vietnã',
  'VU': 'Vanuatu', 'WF': 'Wallis e Futuna', 'WS': 'Samoa', 'YE': 'Iêmen', 'YT': 'Mayotte',
  'ZA': 'África do Sul', 'ZM': 'Zâmbia', 'ZW': 'Zimbábue'
};

export const aiService = {
  // 1. BUSCAR INFORMAÇÕES DA CIDADE COM OPENWEATHER
  getCityInfo: async (cityName) => {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('Chave da API OpenWeatherMap não configurada');
    }

    try {
      console.log(`🔍 Buscando informações para: ${cityName}`);
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Cidade não encontrada');
      }
      
      const city = data[0];
      const countryName = countryNames[city.country] || city.country;
      
      console.log(`✅ Cidade encontrada: ${city.name}, ${countryName}`);
      
      return {
        name: city.name,
        country: countryName,
        countryCode: city.country,
        coordinates: {
          lat: city.lat,
          lng: city.lon
        },
        state: city.state || ''
      };
    } catch (error) {
      console.error('❌ Erro ao buscar cidade:', error);
      throw new Error(`Não foi possível encontrar informações para "${cityName}". Verifique se o nome está correto.`);
    }
  },

  // 2. BUSCAR INFORMAÇÕES DO CLIMA
  getWeatherInfo: async (lat, lng, startDate) => {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('Chave da API OpenWeatherMap não configurada');
    }

    try {
      console.log(`🌤️ Buscando clima para coordenadas: ${lat}, ${lng}`);
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na API do clima: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Análise sazonal baseada na data da viagem
      const month = new Date(startDate).getMonth() + 1;
      const season = getSeason(month);
      const temp = Math.round(data.main.temp);
      
      const weatherInfo = {
        currentTemp: temp,
        description: data.weather[0].description,
        season: season,
        humidity: data.main.humidity,
        feelsLike: Math.round(data.main.feels_like),
        recommendation: getClothingRecommendation(temp, season)
      };
      
      console.log(`✅ Clima obtido: ${weatherInfo.description}, ${temp}°C`);
      
      return weatherInfo;
    } catch (error) {
      console.error('❌ Erro ao buscar clima:', error);
      // Retorna informação básica se falhar
      return {
        currentTemp: 20,
        description: 'clima agradável',
        season: 'Consulte a previsão local',
        recommendation: 'Leve roupas versáteis para diferentes temperaturas'
      };
    }
  },

  // 3. GERAR DESCRIÇÃO COM GOOGLE GEMINI
  generateTripDescription: async (cities, startDate, endDate, travelers) => {
    if (!GEMINI_API_KEY) {
      throw new Error('Chave da API Gemini não configurada');
    }

    try {
      console.log('🤖 Gerando descrição com IA...');
      
      const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const cityList = cities.map(city => `${city.name}, ${city.country}`).join(', ');
      const travelerCount = travelers.filter(t => t.name && t.name.trim()).length;
      
      const prompt = `Crie uma descrição inspiradora e envolvente para uma viagem de ${duration} dias visitando ${cityList}. 
      ${travelerCount > 1 ? `A viagem será em grupo com ${travelerCount} pessoas.` : 'Será uma viagem solo.'}
      
      A descrição deve:
      - Ser otimista e despertar interesse pela aventura
      - Mencionar aspectos culturais únicos dos destinos
      - Ser informativa mas não técnica demais
      - Ter entre 150-200 palavras
      - Estar em português brasileiro
      - Usar um tom inspirador e profissional
      
      Não mencione preços ou detalhes específicos de hospedagem.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API Gemini: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('Nenhuma resposta gerada pela IA');
      }
      
      const description = data.candidates[0].content.parts[0].text.trim();
      
      console.log('✅ Descrição gerada com sucesso');
      
      return description;
    } catch (error) {
      console.error('❌ Erro ao gerar descrição:', error);
      
      // Fallback: descrição básica sem IA
      const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const cityList = cities.map(city => city.name).join(", ");
      
      return `Embarque numa jornada inesquecível de ${duration} dias explorando ${cityList}. Esta viagem oferece uma experiência única combinando história, cultura e aventura, criando memórias que durarão para sempre.`;
    }
  },

  // 4. CRIAR CIDADE COMPLETA COM IA
  createCityWithAI: async (cityName, startDate, endDate) => {
    try {
      console.log(`🚀 Criando cidade completa com IA: ${cityName}`);
      
      // 1. Buscar informações da cidade
      const cityInfo = await aiService.getCityInfo(cityName);
      
      // 2. Buscar informações do clima
      const weatherInfo = await aiService.getWeatherInfo(
        cityInfo.coordinates.lat, 
        cityInfo.coordinates.lng, 
        startDate
      );
      
      // 3. Criar informação climática formatada
      const weatherText = formatWeatherInfo(weatherInfo, startDate);
      
      const cityData = {
        id: `city-${Date.now()}`,
        name: cityInfo.name,
        country: cityInfo.country,
        countryCode: cityInfo.countryCode,
        coordinates: cityInfo.coordinates,
        startDate: startDate,
        endDate: endDate,
        aiDescription: `Explore ${cityInfo.name}, ${cityInfo.country} - uma cidade fascinante com rica história e cultura única.`,
        weatherInfo: weatherText,
        userNotes: ''
      };
      
      console.log(`✅ Cidade criada com sucesso: ${cityData.name}, ${cityData.country}`);
      
      return cityData;
    } catch (error) {
      console.error('❌ Erro ao criar cidade com IA:', error);
      throw error;
    }
  }
};

// FUNÇÕES AUXILIARES
function getSeason(month) {
  // Estações para hemisfério sul (Brasil)
  if (month >= 3 && month <= 5) return 'Outono';
  if (month >= 6 && month <= 8) return 'Inverno';  
  if (month >= 9 && month <= 11) return 'Primavera';
  return 'Verão';
}

function getClothingRecommendation(temp, season) {
  if (temp < 5) return '❄️ Muito frio - casacos pesados, luvas e gorros essenciais';
  if (temp < 15) return '🧥 Frio - vista-se em camadas, casaco e sapatos fechados';
  if (temp < 25) return '👕 Agradável - roupas leves com casaco para a noite';
  if (temp < 35) return '☀️ Quente - roupas leves, protetor solar e hidrate-se bem';
  return '🔥 Muito quente - roupas muito leves, proteção solar máxima';
}

function formatWeatherInfo(weatherInfo, startDate) {
  const month = new Date(startDate).toLocaleDateString('pt-BR', { month: 'long' });
  
  return `🌤️ Em ${month}: ${weatherInfo.description} com temperatura média de ${weatherInfo.currentTemp}°C. ${weatherInfo.recommendation}`;
}

// CONFIGURAÇÕES DE DEBUGGING
export const debugAI = {
  logEnabled: true,
  
  log: (message, data = null) => {
    if (debugAI.logEnabled) {
      console.log(`[AI Service] ${message}`, data || '');
    }
  },
  
  testConnection: async () => {
    try {
      console.log('🧪 Testando conexões das APIs...');
      
      // Teste OpenWeather
      const weatherTest = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${OPENWEATHER_API_KEY}`);
      console.log(`OpenWeather: ${weatherTest.ok ? '✅ OK' : '❌ Falhou'}`);
      
      // Teste Gemini
      const geminiTest = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }]
        })
      });
      console.log(`Gemini: ${geminiTest.ok ? '✅ OK' : '❌ Falhou'}`);
      
      return {
        openweather: weatherTest.ok,
        gemini: geminiTest.ok
      };
    } catch (error) {
      console.error('❌ Erro no teste de conexão:', error);
      return { openweather: false, gemini: false };
    }
  }
};

export default aiService;