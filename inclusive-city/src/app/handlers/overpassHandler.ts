import { NavigateFunction } from "react-router-dom";
import { 
  findInclusivePlaces, 
  navigateToMapPage, 
  InclusivePlace 
} from "../overpassService";

export interface OverpassHandlerContext {
  updateHistory: (text: string, isError?: boolean) => void;
  navigate: NavigateFunction;
  setLastFoundPlaces: (places: InclusivePlace[]) => void;
}

export class OverpassHandler {
  private static readonly DEFAULT_COORDINATES = {
    lat: 49.84309611110559, // Львів за замовчуванням
    lon: 24.030603315948206,
  };

  static async processOverpassQuery(
    overpassQueryMatch: RegExpMatchArray,
    context: OverpassHandlerContext
  ): Promise<void> {
    let overpassQuery = overpassQueryMatch[0].trim();

    // Показуємо користувачеві, що виконуємо пошук
    context.updateHistory("Я шукаю інклюзивні місця за вашим запитом...");

    try {
      const coordinates = await this.getCoordinatesForQuery(overpassQuery, context);
      
      if (this.needsGeolocation(overpassQuery)) {
        overpassQuery = this.injectCoordinates(overpassQuery, coordinates);
      }

      console.log("Підготовлений Overpass запит:", overpassQuery);

      const inclusivePlaces = await findInclusivePlaces(overpassQuery);
      context.setLastFoundPlaces(inclusivePlaces);
      
      console.log("Знайдено інклюзивних місць:", inclusivePlaces.length);

      if (inclusivePlaces.length > 0) {
        await this.handleSuccessfulSearch(inclusivePlaces, coordinates, context);
      } else {
        context.updateHistory(
          "На жаль, я не знайшов інклюзивних місць, які відповідають вашому запиту."
        );
      }
    } catch (error) {
      console.error("Error processing Overpass query:", error);
      const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      context.updateHistory(`Виникла помилка при пошуку: ${errorMessage}`, true);
    }
  }

  private static needsGeolocation(query: string): boolean {
    return query.includes("LAT") && query.includes("LON");
  }

  private static async getCoordinatesForQuery(
    overpassQuery: string,
    context: OverpassHandlerContext
  ): Promise<{ lat: number; lon: number }> {
    if (!this.needsGeolocation(overpassQuery)) {
      return this.DEFAULT_COORDINATES;
    }

    context.updateHistory("Визначаю ваше місцезнаходження...");

    try {
      const position = await this.getCurrentPosition();
      const coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      console.log("Отримані координати:", coordinates);
      return coordinates;
    } catch (locError) {
      console.warn("Не вдалося отримати геолокацію:", locError);
      context.updateHistory(
        "Не вдалося визначити ваше місцезнаходження. Використовую координати Львова за замовчуванням."
      );
      return this.DEFAULT_COORDINATES;
    }
  }

  private static injectCoordinates(
    query: string, 
    coordinates: { lat: number; lon: number }
  ): string {
    return query
      .replace(/LAT/g, coordinates.lat.toString())
      .replace(/LON/g, coordinates.lon.toString());
  }

  private static async handleSuccessfulSearch(
    inclusivePlaces: InclusivePlace[],
    coordinates: { lat: number; lon: number },
    context: OverpassHandlerContext
  ): Promise<void> {
    // Формуємо відповідь з адресами
    let placesResponse = "Я знайшов наступні інклюзивні місця:\n\n";
    inclusivePlaces.forEach((place, index) => {
      placesResponse += `${index + 1}. ${place.address}\n`;
    });

    placesResponse += "\nЗараз я перенаправлю вас на карту з цими місцями...";

    // Оновлюємо історію чату
    context.updateHistory(placesResponse);

    // Зберігаємо координати користувача в sessionStorage
    sessionStorage.setItem("userCoordinates", JSON.stringify(coordinates));

    // Після невеликої затримки переходимо на сторінку карти
    setTimeout(() => {
      navigateToMapPage(inclusivePlaces, context.navigate);
    }, 2000);
  }

  private static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Геолокація не підтримується вашим браузером"));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }
}