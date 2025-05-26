import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import authRtkApi from "../api/authRtkApi";
import questionsRtkApi from "../api/quesionsRtkApi";
import reviewRtkApi from "../api/reviewRtkApi";
import structureRtkApi from "../api/structureRtkApi";
import userSlice from "../api/userSlice";
import externalServicesRktApi from "../api/externalServicesRktApi";

export const store = configureStore({
  reducer: {
    [authRtkApi.reducerPath]: authRtkApi.reducer,
    [questionsRtkApi.reducerPath]: questionsRtkApi.reducer,
    [reviewRtkApi.reducerPath]: reviewRtkApi.reducer,
    [structureRtkApi.reducerPath]: structureRtkApi.reducer,
    [externalServicesRktApi.reviewRtkApi.reducerPath]:
      externalServicesRktApi.reviewRtkApi.reducer,
    [externalServicesRktApi.structureRtkApi.reducerPath]:
      externalServicesRktApi.structureRtkApi.reducer,
    [externalServicesRktApi.routingRtkApi.reducerPath]:
      externalServicesRktApi.routingRtkApi.reducer,
    user: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authRtkApi.middleware)
      .concat(questionsRtkApi.middleware)
      .concat(reviewRtkApi.middleware)
      .concat(structureRtkApi.middleware)
      .concat(externalServicesRktApi.reviewRtkApi.middleware)
      .concat(externalServicesRktApi.structureRtkApi.middleware)
      .concat(externalServicesRktApi.routingRtkApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
