import { NavigateFunction } from "react-router-dom";
import { 
  detectRouteIntent, 
  navigateToMapPage, 
  InclusivePlace 
} from "../overpassService";
import { buildRoute } from "../api/utils/way";

export interface RouteHandlerContext {
  updateHistory: (text: string, isError?: boolean) => void;
  navigate: NavigateFunction;
  setPolyline: (polylines: L.LatLngExpression[]) => void;
  lastFoundPlaces: InclusivePlace[];
  setLastFoundPlaces: (places: InclusivePlace[]) => void;
}

export class RouteHandler {
  private static readonly ROUTE_KEYWORDS = [
    "маршрут",
    "шлях",
    "прокласти",
    "проклади",
    "як дійти",
    "як пройти",
    "як доїхати",
    "як добратися",
    "дорога до",
    "провести до",
    "покажи дорогу",
    "побудуй",
  ];

  private static readonly DEFAULT_COORDINATES = {
    lat: 49.84309611110559, // Львів за замовчуванням
    lon: 24.030603315948206,
  };

  static isRouteRequest(userMessage: string): boolean {
    return this.ROUTE_KEYWORDS.some((keyword) =>
      userMessage.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  static async processRouteRequest(
    userMessage: string, 
    context: RouteHandlerContext
  ): Promise<void> {
    // Отримуємо актуальні дані про місця з sessionStorage
    let placesToUse = [...context.lastFoundPlaces];

    const storedInclusivePlaces = sessionStorage.getItem("inclusivePlaces");
    if (storedInclusivePlaces) {
      try {
        const parsedPlaces = JSON.parse(storedInclusivePlaces);
        placesToUse = parsedPlaces;
        context.setLastFoundPlaces(parsedPlaces);
        console.log("Завантажено місць із sessionStorage:", parsedPlaces.length);
      } catch (error) {
        console.error("Error parsing inclusivePlaces from sessionStorage:", error);
      }
    }

    // Перевіряємо, чи є у нас дані про місця
    if (placesToUse.length === 0) {
      context.updateHistory(
        "Спочатку потрібно знайти інклюзивні місця. Спробуйте задати запит про пошук доступних місць."
      );
      return;
    }

    console.log("Виявлено запит на маршрут:", userMessage);
    console.log(
      "Доступні місця:",
      placesToUse.map((p) => p.tags?.name || p.address)
    );

    try {
      const targetPlace = await detectRouteIntent(userMessage, placesToUse);
      console.log("Цільове місце:", targetPlace);

      if (targetPlace && targetPlace !== "Немає маршруту") {
        const matchedPlace = this.findMatchingPlace(targetPlace, placesToUse);

        if (matchedPlace && matchedPlace.lat && matchedPlace.lon) {
          await this.buildAndDisplayRoute(matchedPlace, context, placesToUse);
        } else {
          context.updateHistory(
            "Не вдалося знайти вказане місце серед знайдених раніше інклюзивних місць. Спробуйте уточнити назву, вказавши адресу"
          );
        }
      } else {
        context.updateHistory(
          "Не вдалося визначити до якого місця ви хочете прокласти маршрут. Будь ласка, вкажіть назву або адресу місця точніше."
        );
      }
    } catch (error) {
      console.error("Помилка при побудові маршруту:", error);
      context.updateHistory(
        "На жаль, сталася помилка при побудові маршруту. Спробуйте ще раз."
      );
    }
  }

  private static findMatchingPlace(
    targetPlace: string, 
    places: InclusivePlace[]
  ): InclusivePlace | undefined {
    return places.find((p) => {
      const nameMatch =
        p.tags?.name &&
        (targetPlace.toLowerCase().includes(p.tags.name.toLowerCase()) ||
          p.tags.name.toLowerCase().includes(targetPlace.toLowerCase()));

      const addressMatch =
        p.address &&
        (targetPlace.toLowerCase().includes(p.address.toLowerCase()) ||
          p.address.toLowerCase().includes(targetPlace.toLowerCase()));

      return nameMatch || addressMatch;
    });
  }

  private static async buildAndDisplayRoute(
    matchedPlace: InclusivePlace,
    context: RouteHandlerContext,
    placesToUse: InclusivePlace[]
  ): Promise<void> {
    context.updateHistory(
      `Будую маршрут до "${matchedPlace.tags?.name || matchedPlace.address}"...`
    );

    let startCoordinates = { ...this.DEFAULT_COORDINATES };

    try {
      const position = await this.getCurrentPosition();
      startCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
    } catch (locError) {
      console.warn("Не вдалося отримати геолокацію для маршруту:", locError);
      context.updateHistory(
        "Не вдалося визначити ваше місцезнаходження. Використовую координати Львова за замовчуванням."
      );
    }

    console.log(
      `Будую маршрут від [${startCoordinates.lat}, ${startCoordinates.lon}] до [${matchedPlace.lat}, ${matchedPlace.lon}]`
    );

    const route = await buildRoute(
      matchedPlace.lat!,
      matchedPlace.lon!,
      startCoordinates.lat,
      startCoordinates.lon
    );

    // Зберігаємо координати користувача в sessionStorage
    sessionStorage.setItem("userCoordinates", JSON.stringify(startCoordinates));

    // Зберігаємо маршрут і перенаправляємо на карту
    context.setPolyline(route);
    sessionStorage.setItem("routeData", JSON.stringify(route));
    navigateToMapPage(placesToUse, context.navigate);

    context.updateHistory(
      `Ось маршрут до ${matchedPlace.tags?.name || matchedPlace.address}.`
    );
  }

  private static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }
}