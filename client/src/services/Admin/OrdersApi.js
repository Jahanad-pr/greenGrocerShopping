export const orderEndpoints = (builder) => ({

    getAllOrders: builder.mutation({
        query: () => ({
            url: 'admin/getAllOrders',
            method: 'GET',
            credentials: 'include',
        }),
    }),

    getChartsDetails: builder.mutation({
        query: (filterby) => ({
            url: `admin/getChartsDetails?${filterby}`,
            method: 'GET',
            credentials: 'include',
        }),
    }),

    updateOrderStatus: builder.mutation({
        query: (statusData) => ({
            url: `admin/updateOrderStatus`,
            method: 'POST',
            body: statusData,
            credentials: 'include',
        }),
    }),


});
