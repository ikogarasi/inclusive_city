import { createApi } from "@reduxjs/toolkit/query/react";
import {
  AnswerDto,
  Question,
  QuestionDto,
  Topic,
} from "../app/api/questionApi";
import { answerClient, questionClient } from "../app/clients";

export const questionsRtkApi = createApi({
  reducerPath: "questionsApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Answer", "Question"],
  endpoints: (build) => ({
    getAllQuestionsForAdmin: build.query<
      Topic[],
      { userId?: string; pending?: boolean }
    >({
      queryFn: async (dto: { userId?: string; pending?: boolean }) => {
        return {
          data: await answerClient.getAllQuestions(dto.userId, dto.pending),
        };
      },
      providesTags: ["Answer"],
    }),
    answerQuestion: build.mutation<Topic, AnswerDto>({
      queryFn: async (dto: AnswerDto) => {
        return { data: await answerClient.answerQuestion(dto) };
      },
      invalidatesTags: ["Answer"],
    }),
    getAllQuestionsForUser: build.query<Topic[], boolean | undefined>({
      queryFn: async (pending?: boolean) => {
        return { data: await questionClient.getAllQuestions(pending) };
      },
      providesTags: ["Question"],
    }),
    submitQuestion: build.mutation<Question, QuestionDto>({
      queryFn: async (dto: QuestionDto) => {
        return { data: await questionClient.submitQuestion(dto) };
      },
      invalidatesTags: ["Question"],
    }),
  }),
});

export const {
  useGetAllQuestionsForAdminQuery,
  useAnswerQuestionMutation,
  useGetAllQuestionsForUserQuery,
  useSubmitQuestionMutation,
} = questionsRtkApi;

export default questionsRtkApi;
