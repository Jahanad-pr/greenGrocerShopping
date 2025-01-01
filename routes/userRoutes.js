const express = require('express');
const {createAUser,loginUser,googleLog, getUserData, 
    getOTP, conformOTP, updateVerification, isUerExist, logoutUser, updateProfile, matchPassword,resetPassword,addLocation } = require('../controllers/userController');
const { getProducts,getCAtegoryProducts,getProductDetails,getAllProduct,getFilteredProducts } = require('../controllers/config/ProductController')
const { upsertAddress,getAdresses,deleteAddress } = require('../controllers/config/AdressController')
const { getCategories } = require('../controllers/config/categoryController');
const { addToBookmark,checkItemIntheBookmark,removeBookmarkItme,getBookmarkItems } = require('../controllers/config/bookmarkController');
const { addtoCart,checkPorductInCart,getCartItems,updateCartITem } = require('../controllers/config/cartController');
const { placeOrder,getOders,cancelOrder,returnOrder,updateOrderStatus } = require('../controllers/config/orderController');
const { getCollections,getCAtegoryCollection,getAllCollection } = require('../controllers/config/collectionController');
const { authMiddleware } = require('../middlewares/checkUser');
const { createOrder, verifyPayment } = require('../controllers/config/razorpayController');
const { getAllCoupons } = require('../controllers/config/couponControll');
const { addCoinToWallet,getUserTransactions } = require('../controllers/config/walletControll');

const router = express.Router();

router.post('/signup',createAUser);
router.post('/login',loginUser);
router.post('/googleLog',googleLog);

router.post('/getOTP',getOTP);
router.post('/conformOTP',conformOTP);
router.post('/addDetails',updateVerification);

router.post('/isUerExist',isUerExist);
router.post('/logoutUser',logoutUser);

router.post('/updateProfile',authMiddleware,updateProfile);
router.post('/matchPassword',authMiddleware,matchPassword);
router.post('/resetPassword',resetPassword);


router.post('/upsertAddress',authMiddleware,upsertAddress);
router.get('/getAdresses/:id',authMiddleware,getAdresses);
router.delete('/deleteAddress/:id',authMiddleware,deleteAddress);

router.post('/placeOrder',authMiddleware,placeOrder);
router.get('/getOders/:id',authMiddleware,getOders);
router.post('/cancelOrder',authMiddleware,cancelOrder);
router.post('/returnOrder',authMiddleware,returnOrder);


router.post('/addtoCart',authMiddleware,addtoCart);
router.get('/checkPorductInCart/:prductID',authMiddleware,checkPorductInCart);
router.get('/getCartItems',authMiddleware,getCartItems);
router.post('/updateCartITem/:id',authMiddleware,updateCartITem);

router.get('/getAllProduct',getAllProduct);
router.get('/getAllCollection',getAllCollection);
router.get('/getAllCollection',getAllCollection);

router.post('/getFilteredProducts',getFilteredProducts)

router.post('/addToBookmark',addToBookmark);
router.get('/checkItemIntheBookmark/:id',authMiddleware,checkItemIntheBookmark);
router.get('/getBookmarkItems',authMiddleware,getBookmarkItems);
router.delete('/removeBookmarkItme/:id',authMiddleware,removeBookmarkItme);

// http://34.70.108.163:8080/user/signup
// http://34.28.122.218:8080/user/login

router.get('/getUser',authMiddleware,getUserData);
router.get('/getCategories',getCategories);
router.get('/getProductDetails/:id',getProductDetails);
router.get('/getCollections/:id',getCollections);
router.get('/getCAtegoryProducts/:id',getCAtegoryProducts);
router.get('/getCAtegoryCollctiions/:id',getCAtegoryCollection);
// router.get('/getCollectionProducts/:id',getCollectionProducts);

router.get('/getAllCoupons',authMiddleware,getAllCoupons);

router.post('/addLocation',authMiddleware,addLocation);

router.get('/getUserTransactions',authMiddleware,getUserTransactions);

router.put('/addCoinToWallet',authMiddleware,addCoinToWallet);

router.put('/updateOrderStatus',authMiddleware,updateOrderStatus);

// Razorpay routes
router.post('/razorpay/create-order', createOrder);
router.post('/razorpay/verify-payment', verifyPayment);

module.exports = router;