// src/services/userApi/userAuthApi.js
export const userAuthApi = (builder) => ({
    signUp: builder.mutation({
      query: (userData) => ({
        url: 'user/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  
    login: builder.mutation({
      query: (userData) => ({
        url: 'user/login',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),
  
    googleLog: builder.mutation({
      query: (userData) => ({
        url: 'user/googleLog',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),
  
    getUser: builder.mutation({
      query: () => ({
        url: 'user/getUser',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  
    getOTP: builder.mutation({
      query: (email) => ({
        url: 'user/getOTP',
        method: 'POST',
        body: {mail:email},
        credentials: 'include',
      }),
    }),
  
    conformOTP: builder.mutation({
      query: ({ mail, otp }) => ({
        url: 'user/conformOTP',
        method: 'POST',
        body: { mail, otp },
        credentials: 'include',
      }),
    }),

    isUerExist: builder.mutation({
      query: (userData) => ({
        url: 'user/isUerExist',
        method: 'POST',
        body: userData,
        credentials: 'include',
      }),
    }),

    logoutUser: builder.mutation({
      query: (id) => ({
        url: 'user/logoutUser',
        method: 'POST',
        body: {id},
        credentials: 'include',
      }),
    }),

    addLocation: builder.mutation({
      query: (data) => ({
        url: 'user/addLocation',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),

  });
  