import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ReviewDto,
  AddReviewCommand,
  OsrmRouteDto,
  GetStructuresDto,
  UploadStructureImagesCommand,
  FileResponse,
} from "../app/api/overpassobjectApi"; // Adjust import path as needed
import { overpassReviewClient, overpassStructureClient } from "../app/clients";

// Review API Query Parameters
export interface GetObjectReviewsQueryParams {
  osmId: number;
}

export interface GetUsersReviewsQueryParams {
  userId: string;
}

export interface DeleteReviewMutationParams {
  reviewId: number;
}

// Routing API Query Parameters
export interface GetComputedRouteQueryParams {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}

// Structure API Query Parameters
export interface GetStructuresQueryParams {
  latitude: number;
  longitude: number;
  around: number;
  amenity?: string;
  isWheelChair?: boolean;
  shouldRetrieveRating?: boolean;
  shouldRetrieveReviews?: boolean;
  shouldGetImages?: boolean;
}

// Review RTK API
export const reviewRtkApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Review"],
  endpoints: (build) => ({
    getObjectReviews: build.query<ReviewDto[], GetObjectReviewsQueryParams>({
      queryFn: async (params: GetObjectReviewsQueryParams) => {
        return {
          data: await overpassReviewClient.getObjectReviews(params.osmId),
        };
      },
      providesTags: ["Review"],
    }),
    getUsersReviews: build.query<ReviewDto[], GetUsersReviewsQueryParams>({
      queryFn: async (params: GetUsersReviewsQueryParams) => {
        return {
          data: await overpassReviewClient.getUsersReviews(params.userId),
        };
      },
      providesTags: ["Review"],
    }),
    addReview: build.mutation<FileResponse, AddReviewCommand>({
      queryFn: async (command: AddReviewCommand) => {
        return {
          data: await overpassReviewClient.addReview(command),
        };
      },
      invalidatesTags: ["Review"],
    }),
    deleteReview: build.mutation<FileResponse, DeleteReviewMutationParams>({
      queryFn: async (params: DeleteReviewMutationParams) => {
        return {
          data: await overpassReviewClient.deleteReview(params.reviewId),
        };
      },
      invalidatesTags: ["Review"],
    }),
  }),
});



// Structure RTK API (updated version)
export const structureRtkApi = createApi({
  reducerPath: "structureApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Structure"],
  endpoints: (build) => ({
    getStructures: build.query<GetStructuresDto, GetStructuresQueryParams>({
      queryFn: async (params: GetStructuresQueryParams) => {
        return {
          data: await overpassStructureClient.getStructures(
            params.latitude,
            params.longitude,
            params.around,
            params.amenity,
            params.isWheelChair,
            params.shouldRetrieveRating,
            params.shouldRetrieveReviews,
            params.shouldGetImages
          ),
        };
      },
      providesTags: ["Structure"],
    }),
    uploadImages: build.mutation<FileResponse, UploadStructureImagesCommand>({
      queryFn: async (command: UploadStructureImagesCommand) => {
        return {
          data: await overpassStructureClient.uploadImages(command),
        };
      },
      invalidatesTags: ["Structure"],
    }),
  }),
});

// Export hooks for Review API
export const {
  useGetObjectReviewsQuery,
  useGetUsersReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = reviewRtkApi;



// Export hooks for Structure API
export const {
  useGetStructuresQuery,
  useUploadImagesMutation,
} = structureRtkApi;

export default {reviewRtkApi, structureRtkApi};