import { createApi } from "@reduxjs/toolkit/query/react";
import {
  Category,
  GetStructureDto,
  StructureDto,
} from "../app/api/structureApi";
import { categoryClient, structureClient } from "../app/clients";

export interface GetAllStructuresQueryParams {
  latitude: number;
  longitude: number;
  count: number;
  category: string | null;
}

export interface GetStructureQueryParams {
  id: string;
  latitude: number;
  longitude: number;
}

export const structureRtkApi = createApi({
  reducerPath: "structureApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Structure", "Category"],
  endpoints: (build) => ({
    getAllStructures: build.query<
      GetStructureDto[],
      GetAllStructuresQueryParams
    >({
      queryFn: async (params: GetAllStructuresQueryParams) => {
        return {
          data: await structureClient.getAllStructures(
            params.latitude,
            params.longitude,
            params.count,
            params.category
          ),
        };
      },
      providesTags: ["Structure"],
    }),
    getStructure: build.query<GetStructureDto, GetStructureQueryParams>({
      queryFn: async (params: GetStructureQueryParams) => {
        return {
          data: await structureClient.getStructure(
            params.id,
            params.latitude,
            params.longitude
          ),
        };
      },
      providesTags: ["Structure"],
    }),
    createStructure: build.mutation<GetStructureDto, StructureDto>({
      queryFn: async (dto: StructureDto) => {
        return {
          data: await structureClient.createStructure(dto),
        };
      },
      invalidatesTags: ["Structure"],
    }),
    updateStructure: build.mutation<GetStructureDto, StructureDto>({
      queryFn: async (dto: StructureDto) => {
        return {
          data: await structureClient.updateStructure(dto),
        };
      },
      invalidatesTags: ["Structure"],
    }),
    deleteStructure: build.query<void, string>({
      queryFn: async (id: string) => {
        return {
          data: await structureClient.deleteStructure(id),
        };
      },
      providesTags: ["Structure"],
    }),
    getAllCategories: build.query<Category[], void>({
      queryFn: async () => {
        return {
          data: await categoryClient.get(),
        };
      },
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useCreateStructureMutation,
  useDeleteStructureQuery,
  useGetAllCategoriesQuery,
  useGetAllStructuresQuery,
  useGetStructureQuery,
  useUpdateStructureMutation,
} = structureRtkApi;

export default structureRtkApi;
