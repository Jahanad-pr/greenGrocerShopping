export const categoryEndpoints = (builder) => ({
    upsertCategory: builder.mutation({
      query: (upsertData) => ({
        url: 'admin/upsertCategory',
        method: 'PUT',
        body: upsertData,
        credentials: 'include',
      }),
    }),
    getCategories: builder.mutation({
      query: () => ({
        url: 'admin/getCategories',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateCategory: builder.mutation({
      query: ({uniqeID, updateBool, action}) => ({
        url: 'admin/updateCategoryAccess',
        method: 'PATCH',
        body: {uniqeID, updateBool, action},
        credentials: 'include',
      }),
    }),
  });
  