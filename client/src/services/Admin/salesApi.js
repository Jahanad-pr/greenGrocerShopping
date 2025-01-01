import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const salesApi = createApi({
    reducerPath: 'salesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_SERVER_URL,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getSalesReport: builder.mutation({
            query: (params) => ({
                url: '/admin/sales-report',
                method: 'POST',
                body: params
            })
        }),
        downloadSalesReport: builder.mutation({
            query: (dateRange) => ({
                url: '/admin/download-sales-report',
                method: 'POST',
                body: dateRange
            })
        })
    })
});

export const {
    useGetSalesReportMutation,
    useDownloadSalesReportMutation
} = salesApi;
