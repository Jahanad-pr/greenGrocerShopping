export const couponEndpoints = (builder) => ({

    updateCoupon: builder.mutation({
        query: (formData) => ({
            url: 'admin/updateCoupon',
            method: 'PUT',
            body: formData,
            credentials: 'include',
        }),
    }),


    getAllCoupons: builder.mutation({
        query: () => ({
            url: 'admin/getAllCoupons',
            method: 'GET',
            credentials: 'include',
        }),
    }),

    deleteCoupon: builder.mutation({
        query: (id) => ({
            url: `admin/deleteCoupon/${id}`,
            method: 'DELETE',
            credentials: 'include',
        }),
    }),

    updateCouponAccess: builder.mutation({
        query: (formData) => ({
            url: `admin/updateCouponAccess`,
            method: 'PATCH',
            body: formData,
            credentials: 'include',
        }),
    }),

});
