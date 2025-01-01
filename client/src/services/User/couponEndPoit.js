export const couponEndpoints = (builder) => ({

    updateCoupon: builder.mutation({
        query: (formData) => ({
            url: 'user/updateCoupon',
            method: 'PUT',
            body: formData,
            credentials: 'include',
        }),
    }),


    getAllCoupons: builder.mutation({
        query: () => ({
            url: 'user/getAllCoupons',
            method: 'GET',
            credentials: 'include',
        }),
    }),

});
