export const walletEndpoints = (builder) => ({

    addCoinToWallet: builder.mutation({
        query: (formData) => ({
            url: 'user/addCoinToWallet',
            method: 'PUT',
            body: formData,
            credentials: 'include',
        }),
    }),


    getUserTransactions: builder.mutation({
        query: () => ({
            url: 'user/getUserTransactions',
            method: 'GET',
            credentials: 'include',
        }),
    }),

});
