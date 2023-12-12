import { createApi } from "@reduxjs/toolkit/query/react";
import {
  LoginDto,
  TokenDto,
  UserForAdministrationDto,
  RegisterDto,
} from "../app/api/authApi";
import { userClient } from "../app/clients";

export const authRtkApi = createApi({
  reducerPath: "authApi",
  baseQuery: () => ({ data: {} }),
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    getUserForAdministration: build.query<UserForAdministrationDto[], void>({
      queryFn: async () => {
        return { data: await userClient.getUserForAdministration() };
      },
      providesTags: ["Auth"],
    }),
    register: build.mutation<void, RegisterDto>({
      queryFn: async (dto: RegisterDto) => {
        return { data: await userClient.register(dto) };
      },
      invalidatesTags: ["Auth"],
    }),

    login: build.mutation<TokenDto, LoginDto>({
      queryFn: async (dto: LoginDto) => {
        return { data: await userClient.login(dto) };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserForAdministrationQuery,
} = authRtkApi;

export default authRtkApi;
