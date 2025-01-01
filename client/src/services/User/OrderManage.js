// src/services/userApi/userCategoriesApi.js
export const userOrderApi = (builder) => ({

    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: 'user/placeOrder',
        method: 'POST',
        body:orderData,
        credentials: 'include',
      }),
    }),

    getOders: builder.mutation({
      query: (id) => ({
        url: `user/getOders/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    updateOrderStatus: builder.mutation({
      query: (statusData) => ({
        url: `user/updateOrderStatus`,
        method: 'PUT',
        body:statusData,
        credentials: 'include',
      }),
    }),

    cancelOrder: builder.mutation({
      query: (cancelId) => ({
        url: `user/cancelOrder`,
        method: 'POST',
        body:{ cancelId },
        credentials: 'include',
      }),
    }),

    returnOrder: builder.mutation({
      query: (cancelId) => ({
        url: `user/returnOrder`,
        method: 'POST',
        body:{ cancelId },
        credentials: 'include',
      }),
    }),

   
  });
  