// src/services/userApi/userProductsApi.js
export const userProductsApi = (builder) => ({
    getCollections: builder.mutation({
      query: (id) => ({
        url: `user/getCollections/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  
    getCAtegoryProducts: builder.mutation({
      query: (id) => ({
        url: `user/getCAtegoryProducts/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getCAtegoryCollctiions: builder.mutation({
      query: (id) => ({
        url: `user/getCAtegoryCollctiions/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getCollectionProducts: builder.mutation({
      query: (id) => ({
        url: `user/getCollectionProducts/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getProductDetails: builder.mutation({
      query: (id) => ({
        url: `user/getProductDetails/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getAllProduct: builder.mutation({
      query: () => ({
        url: `user/getAllProduct`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    getFilteredProducts: builder.mutation({
      query: (filterParams) => ({
        url: 'user/getFilteredProducts',
        method: 'POST',
        body: filterParams
      })
    }),

    getAllCollection: builder.mutation({
      query: () => ({
        url: `user/getAllCollection`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    addToBookmark: builder.mutation({
      query: (bookmarkData) => ({
        url: `user/addToBookmark`,
        method: 'POST',
        body: bookmarkData,
        credentials: 'include',
      }),
    }),

    checkItemIntheBookmark: builder.mutation({
      query: (productId) => ({
        url: `user/checkItemIntheBookmark/${productId}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    removeBookmarkItme: builder.mutation({
      query: (productId) => ({
        url: `user/removeBookmarkItme/${productId}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),


    getBookmarkItems: builder.mutation({
      query: () => ({
        url: `user/getBookmarkItems`,
        method: 'GET',
        credentials: 'include',
      }),
    }),


  });
  