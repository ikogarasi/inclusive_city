import { UserClient } from "./api/authApi";
import { AnswerClient, QuestionClient } from "./api/questionApi";
import { ReviewClient } from "./api/reviewApi";
import { CategoryClient, StructureClient } from "./api/structureApi";

const httpURL = 'http://localhost:5294/c';

export const userClient = new UserClient(httpURL);
export const reviewClient = new ReviewClient(httpURL);
export const structureClient = new StructureClient(httpURL);
export const categoryClient = new CategoryClient(httpURL);
export const questionClient = new QuestionClient(httpURL);
export const answerClient = new AnswerClient(httpURL);

