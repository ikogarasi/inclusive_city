import { UserClient } from "./api/authApi";
import { AnswerClient, QuestionClient } from "./api/questionApi";
import { ReviewClient } from "./api/reviewApi";
import { CategoryClient, StructureClient } from "./api/structureApi";
import {
  ReviewClient as OverpassReviewClient,
  StructureClient as OverpassStructureClient,
  RoutingClient,
} from "./api/externalServicesApi";

const httpURL = "https://localhost:7289/c";

const httpURL1 = "https://localhost:7171";

export const userClient = new UserClient(httpURL);
export const reviewClient = new ReviewClient(httpURL);
export const structureClient = new StructureClient(httpURL);
export const categoryClient = new CategoryClient(httpURL);
export const questionClient = new QuestionClient(httpURL);
export const answerClient = new AnswerClient(httpURL);
export const overpassReviewClient = new OverpassReviewClient(httpURL1);
export const overpassStructureClient = new OverpassStructureClient(httpURL1);
export const osrmClient = new RoutingClient(httpURL1);
