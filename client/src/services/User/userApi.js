// src/services/userApi/userApiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userAuthApi } from './userAuthApi';
import { userDetailsApi } from './userDetailsApi';
import { couponEndpoints } from './couponEndPoit';
import { userProductsApi } from './userProductsApi';
import { userCategoriesApi } from './userCategoriesApi';
import { walletEndpoints } from './WalletEndPoin';
import { AdressMangeApi } from './AddressMange';
import { userOrderApi } from './OrderManage'
import { CartManage } from './CartMange'

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (builder) => ({
    ...userAuthApi(builder),
    ...userDetailsApi(builder),
    ...couponEndpoints(builder),
    ...walletEndpoints(builder),
    ...userCategoriesApi(builder),
    ...userProductsApi(builder),
    ...AdressMangeApi(builder),
    ...userOrderApi(builder),
    ...CartManage(builder),
  }),
});

export const { 
  useSignUpMutation,
  useLoginMutation,
  useGoogleLogMutation,

  useGetUserMutation,
  useIsUerExistMutation,

  useGetOTPMutation,
  useConformOTPMutation,
  useAddDetailsMutation,

  useGetCategoriesMutation,
  useGetCAtegoryProductsMutation,
  useGetCAtegoryCollctiionsMutation,
  
  useGetCollectionsMutation, 
  useGetCollectionProductsMutation,
  
  useMatchPasswordMutation,
  useUpdateProfileMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,

  useUpsertAddressMutation,
  useGetAdressesMutation,
  useDeleteAddressMutation,

  useGetProductDetailsMutation,

  usePlaceOrderMutation,
  useGetOdersMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,

  useGetFilteredProductsMutation,

  useAddtoCartMutation,
  useCheckPorductInCartMutation,
  useGetCartItemsMutation,
  useUpdateCartITemMutation,
  
  useGetAllProductMutation,
  useGetAllCollectionMutation,

  useGetAllCouponsMutation,

  useAddCoinToWalletMutation,
  useGetUserTransactionsMutation,

  useAddToBookmarkMutation,
  useCheckItemIntheBookmarkMutation,
  useRemoveBookmarkItmeMutation,
  useGetBookmarkItemsMutation,

  useAddLocationMutation,


} = userApiSlice;
