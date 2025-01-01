export const productEndpoints = (builder) => ({
    upsertProducts: builder.mutation({
      query: ({formData, id, action, Urls}) => ({
        url: 'admin/upsertProducts',
        method: 'PUT',
        body: {formData, id, action, Urls},
        credentials: 'include',
      }),
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: 'admin/uploadImages',
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
        credentials: 'include',
      }),
    }),
    getProducts: builder.mutation({
      query: () => ({
        url: 'admin/getProducts',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateProduct: builder.mutation({
      query: ({uniqeID, updateBool, action}) => ({
        url: 'admin/updateProduct',
        method: 'PATCH',
        body: {uniqeID, updateBool, action},
        credentials: 'include',
      }),
    }),

    cancelOrder: builder.mutation({
      query: (cancelId) => ({
        url: `admin/cancelOrder`,
        method: 'POST',
        body:{ cancelId },
        credentials: 'include',
      }),
    }),

    updateOffer: builder.mutation({
      query: (offerData) => ({
        url: `admin/updateOffer`,
        method: 'PATCH',
        body: offerData,
        credentials: 'include',
      }),
    }),

    getAllDiscounts: builder.mutation({
      query: () => ({
        url: `admin/getAllDiscounts`,
        method: 'GET',
        // body: offerData,
        credentials: 'include',
      }),
    }),


  });
  