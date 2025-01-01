// src/services/userApi/userDetailsApi.js
export const userDetailsApi = (builder) => ({
    addDetails: builder.mutation({
      query: (userData) => ({
        url: 'user/addDetails',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),

    updateProfile: builder.mutation({
      query: (formData) => ({
        url: 'user/updateProfile',
        method: 'POST',
        body: formData,
        credentials: 'include',
      }),
    }),

    matchPassword: builder.mutation({
      query: (userData) => ({
        url: 'user/matchPassword',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),

    resetPassword: builder.mutation({
      query: (userData) => ({
        url: 'user/resetPassword',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),

  });
  