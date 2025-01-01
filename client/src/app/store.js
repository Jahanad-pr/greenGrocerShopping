// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { adminApiSlice } from '../services/Admin/adminApi';
import { userApiSlice } from '../services/User/userApi';
import { salesApi } from '../services/Admin/salesApi';

export const store = configureStore({
  reducer: {
    [adminApiSlice.reducerPath]: adminApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [salesApi.reducerPath]: salesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(adminApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(salesApi.middleware),
});