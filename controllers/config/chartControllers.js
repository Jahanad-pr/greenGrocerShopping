const Order = require('../../models/other/OrderModel')
const Product = require('../../models/other/productModel')
const Category = require('../../models/other/categoryModels')
const User = require('../../models/Auth/userModel')


module.exports.getChartsDetails = async (req, res) => {

    
    
    const filterBY = req.query.filterby || 'category'
    

    try {
        if (filterBY === 'category') {

            const orders = await Order.aggregate([
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "items.productDetails"
                    }
                },
                {
                    $unwind: "$items.productDetails"
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "items.productDetails.category",
                        foreignField: "_id",
                        as: "items.categoryDetails"
                    }
                },
                {
                    $unwind: "$items.categoryDetails"
                },
                {
                    $group: {
                        _id: "$items.categoryDetails._id",
                        categoryName: { $first: "$items.categoryDetails.name" },
                        totalOrders: { $sum: 1 },
                        totalQuantity: { $sum: "$items.quantity" },
                        totalAmount: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                    }
                }
            ]);


            

        }else 

        if(filterBY === 'salesPeriod'){
            let dateFilter = {};
            const period = req.query.period;

            switch(period) {
                case 'today': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    dateFilter = {
                        time: {
                        $gte: today,
                        $lt: tomorrow
                        }
                    };
                    break;
                }
                case 'yesterday': {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const today = new Date(yesterday);
                    today.setDate(yesterday.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: yesterday,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisWeek': {
                    const startOfWeek = new Date();
                    const currentDay = startOfWeek.getDay();
                    const daysToSubtract = currentDay === 0 ? 0 : currentDay; // If today is Sunday, subtract 0 days
                    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfWeek,
                            $lte: endOfWeek 
                        } 
                    };
                    break;
                }
                case 'lastWeek': {
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd 
                        } 
                    };
                    break;
                }
                case 'last7Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last7DaysStart = new Date(today);
                    last7DaysStart.setDate(today.getDate() - 7);
                    dateFilter = {
                        time: {
                            $gte: last7DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfMonth,
                            $lte: endOfMonth 
                        } 
                    };
                    break;
                }
                case 'lastMonth': {
                    const lastMonthStart = new Date();
                    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
                    lastMonthStart.setDate(1);
                    lastMonthStart.setHours(0, 0, 0, 0);
                    const lastMonthEnd = new Date(lastMonthStart);
                    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
                    lastMonthEnd.setDate(0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd 
                        } 
                    };
                    break;
                }
                case 'last30Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last30DaysStart = new Date(today);
                    last30DaysStart.setDate(today.getDate() - 30);
                    dateFilter = {
                        time: {
                            $gte: last30DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last50Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last50DaysStart = new Date(today);
                    last50DaysStart.setDate(today.getDate() - 50);
                    dateFilter = {
                        time: {
                            $gte: last50DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last100Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last100DaysStart = new Date(today);
                    last100DaysStart.setDate(today.getDate() - 100);
                    dateFilter = {
                        time: {
                            $gte: last100DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisYear': {
                    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(startOfYear);
                    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
                    endOfYear.setDate(0);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfYear,
                            $lte: endOfYear 
                        } 
                    };
                    break;
                }
                case 'custom': {
                    if (req.query.startDate && req.query.endDate) {
                        const startDate = new Date(req.query.startDate);
                        const endDate = new Date(req.query.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        dateFilter = { 
                            time: { 
                                $gte: startDate,
                                $lte: endDate 
                            } 
                        };
                    }
                    break;
                }
            }

            console.log('Current Time:', new Date().toISOString());
            console.log('Local Time Zone Offset:', new Date().getTimezoneOffset());

            const orders = await Order.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "products",
                        let: { productId: "$items.product" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$productId"] }
                                }
                            }
                        ],
                        as: "productDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$productDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        let: { categoryId: "$productDetails.category" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$categoryId"] }
                                }
                            }
                        ],
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$categoryDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            date: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
                            categoryId: "$categoryDetails._id",
                            categoryName: "$categoryDetails.name"
                        },
                        totalOrders: { $sum: 1 },
                        totalAmount: { $sum: "$price.grandPrice" },
                        totalItems: { $sum: "$items.quantity" }
                    }
                },
                {
                    $group: {
                        _id: "$_id.date",
                        categories: {
                            $push: {
                                categoryId: "$_id.categoryId",
                                categoryName: "$_id.categoryName",
                                totalOrders: "$totalOrders",
                                totalAmount: "$totalAmount",
                                totalItems: "$totalItems"
                            }
                        },
                        dailyTotal: {
                            $sum: "$totalAmount"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        categories: 1,
                        dailyTotal: 1
                    }
                },
                {
                    $sort: { date: 1 }
                }
            ]);

            console.log('Final Results:', JSON.stringify(orders, null, 2));
            return res.status(200).json(orders);
        } else if (filterBY === 'topProducts') {
            let dateFilter = {};
            const period = req.query.period;

            switch(period) {
                case 'today': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: today,
                            $lt: tomorrow
                        }
                    };
                    break;
                }
                case 'yesterday': {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const today = new Date(yesterday);
                    today.setDate(yesterday.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: yesterday,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisWeek': {
                    const startOfWeek = new Date();
                    const currentDay = startOfWeek.getDay();
                    const daysToSubtract = currentDay === 0 ? 0 : currentDay; // If today is Sunday, subtract 0 days
                    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfWeek,
                            $lte: endOfWeek 
                        } 
                    };
                    break;
                }
                case 'lastWeek': {
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd 
                        } 
                    };
                    break;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfMonth,
                            $lte: endOfMonth 
                        } 
                    };
                    break;
                }
                case 'lastMonth': {
                    const lastMonthStart = new Date();
                    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
                    lastMonthStart.setDate(1);
                    lastMonthStart.setHours(0, 0, 0, 0);
                    const lastMonthEnd = new Date(lastMonthStart);
                    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
                    lastMonthEnd.setDate(0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd 
                        } 
                    };
                    break;
                }
                case 'thisYear': {
                    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(startOfYear);
                    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
                    endOfYear.setDate(0);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfYear,
                            $lte: endOfYear 
                        } 
                    };
                    break;
                }
                case 'lastYear': {
                    const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
                    lastYearStart.setHours(0, 0, 0, 0);
                    const lastYearEnd = new Date(lastYearStart);
                    lastYearEnd.setFullYear(lastYearStart.getFullYear() + 1);
                    lastYearEnd.setDate(0);
                    lastYearEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastYearStart,
                            $lte: lastYearEnd 
                        } 
                    };
                    break;
                }
                case 'last7Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last7DaysStart = new Date(today);
                    last7DaysStart.setDate(today.getDate() - 7);
                    dateFilter = {
                        time: {
                            $gte: last7DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last10Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last10DaysStart = new Date(today);
                    last10DaysStart.setDate(today.getDate() - 10);
                    dateFilter = {
                        time: {
                            $gte: last10DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last15Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last15DaysStart = new Date(today);
                    last15DaysStart.setDate(today.getDate() - 15);
                    dateFilter = {
                        time: {
                            $gte: last15DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last30Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last30DaysStart = new Date(today);
                    last30DaysStart.setDate(today.getDate() - 30);
                    dateFilter = {
                        time: {
                            $gte: last30DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last50Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last50DaysStart = new Date(today);
                    last50DaysStart.setDate(today.getDate() - 50);
                    dateFilter = {
                        time: {
                            $gte: last50DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last100Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last100DaysStart = new Date(today);
                    last100DaysStart.setDate(today.getDate() - 100);
                    dateFilter = {
                        time: {
                            $gte: last100DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'custom': {
                    if (req.query.startDate && req.query.endDate) {
                        const startDate = new Date(req.query.startDate);
                        const endDate = new Date(req.query.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        dateFilter = { 
                            time: { 
                                $gte: startDate,
                                $lte: endDate 
                            } 
                        };
                    }
                    break;
                }
                default: {
                    // If no period specified, get all-time top categories/products
                    dateFilter = {};
                }
            }

            const topProducts = await Order.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $unwind: "$productDetails"
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "productDetails.category",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$categoryDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            productId: "$productDetails._id",
                            productName: "$productDetails.name",
                            productImage: "$productDetails.pics.one",
                            categoryId: "$categoryDetails._id",
                            categoryName: "$categoryDetails.name"
                        },
                        totalQuantitySold: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$price.grandPrice" },
                        totalOrders: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        productId: "$_id.productId",
                        productName: "$_id.productName",
                        productImage: "$_id.productImage",
                        categoryId: "$_id.categoryId",
                        categoryName: "$_id.categoryName",
                        totalQuantitySold: 1,
                        totalRevenue: { $round: ["$totalRevenue", 2] },
                        totalOrders: 1
                    }
                },
                {
                    $sort: { totalRevenue: -1 }
                },
                {
                    $limit: 10
                }
            ]);

            console.log('Date Filter:', dateFilter);
            console.log('Sample Order:', await Order.findOne().lean());
            console.log('Top Products Results:', JSON.stringify(topProducts, null, 2));

            return res.status(200).json(topProducts);
        } else if (filterBY === 'topCategories') {
            let dateFilter = {};
            const period = req.query.period;

            switch(period) {
                case 'today': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: today,
                            $lt: tomorrow
                        }
                    };
                    break;
                }
                case 'yesterday': {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const today = new Date(yesterday);
                    today.setDate(yesterday.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: yesterday,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisWeek': {
                    const startOfWeek = new Date();
                    const currentDay = startOfWeek.getDay();
                    const daysToSubtract = currentDay === 0 ? 0 : currentDay; // If today is Sunday, subtract 0 days
                    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfWeek,
                            $lte: endOfWeek 
                        } 
                    };
                    break;
                }
                case 'lastWeek': {
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd 
                        } 
                    };
                    break;
                }
                case 'lastMonth': {
                    const lastMonthStart = new Date();
                    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
                    lastMonthStart.setDate(1);
                    lastMonthStart.setHours(0, 0, 0, 0);
                    const lastMonthEnd = new Date(lastMonthStart);
                    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
                    lastMonthEnd.setDate(0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd 
                        } 
                    };
                    break;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfMonth,
                            $lte: endOfMonth 
                        } 
                    };
                    break;
                }
                case 'thisYear': {
                    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(startOfYear);
                    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
                    endOfYear.setDate(0);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfYear,
                            $lte: endOfYear 
                        } 
                    };
                    break;
                }
                case 'lastYear': {
                    const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
                    lastYearStart.setHours(0, 0, 0, 0);
                    const lastYearEnd = new Date(lastYearStart);
                    lastYearEnd.setFullYear(lastYearStart.getFullYear() + 1);
                    lastYearEnd.setDate(0);
                    lastYearEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastYearStart,
                            $lte: lastYearEnd 
                        } 
                    };
                    break;
                }
                case 'last7Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last7DaysStart = new Date(today);
                    last7DaysStart.setDate(today.getDate() - 7);
                    dateFilter = {
                        time: {
                            $gte: last7DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last10Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last10DaysStart = new Date(today);
                    last10DaysStart.setDate(today.getDate() - 10);
                    dateFilter = {
                        time: {
                            $gte: last10DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last15Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last15DaysStart = new Date(today);
                    last15DaysStart.setDate(today.getDate() - 15);
                    dateFilter = {
                        time: {
                            $gte: last15DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last30Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last30DaysStart = new Date(today);
                    last30DaysStart.setDate(today.getDate() - 30);
                    dateFilter = {
                        time: {
                            $gte: last30DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last50Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last50DaysStart = new Date(today);
                    last50DaysStart.setDate(today.getDate() - 50);
                    dateFilter = {
                        time: {
                            $gte: last50DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last100Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last100DaysStart = new Date(today);
                    last100DaysStart.setDate(today.getDate() - 100);
                    dateFilter = {
                        time: {
                            $gte: last100DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'custom': {
                    if (req.query.startDate && req.query.endDate) {
                        const startDate = new Date(req.query.startDate);
                        const endDate = new Date(req.query.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        dateFilter = { 
                            time: { 
                                $gte: startDate,
                                $lte: endDate 
                            } 
                        };
                    }
                    break;
                }
                default: {
                    // If no period specified, get all-time top categories/products
                    dateFilter = {};
                }
            }

            const topCategories = await Order.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $unwind: "$productDetails"
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "productDetails.category",
                        foreignField: "_id",
                        as: "categoryDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$categoryDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            categoryId: "$categoryDetails._id",
                            categoryName: "$categoryDetails.name",
                            categoryImage: "$categoryDetails.image"
                        },
                        totalQuantitySold: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: "$price.grandPrice" },
                        totalOrders: { $sum: 1 },
                        uniqueProducts: { $addToSet: "$productDetails._id" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        categoryId: "$_id.categoryId",
                        categoryName: "$_id.categoryName",
                        categoryImage: "$_id.categoryImage",
                        totalQuantitySold: 1,
                        totalRevenue: { $round: ["$totalRevenue", 2] },
                        totalOrders: 1,
                        uniqueProductCount: { $size: "$uniqueProducts" }
                    }
                },
                {
                    $sort: { totalRevenue: -1 }
                },
                {
                    $limit: 10
                }
            ]);

            console.log('Date Filter for Top Categories:', dateFilter);
            console.log('Top Categories Results:', JSON.stringify(topCategories, null, 2));

            return res.status(200).json(topCategories);
        } else if (filterBY === 'salesAnalytics') {
            let dateFilter = {};
            const period = req.query.period;

            switch(period) {
                case 'today': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: today,
                            $lt: tomorrow
                        }
                    };
                    break;
                }
                case 'yesterday': {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const today = new Date(yesterday);
                    today.setDate(yesterday.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: yesterday,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisWeek': {
                    const startOfWeek = new Date();
                    const currentDay = startOfWeek.getDay();
                    const daysToSubtract = currentDay === 0 ? 0 : currentDay; // If today is Sunday, subtract 0 days
                    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfWeek,
                            $lte: endOfWeek 
                        } 
                    };
                    break;
                }
                case 'lastWeek': {
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd 
                        } 
                    };
                    break;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfMonth,
                            $lte: endOfMonth 
                        } 
                    };
                    break;
                }
                case 'lastMonth': {
                    const lastMonthStart = new Date();
                    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
                    lastMonthStart.setDate(1);
                    lastMonthStart.setHours(0, 0, 0, 0);
                    const lastMonthEnd = new Date(lastMonthStart);
                    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
                    lastMonthEnd.setDate(0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd 
                        } 
                    };
                    break;
                }
                case 'thisYear': {
                    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(startOfYear);
                    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
                    endOfYear.setDate(0);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfYear,
                            $lte: endOfYear 
                        } 
                    };
                    break;
                }
                case 'lastYear': {
                    const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
                    lastYearStart.setHours(0, 0, 0, 0);
                    const lastYearEnd = new Date(lastYearStart);
                    lastYearEnd.setFullYear(lastYearStart.getFullYear() + 1);
                    lastYearEnd.setDate(0);
                    lastYearEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastYearStart,
                            $lte: lastYearEnd 
                        } 
                    };
                    break;
                }
                case 'last7Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last7DaysStart = new Date(today);
                    last7DaysStart.setDate(today.getDate() - 7);
                    dateFilter = {
                        time: {
                            $gte: last7DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last10Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last10DaysStart = new Date(today);
                    last10DaysStart.setDate(today.getDate() - 10);
                    dateFilter = {
                        time: {
                            $gte: last10DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last15Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last15DaysStart = new Date(today);
                    last15DaysStart.setDate(today.getDate() - 15);
                    dateFilter = {
                        time: {
                            $gte: last15DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last30Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last30DaysStart = new Date(today);
                    last30DaysStart.setDate(today.getDate() - 30);
                    dateFilter = {
                        time: {
                            $gte: last30DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last50Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last50DaysStart = new Date(today);
                    last50DaysStart.setDate(today.getDate() - 50);
                    dateFilter = {
                        time: {
                            $gte: last50DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last100Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last100DaysStart = new Date(today);
                    last100DaysStart.setDate(today.getDate() - 100);
                    dateFilter = {
                        time: {
                            $gte: last100DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'custom': {
                    if (req.query.startDate && req.query.endDate) {
                        const startDate = new Date(req.query.startDate);
                        const endDate = new Date(req.query.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        dateFilter = { 
                            time: { 
                                $gte: startDate,
                                $lte: endDate 
                            } 
                        };
                    }
                    break;
                }
                default: {
                    // If no period specified, get all-time analytics
                    dateFilter = {};
                }
            }

            const salesAnalytics = await Order.aggregate([
                {
                    $match: dateFilter
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalRevenue: { $sum: "$price.grandPrice" },
                        totalCustomers: { $addToSet: "$user" },
                        totalItems: { $sum: "$total_quantity" },
                        averageOrderValue: { $avg: "$price.grandPrice" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalOrders: 1,
                        totalRevenue: { $round: ["$totalRevenue", 2] },
                        totalCustomers: { $size: "$totalCustomers" },
                        totalItems: 1,
                        averageOrderValue: { $round: ["$averageOrderValue", 2] }
                    }
                }
            ]);

            // If no orders found, return default zero values
            const result = salesAnalytics.length > 0 
                ? salesAnalytics[0] 
                : {
                    totalOrders: 0,
                    totalRevenue: 0,
                    totalCustomers: 0,
                    totalItems: 0,
                    averageOrderValue: 0
                };

            // Add debug logging
            console.log('Date Filter for Sales Analytics:', dateFilter);
            console.log('Sales Analytics Results:', JSON.stringify(result, null, 2));

            return res.status(200).json(result);
        } else if (filterBY === 'overallAnalytics') {
            let dateFilter = {};
            const period = req.query.period;

            switch(period) {
                case 'today': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tomorrow = new Date(today);
                    tomorrow.setDate(today.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: today,
                            $lt: tomorrow
                        }
                    };
                    break;
                }
                case 'yesterday': {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0);
                    const today = new Date(yesterday);
                    today.setDate(yesterday.getDate() + 1);
                    dateFilter = {
                        time: {
                            $gte: yesterday,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'thisWeek': {
                    const startOfWeek = new Date();
                    const currentDay = startOfWeek.getDay();
                    const daysToSubtract = currentDay === 0 ? 0 : currentDay; // If today is Sunday, subtract 0 days
                    startOfWeek.setDate(startOfWeek.getDate() - daysToSubtract);
                    startOfWeek.setHours(0, 0, 0, 0);
                    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfWeek,
                            $lte: endOfWeek 
                        } 
                    };
                    break;
                }
                case 'lastWeek': {
                    const lastWeekStart = new Date();
                    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
                    lastWeekStart.setHours(0, 0, 0, 0);
                    const lastWeekEnd = new Date(lastWeekStart);
                    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                    lastWeekEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastWeekStart,
                            $lte: lastWeekEnd 
                        } 
                    };
                    break;
                }
                case 'thisMonth': {
                    const startOfMonth = new Date();
                    startOfMonth.setDate(1);
                    startOfMonth.setHours(0, 0, 0, 0);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    endOfMonth.setDate(0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfMonth,
                            $lte: endOfMonth 
                        } 
                    };
                    break;
                }
                case 'lastMonth': {
                    const lastMonthStart = new Date();
                    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
                    lastMonthStart.setDate(1);
                    lastMonthStart.setHours(0, 0, 0, 0);
                    const lastMonthEnd = new Date(lastMonthStart);
                    lastMonthEnd.setMonth(lastMonthEnd.getMonth() + 1);
                    lastMonthEnd.setDate(0);
                    lastMonthEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastMonthStart,
                            $lte: lastMonthEnd 
                        } 
                    };
                    break;
                }
                case 'thisYear': {
                    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                    startOfYear.setHours(0, 0, 0, 0);
                    const endOfYear = new Date(startOfYear);
                    endOfYear.setFullYear(endOfYear.getFullYear() + 1);
                    endOfYear.setDate(0);
                    endOfYear.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: startOfYear,
                            $lte: endOfYear 
                        } 
                    };
                    break;
                }
                case 'lastYear': {
                    const lastYearStart = new Date(new Date().getFullYear() - 1, 0, 1);
                    lastYearStart.setHours(0, 0, 0, 0);
                    const lastYearEnd = new Date(lastYearStart);
                    lastYearEnd.setFullYear(lastYearStart.getFullYear() + 1);
                    lastYearEnd.setDate(0);
                    lastYearEnd.setHours(23, 59, 59, 999);
                    dateFilter = { 
                        time: { 
                            $gte: lastYearStart,
                            $lte: lastYearEnd 
                        } 
                    };
                    break;
                }
                case 'last7Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last7DaysStart = new Date(today);
                    last7DaysStart.setDate(today.getDate() - 7);
                    dateFilter = {
                        time: {
                            $gte: last7DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last10Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last10DaysStart = new Date(today);
                    last10DaysStart.setDate(today.getDate() - 10);
                    dateFilter = {
                        time: {
                            $gte: last10DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last15Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last15DaysStart = new Date(today);
                    last15DaysStart.setDate(today.getDate() - 15);
                    dateFilter = {
                        time: {
                            $gte: last15DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last30Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last30DaysStart = new Date(today);
                    last30DaysStart.setDate(today.getDate() - 30);
                    dateFilter = {
                        time: {
                            $gte: last30DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last50Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last50DaysStart = new Date(today);
                    last50DaysStart.setDate(today.getDate() - 50);
                    dateFilter = {
                        time: {
                            $gte: last50DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'last100Days': {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const last100DaysStart = new Date(today);
                    last100DaysStart.setDate(today.getDate() - 100);
                    dateFilter = {
                        time: {
                            $gte: last100DaysStart,
                            $lt: today
                        }
                    };
                    break;
                }
                case 'custom': {
                    if (req.query.startDate && req.query.endDate) {
                        const startDate = new Date(req.query.startDate);
                        const endDate = new Date(req.query.endDate);
                        endDate.setHours(23, 59, 59, 999);
                        dateFilter = { 
                            time: { 
                                $gte: startDate,
                                $lte: endDate 
                            } 
                        };
                    }
                    break;
                }
                default: {
                    // If no period specified, get all-time analytics
                    dateFilter = {};
                }
            }

            // Parallel aggregation pipelines for different metrics
            const [
                orderAnalytics, 
                productAnalytics, 
                categoryAnalytics, 
                customerAnalytics
            ] = await Promise.all([
                // Orders and Revenue Analytics
                Order.aggregate([
                    { $match: dateFilter },
                    {
                        $group: {
                            _id: null,
                            totalOrders: { $sum: 1 },
                            totalRevenue: { $sum: "$price.grandPrice" },
                            averageOrderValue: { $avg: "$price.grandPrice" },
                            totalItems: { $sum: { $sum: "$items.quantity" } }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalOrders: 1,
                            totalRevenue: { $round: ["$totalRevenue", 2] },
                            averageOrderValue: { $round: ["$averageOrderValue", 2] },
                            totalItems: 1
                        }
                    }
                ]),

                // Product Analytics
                Product.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalProducts: { $sum: 1 },
                            activeProducts: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$status", "active"] }, 1, 0] 
                                } 
                            },
                            outOfStockProducts: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$status", "out-of-stock"] }, 1, 0] 
                                } 
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalProducts: 1,
                            activeProducts: 1,
                            outOfStockProducts: 1
                        }
                    }
                ]),

                // Category Analytics
                Category.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalCategories: { $sum: 1 },
                            activeCategories: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$status", "active"] }, 1, 0] 
                                } 
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalCategories: 1,
                            activeCategories: 1
                        }
                    }
                ]),

                // Customer Analytics
                User.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalCustomers: { $sum: 1 },
                            activeCustomers: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$status", "active"] }, 1, 0] 
                                } 
                            },
                            verifiedCustomers: { 
                                $sum: { 
                                    $cond: [{ $eq: ["$isVerified", true] }, 1, 0] 
                                } 
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            totalCustomers: 1,
                            activeCustomers: 1,
                            verifiedCustomers: 1
                        }
                    }
                ])
            ]);

            // Combine results
            const overallAnalytics = {
                orders: orderAnalytics[0] || {
                    totalOrders: 0,
                    totalRevenue: 0,
                    averageOrderValue: 0,
                    totalItems: 0
                },
                products: productAnalytics[0] || {
                    totalProducts: 0,
                    activeProducts: 0,
                    outOfStockProducts: 0
                },
                categories: categoryAnalytics[0] || {
                    totalCategories: 0,
                    activeCategories: 0
                },
                customers: customerAnalytics[0] || {
                    totalCustomers: 0,
                    activeCustomers: 0,
                    verifiedCustomers: 0
                }
            };

            // Add debug logging
            console.log('Overall Analytics Results:', JSON.stringify(overallAnalytics, null, 2));

            return res.status(200).json(overallAnalytics);
        }

        // console.log(orders);


    } catch (error) {
        return res.status(400).json(error.message)
    }
}   