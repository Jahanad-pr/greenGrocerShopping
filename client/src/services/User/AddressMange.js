// src/services/userApi/userProductsApi.js
export const AdressMangeApi = (builder) => ({
    upsertAddress: builder.mutation({
      query: (upsertData) => ({
        url: `user/upsertAddress`,
        method: 'POST',
        body: upsertData,
        credentials: 'include', }),
    }),

    getAdresses: builder.mutation({
      query: (id) => ({
        url: `user/getAdresses/${id}`,
        method: 'GET',
        credentials: 'include', }),
    }),

    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `user/deleteAddress/${id}`,
        method: 'DELETE',
        credentials: 'include', }),
    }),
  
   

  });
  