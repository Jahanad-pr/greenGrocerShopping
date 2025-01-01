export const collectionEndpoints = (builder) => ({
    upsertCollection: builder.mutation({
      query: (formData) => ({
        url: 'admin/upsertCollection',
        method: 'PUT',
        body: formData,
        credentials: 'include',
      }),
    }),
    getCollections: builder.mutation({
      query: () => ({
        url: 'admin/getCollections',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateCollection: builder.mutation({
      query: ({uniqeID, updateBool, action}) => ({
        url: 'admin/updateCollection',
        method: 'PATCH',
        body: {uniqeID, updateBool, action},
        credentials: 'include',
      }),
    }),
  });
  