interface OverpassElement {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  tags?: {
    [key: string]: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
  version?: number;
  generator?: string;
  osm3s?: {
    timestamp_osm_base: string;
    copyright: string;
  };
}

export interface InclusivePlace {
  id: number;
  type: string;
  address: string;
  lat?: number;
  lon?: number;
  tags: {
    [key: string]: string;
  };
}

// Функція для виконання запиту до Overpass API
export const queryOverpassAPI = async (query: string): Promise<OverpassResponse> => {
  const overpassUrl = 'https://overpass-api.de/api/interpreter?data=' + query;
  
  try {
    const response = await fetch(overpassUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.log(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error querying Overpass API:", error);
    throw error;
  }
};

// Функція для отримання адреси з даних місця
export const getAddressFromPlace = (place: OverpassElement): string => {
  const tags = place.tags || {};
  
  let address = "";
  
  // Збираємо компоненти адреси
  if (tags["addr:street"]) {
    address += tags["addr:street"];
    
    if (tags["addr:housenumber"]) {
      address += ", " + tags["addr:housenumber"];
    }
  }
  
  // Додаємо назву місця, якщо вона є
  if (tags.name) {
    if (address) {
      address = tags.name + " (" + address + ")";
    } else {
      address = tags.name;
    }
  }
  
  // Якщо адреса порожня, використовуємо координати
  if (!address && place.lat && place.lon) {
    address = `Місце за координатами: ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)}`;
  }
  
  return address || "Адреса не вказана";
};

// Функція для обробки результатів запиту і фільтрації інклюзивних місць
export const processOverpassResults = (data: OverpassResponse): InclusivePlace[] => {
  const elements = data.elements || [];
  
  // Фільтруємо тільки інклюзивні місця
  const inclusivePlaces = elements.filter(place => isInclusive(place));
  
  // Формуємо масив адрес
  return inclusivePlaces.map(place => ({
    id: place.id,
    type: place.type,
    address: getAddressFromPlace(place),
    lat: place.lat,
    lon: place.lon,
    tags: place.tags || {}
  }));
};

// Функція для переходу на існуючу сторінку з результатами
export const navigateToMapPage = (places: InclusivePlace[]): void => {
  // Збереження результатів у sessionStorage для доступу на іншій сторінці
  sessionStorage.setItem('inclusivePlaces', JSON.stringify(places));
  console.log(places)
  
  // Перехід на існуючу сторінку карти
  window.location.href = '/map'; 
};

// Функція для збереження координат інклюзивних місць
export const saveInclusivePlacesCoordinates = (places: InclusivePlace[]): void => {
  // Витягуємо тільки координати з місць
  const coordinates = places
    .filter(place => place.lat && place.lon)
    .map(place => ({
      id: place.id,
      lat: place.lat,
      lon: place.lon
    }));
  
  // Зберігаємо координати в sessionStorage
  sessionStorage.setItem('inclusiveCoordinates', JSON.stringify(coordinates));
};

// Функція для пошуку інклюзивних місць за Overpass запитом
export const findInclusivePlaces = async (overpassQuery: string): Promise<InclusivePlace[]> => {
  try {
    // Перевірка на наявність коректного запиту
    if (!overpassQuery.includes('[out:json]')) {
      overpassQuery = '[out:json]; ' + overpassQuery;
    }
    
    // Перевірка наявності команди "out"
    if (!overpassQuery.trim().endsWith('out;') && !overpassQuery.trim().endsWith('out center;')) {
      overpassQuery = overpassQuery.trim() + ' out center;';
    }
    
    console.log('Executing Overpass query:', overpassQuery);
    
    // Виконуємо запит до Overpass API
    const overpassResults = await queryOverpassAPI(overpassQuery);
    
    // Логуємо кількість отриманих результатів
    console.log(`Received ${overpassResults.elements?.length || 0} elements from Overpass`);
    
    // Якщо немає результатів, можливо варто розширити критерії пошуку
    if (!overpassResults.elements || overpassResults.elements.length === 0) {
      // Повертаємо порожній масив, оскільки немає місць для обробки
      return [];
    }
    
    // Обробляємо результати і фільтруємо інклюзивні місця
    const inclusivePlaces = processOverpassResults(overpassResults);
    
    console.log(`Found ${inclusivePlaces.length} inclusive places`);
    
    // Зберігаємо координати інклюзивних місць в sessionStorage
    saveInclusivePlacesCoordinates(inclusivePlaces);
    
    return inclusivePlaces;
    
  } catch (error) {
    console.error("Error finding inclusive places:", error);
    throw error;
  }
};

export const detectRouteIntent = async (userMessage: string, places: InclusivePlace[]): Promise<string> => {
  const prompt = `Список місць:\n${places.map((p, i) => `${i + 1}. ${p.tags.name || p.address}`).join('\n')}

Запит: "${userMessage}"

Якщо користувач хоче маршрут — поверни лише назву або адресу відповідного місця з цього списку. Інакше — "Немає маршруту".`;

  const response = await fetch(import.meta.env.VITE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "Немає маршруту";
};

// Покращена функція для перевірки чи є місце інклюзивним
export const isInclusive = (place: OverpassElement): boolean => {
  // Перевірка тегів, що вказують на інклюзивність
  const tags = place.tags || {};
  
  // Якщо місце явно позначено як неінклюзивне, повертаємо false
  if (tags["wheelchair"] === "no" || tags["wheelchair:access"] === "no") {
    return false;
  }
  
  // Перевірка на доступність для людей з обмеженими можливостями
  if (
    tags["wheelchair"] === "yes" || 
    tags["wheelchair:access"] === "yes" ||
    tags["wheelchair"] === "limited" ||
    tags["wheelchair:access"] === "limited"
  ) {
    return true;
  }
  
  
  return false;
};