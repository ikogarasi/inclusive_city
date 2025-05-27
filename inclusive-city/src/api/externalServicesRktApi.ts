import { createApi } from "@reduxjs/toolkit/query/react";
import {
  ReviewDto,
  AddReviewCommand,
  GetStructuresDto,
  UploadStructureImagesCommand,
  FileResponse,
  ElementDto,
} from "../app/api/externalServicesApi"; // Adjust import path as needed
import {
  osrmClient,
  overpassReviewClient,
  overpassStructureClient,
} from "../app/clients";
import { OsrmRouteDto } from "../app/api/externalServicesApi"; // Make sure OsrmRouteDto is imported

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
  name?: string;
  isWheelChair?: boolean;
  shouldRetrieveRating?: boolean;
  shouldRetrieveReviews?: boolean;
  shouldGetImages?: boolean;
}

export interface GetComputedRouteQueryParams {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}

export interface GetInclusiveInfrastructureQueryParams {
  latitude: number;
  longitude: number;
  around: number;
  toilets?: boolean;
  busStops?: boolean;
  kerbs?: boolean;
  tactilePaving?: boolean;
  ramps?: boolean;
  shouldRetrieveRating?: boolean;
  shouldRetrieveReviews?: boolean;
  shouldGetImages?: boolean;
}

// Review RTK API
export const reviewRtkApi = createApi({
  reducerPath: "overpassReviewApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["OverpassReview"],
  endpoints: (build) => ({
    getObjectReviews: build.query<ReviewDto[], GetObjectReviewsQueryParams>({
      queryFn: async (params: GetObjectReviewsQueryParams) => {
        return {
          data: await overpassReviewClient.getObjectReviews(params.osmId),
        };
      },
      providesTags: ["OverpassReview"],
    }),
    addReview: build.mutation<FileResponse, AddReviewCommand>({
      queryFn: async (command: AddReviewCommand) => {
        return {
          data: await overpassReviewClient.addReview(command),
        };
      },
      invalidatesTags: ["OverpassReview"],
    }),
    deleteReview: build.mutation<FileResponse, DeleteReviewMutationParams>({
      queryFn: async (params: DeleteReviewMutationParams) => {
        return {
          data: await overpassReviewClient.deleteReview(params.reviewId),
        };
      },
      invalidatesTags: ["OverpassReview"],
    }),
  }),
});

// Structure RTK API (updated version)
export const structureRtkApi = createApi({
  reducerPath: "overpassStructureApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["OverpassStructure"],
  endpoints: (build) => ({
    getStructures: build.query<GetStructuresDto, GetStructuresQueryParams>({
      queryFn: async (params: GetStructuresQueryParams) => {
        return {
          data: await overpassStructureClient.getStructures(
            params.latitude,
            params.longitude,
            params.around,
            params.amenity,
            params.name,
            params.isWheelChair,
            params.shouldRetrieveRating,
            params.shouldRetrieveReviews,
            params.shouldGetImages
          ),
        };
      },
      providesTags: ["OverpassStructure"],
    }),
    getStructureById: build.query<
      ElementDto,
      {
        osmId: number;
        type: string;
        shouldRetrieveRating?: boolean;
        shouldRetrieveReviews?: boolean;
        shouldGetImages?: boolean;
      }
    >({
      queryFn: async (params) => {
        return {
          data: await overpassStructureClient.getStructureById(
            params.osmId,
            params.type,
            params.shouldRetrieveRating,
            params.shouldRetrieveReviews,
            params.shouldGetImages
          ),
        };
      },
      providesTags: ["OverpassStructure"],
    }),
    uploadImages: build.mutation<FileResponse, UploadStructureImagesCommand>({
      queryFn: async (command: UploadStructureImagesCommand) => {
        return {
          data: await overpassStructureClient.uploadImages(command),
        };
      },
      invalidatesTags: ["OverpassStructure"],
    }),
    getInclusiveInfrastructure: build.query<
      GetStructuresDto,
      GetInclusiveInfrastructureQueryParams
    >({
      queryFn: async (params: GetInclusiveInfrastructureQueryParams) => {
        return {
          data: await overpassStructureClient.getInclusiveInfrastructure(
            params.latitude,
            params.longitude,
            params.around,
            params.toilets,
            params.busStops,
            params.kerbs,
            params.tactilePaving,
            params.ramps,
            params.shouldRetrieveRating,
            params.shouldRetrieveReviews,
            params.shouldGetImages
          ),
        };
      },
      providesTags: ["OverpassStructure"],
    }),
  }),
});

export const routingRtkApi = createApi({
  reducerPath: "routingApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Routing"],
  endpoints: (build) => ({
    getComputedRoute: build.query<OsrmRouteDto, GetComputedRouteQueryParams>({
      queryFn: async (params: GetComputedRouteQueryParams) => {
        return {
          data: await osrmClient.getComputedRoute(
            params.originLatitude,
            params.originLongitude,
            params.destinationLatitude,
            params.destinationLongitude
          ),
        };
      },
      providesTags: ["Routing"],
    }),
  }),
});

// Export hooks for Review API
export const {
  useGetObjectReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} = reviewRtkApi;

// Export hooks for Structure API
export const {
  useGetStructuresQuery,
  useGetStructureByIdQuery,
  useUploadImagesMutation,
  useGetInclusiveInfrastructureQuery,
} = structureRtkApi;

export const { useGetComputedRouteQuery } = routingRtkApi;

export default { reviewRtkApi, structureRtkApi, routingRtkApi };
