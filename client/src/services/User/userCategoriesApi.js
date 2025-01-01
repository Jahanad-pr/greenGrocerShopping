// src/services/userApi/userCategoriesApi.js
export const userCategoriesApi = (builder) => ({
    getCategories: builder.mutation({
      query: () => ({
        url: 'user/getCategories',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  });
  