import { InclusivePlace } from "../overpassService";

export class StructureUtils {
  static getAvailableStructures(
    lastFoundPlaces: InclusivePlace[],
    reduxStructures: any[]
  ): InclusivePlace[] {
    let availableStructures: InclusivePlace[] = [];

    // 1. inclusivePlaces з sessionStorage
    const storedInclusivePlaces = sessionStorage.getItem("inclusivePlaces");
    if (storedInclusivePlaces) {
      try {
        const parsed = JSON.parse(storedInclusivePlaces);
        if (Array.isArray(parsed)) {
          availableStructures = parsed;
        }
      } catch (error) {
        console.error("Error parsing inclusivePlaces:", error);
      }
    }

    // 2. Redux fallback
    if (availableStructures.length === 0 && reduxStructures?.length > 0) {
      availableStructures = [...reduxStructures];
    }

    // 3. Local fallback
    if (availableStructures.length === 0) {
      availableStructures = [...lastFoundPlaces];
    }

    return availableStructures;
  }

  static cleanApiResponse(apiResponseText: string): string {
    return apiResponseText
      .replace(/\[NAVIGATE:(.*?)\]/i, "")
      .replace(/\[SUBMIT_QUESTION:(.*?)\]/s, "")
      .replace(/\[NAVIGATE_STRUCTURE:(.*?)\]/i, "")
      .replace(/\[SUBMIT_REVIEW:(.*?)\]/s, "")
      .trim();
  }

  static extractTags(apiResponseText: string) {
    const navigationTag = apiResponseText.match(/\[NAVIGATE:(.*?)\]/i);
    const questionTag = apiResponseText.match(/\[SUBMIT_QUESTION:(.*?)\]/s);
    const structureNavigationTag = apiResponseText.match(/\[NAVIGATE_STRUCTURE:(.*?)\]/i);
    const reviewTag = apiResponseText.match(/\[SUBMIT_REVIEW:(.*?)\]/s);
    const overpassQueryMatch = apiResponseText.match(
      /(^|\n)\[out:json\];[\s\S]+?out center;/
    );

    return {
      navigationTag,
      questionTag,
      structureNavigationTag,
      reviewTag,
      overpassQueryMatch,
    };
  }
}