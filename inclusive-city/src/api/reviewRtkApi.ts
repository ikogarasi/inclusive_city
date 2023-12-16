import { createApi } from "@reduxjs/toolkit/query/react";
import { reviewClient } from "../app/clients";
import { Review, ReviewDto } from "../app/api/reviewApi";

export const reviewRtkApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Review"],
  endpoints: (build) => ({
    getReviewsForStructure: build.query<Review[], string>({
      queryFn: async (structureId: string) => {
        return { data: await reviewClient.getReviewsForStructure(structureId) };
      },
      providesTags: ["Review"],
    }),
    submitReview: build.mutation<Review, ReviewDto>({
      queryFn: async (dto: ReviewDto) => {
        return { data: await reviewClient.submitReview(dto) };
      },
      invalidatesTags: ["Review"],
    }),
    removeReview: build.mutation<void, string>({
      queryFn: async (reviewId: string) => {
        return { data: await reviewClient.removeReview(reviewId) };
      },
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetReviewsForStructureQuery,
  useSubmitReviewMutation,
  useRemoveReviewMutation,
} = reviewRtkApi;

export default reviewRtkApi;
