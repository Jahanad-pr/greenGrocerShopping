export const customerEndpoints = (builder) => ({

    getCustomers: builder.mutation({
      query: () => ({
        url: 'admin/getCustomers',
        method: 'GET',
        credentials: 'include',
      }),
    }),

    updateUserAccess: builder.mutation({
      query: ({uniqeID, updateBool}) => ({
        url: 'admin/updateUserAccess',
        method: 'PATCH',
        body: {uniqeID, updateBool},
        credentials: 'include',
      }),
    }),


  });
  