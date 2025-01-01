export const authEndpoints = (builder) => ({
  signIn: builder.mutation({
    query: (credentials) => ({
      url: 'admin/login',
      method: 'POST',
      body: credentials,
      credentials: 'include',
    }),
  }),
  getAdmin: builder.mutation({
    query: () => ({
      url: 'admin/getAdmin',
      method: 'GET',
      credentials: 'include',
    }),
  }),

  logoutAdmin: builder.mutation({
      query: (id) => ({
        url: 'admin/logoutAdmin',
        method: 'POST',
        body: {id},
        credentials: 'include',
      }),
    }),

    getTopUsers: builder.mutation({
      query: () => ({
        url: 'admin/getTopUsers',
        method: 'GET',
        credentials: 'include',
      }),
    }),

});
