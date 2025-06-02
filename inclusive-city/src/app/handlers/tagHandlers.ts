import { NavigateFunction } from "react-router-dom";
import { InclusivePlace } from "../overpassService";

export interface TagHandlerContext {
  updateHistory: (text: string, isError?: boolean) => void;
  navigate: NavigateFunction;
  userData: any;
  handleQuestionSubmission: (questionText: string) => Promise<boolean>;
  handleReviewSubmission: (reviewData: any) => Promise<boolean>;
  description: string;
  rate: number;
  setDescription: (desc: string) => void;
  setRate: (rate: number) => void;
  availableStructures: InclusivePlace[];
}

export class NavigationTagHandler {
  static async handle(navigationTag: RegExpMatchArray, context: TagHandlerContext) {
    const path = navigationTag[1].trim();

    // Перевірка авторизації для сторінки /message
    if (path === "/message") {
      if (context.userData.userData.role !== "User") {
        context.updateHistory(
          "Для того, щоб задати питання або написати зауваження необхідно зареєструватися чи увійти у свій профіль на нашому сайті)"
        );
        return;
      }
    }

    context.updateHistory(`Переходжу на сторінку: ${path}...`);

    setTimeout(() => {
      context.navigate(path);
    }, 1000);
  }
}

export class QuestionTagHandler {
  static async handle(questionTag: RegExpMatchArray, context: TagHandlerContext) {
    const questionText = questionTag[1].trim();

    // Перевірка авторизації
    if (context.userData.userData.role !== "User") {
      context.updateHistory(
        "Для того, щоб надіслати питання, необхідно зареєструватися чи увійти у свій профіль на нашому сайті."
      );
      return;
    }

    context.updateHistory("Надсилаю ваше питання адміністрації...");

    try {
      const success = await context.handleQuestionSubmission(questionText);

      if (success) {
        context.updateHistory(
          "Ваше питання успішно надіслано! Адміністрація розгляне його та спробує відповісти якнайшвидше (зазвичай протягом 24 годин)."
        );
      } else {
        context.updateHistory(
          "На жаль, сталася помилка при надсиланні питання. Спробуйте ще раз або скористайтеся формою на сторінці 'Запитання та відповіді'."
        );
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      context.updateHistory(
        "На жаль, сталася помилка при надсиланні питання. Спробуйте ще раз або скористайтеся формою на сторінці 'Запитання та відповіді'."
      );
    }
  }
}

export class ReviewTagHandler {
  static async handle(reviewTag: RegExpMatchArray, context: TagHandlerContext) {
    const reviewData = reviewTag[1].trim();

    // Перевірка авторизації
    if (context.userData.userData.role !== "User") {
      context.updateHistory("Для залишення відгуку потрібно увійти в акаунт.");
      return;
    }

    // Перевірка, чи знаходимося на сторінці структури
    const currentPath = window.location.pathname;
    const structurePageMatch = currentPath.match(/\/info\/(\w+)\/(\d+)/);

    if (!structurePageMatch) {
      context.updateHistory(
        "Спочатку відкрийте сторінку місця, щоб залишити відгук."
      );
      return;
    }

    // Парсинг даних відгуку
    const parts = reviewData.split("|");
    if (parts.length < 2) {
      context.updateHistory(
        "Неправильний формат відгуку. Вкажіть оцінку (1-5) та опис."
      );
      return;
    }

    const rating = parseInt(parts[0]);
    const descriptions = parts.slice(1).join("|");

    if (isNaN(rating) || rating < 1 || rating > 5) {
      context.updateHistory("Оцінка повинна бути числом від 1 до 5.");
      return;
    }

    context.setDescription(descriptions);
    context.setRate(rating);

    context.updateHistory(
      `Ви залишаєте відгук з оцінкою ${rating}/5 і текстом: "${descriptions}"? Напишіть "Так" або "Підтверджую", щоб надіслати.`
    );

    const [, structureType, structureId] = structurePageMatch;

    try {
      const success = await context.handleReviewSubmission({
        osmId: parseInt(structureId),
        osmType: structureType,
        username: context.userData.userData.userName,
        imageBase64: "",
        createdBy: context.userData.userData.userId,
        comment: descriptions,
        rate: rating,
      });

      if (success) {
        context.updateHistory(
          `Ваш відгук з оцінкою ${rating}/5 успішно надіслано. Дякуємо!`
        );
      } else {
        context.updateHistory(
          "Сталася помилка при надсиланні. Спробуйте пізніше."
        );
      }
    } catch (err) {
      console.error("Review error:", err);
      context.updateHistory("Не вдалося надіслати відгук. Спробуйте пізніше.");
    }
  }
}

export class StructureNavigationTagHandler {
  static async handle(structureNavigationTag: RegExpMatchArray, context: TagHandlerContext) {
    const structureIdentifier = structureNavigationTag[1].trim();

    console.log("Structure navigation request:", structureIdentifier);
    console.log("Available structures:", context.availableStructures.length);

    if (context.availableStructures.length === 0) {
      context.updateHistory(
        "Спочатку потрібно знайти місця через пошук. Спробуйте задати запит про пошук доступних місць або конкретних об'єктів."
      );
      return;
    }

    // Пошук структури за ідентифікатором
    const searchTerm = structureIdentifier.toLowerCase();
    const foundStructure = context.availableStructures.find((structure) => {
      const name = structure.tags?.name?.toLowerCase() || "";
      const amenity = structure.tags?.amenity?.toLowerCase() || "";
      const address = structure.address?.toLowerCase() || "";

      return (
        name.includes(searchTerm) ||
        searchTerm.includes(name) ||
        amenity.includes(searchTerm) ||
        searchTerm.includes(amenity) ||
        address.includes(searchTerm) ||
        searchTerm.includes(address)
      );
    });

    if (foundStructure) {
      const structureName =
        foundStructure.tags?.name ||
        foundStructure.tags?.amenity ||
        "об'єкт";
      const structureType = foundStructure.type || "node";
      const structureId = foundStructure.id;

      context.updateHistory(
        `Переходжу на сторінку "${structureName}" з детальною інформацією...`
      );

      setTimeout(() => {
        context.navigate(`/info/${structureType}/${structureId}`);
      }, 1000);
    } else {
      // Показуємо список доступних структур
      const structuresList = context.availableStructures
        .filter((s) => s.tags?.name || s.tags?.amenity)
        .slice(0, 5)
        .map(
          (s, index) => `${index + 1}. ${s.tags?.name || s.tags?.amenity}`
        )
        .join("\n");

      context.updateHistory(
        `Не вдалося знайти структуру "${structureIdentifier}". Ось декілька доступних варіантів:\n\n${structuresList}\n\nСпробуйте уточнити назву або спочатку виконайте пошук місць.`
      );
    }
  }
}