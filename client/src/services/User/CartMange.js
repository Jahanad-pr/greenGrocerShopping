// src/services/userApi/userCategoriesApi.js
export const CartManage = (builder) => ({

    addtoCart: builder.mutation({
      query: ({cartData,userId}) => ({
        url: 'user/addtoCart',
        method: 'POST',
        body:{cartData,userId},
        credentials: 'include',
      }),
    }),

    checkPorductInCart: builder.mutation({
      query: (prductID) => ({
        url: `user/checkPorductInCart/${prductID}`,
        method: 'GET',
        // body:{prductID},
        credentials: 'include',
      }),
    }),

    getCartItems: builder.mutation({
      query: () => ({
        url: `user/getCartItems`,
        method: 'GET',
        credentials: 'include',
      }),
    }),

    updateCartITem: builder.mutation({
      query: ({id,action='remove',seletor='1Kg'}) => ({
        url: `user/updateCartITem/${id}`,
        method: 'POST',
        body:{id,action,seletor},
        credentials: 'include',
      }),
    }),

   


  });
