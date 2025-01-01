const express = require('express');
const { getCustomers, getAdmins, updateUserAccess,getAdmin,logoutAdmin } = require('../controllers/adminControllers');
const { getTopUsers } = require('../controllers/userController')
const { upsertProducts,getProducts,updateProduct,updateOffer,getAllDiscounts } = require('../controllers/config/ProductController')
const { upsertCollection,getCollections,updateCollection } = require('../controllers/config/collectionController')
const { upsertCategory, getCategories, updateCategory, } = require('../controllers/config/categoryController')
const { updateCoupon, getAllCoupons, deleteCoupon,updateCouponAccess } = require('../controllers/config/couponControll')
const { uploadImages,storage , upload } = require('../controllers/config/utilityController')
const { updateOrderStatus,cancelOrder,getAllOrders } = require('../controllers/config/orderController')
const path = require('path');
const { adminAuthMiddleware } = require('../middlewares/checkAdmin');
const { getChartsDetails } = require('../controllers/config/chartControllers');


const router = express.Router();

router.post('/login',getAdmins);



router.get('/getCustomers',adminAuthMiddleware,getCustomers);
router.get('/getCategories',adminAuthMiddleware,getCategories);
router.get('/getCollections',adminAuthMiddleware,getCollections);
router.get('/getProducts',adminAuthMiddleware,getProducts);

router.get('/getAdmin',adminAuthMiddleware,getAdmin);
router.get('/getTopUsers',adminAuthMiddleware,getTopUsers);


router.put('/upsertCategory',adminAuthMiddleware,upsertCategory);
router.put('/upsertCollection',adminAuthMiddleware,upsertCollection);
router.put('/upsertProducts',adminAuthMiddleware,upsertProducts);

router.get('/getAllDiscounts',adminAuthMiddleware,getAllDiscounts);
router.put('/updateCoupon',adminAuthMiddleware,updateCoupon);
router.get('/getAllCoupons',adminAuthMiddleware,getAllCoupons);
router.delete('/deleteCoupon/:code',adminAuthMiddleware,deleteCoupon);
router.patch('/updateCouponAccess',adminAuthMiddleware,updateCouponAccess);

router.get('/getAllOrders',adminAuthMiddleware,getAllOrders);

router.patch('/updateUserAccess',adminAuthMiddleware,updateUserAccess);
router.patch('/updateCategoryAccess',adminAuthMiddleware,updateCategory);
router.patch('/updateCollection',adminAuthMiddleware,updateCollection);
router.patch('/updateProduct',adminAuthMiddleware,updateProduct);
router.patch('/updateProduct',adminAuthMiddleware,updateProduct);
router.patch('/updateOffer',adminAuthMiddleware,updateOffer);

router.get('/getChartsDetails',adminAuthMiddleware,getChartsDetails);

router.post('/uploadImages',adminAuthMiddleware,upload.single('file'),uploadImages);
router.post('/logoutAdmin',adminAuthMiddleware,logoutAdmin);
router.post('/updateOrderStatus',adminAuthMiddleware,updateOrderStatus);
router.post('/cancelOrder',adminAuthMiddleware,cancelOrder);















module.exports = router;
