const Product = require('../../models/other/productModel')
const Order = require('../../models/other/OrderModel')
const Category = require('../../models/other/categoryModels')
const Collection = require('../../models/other/collectionModel')



module.exports.upsertProducts = async (req, res) => {



    const { formData, id, action, Urls } = req.body

    try {

        if (action === 'add') {

            const isListed = true
            const updatedAt = Date.now()
            const createdAt = Date.now()



            const insertData = { ...formData, isListed, updatedAt, createdAt, productCollection: formData?.productCollection?._id }

            const newProduct = await Product.create(insertData)


            if (newProduct) {
                return res.status(200).json({ mission: true, message: 'successfully created' })
            } else {
                return res.status(500).json({ mission: false, message: 'nothing updated' })
            }


        } else if (action === 'update') {



            const updatedAt = Date.now()

            const updateData = { ...formData, updatedAt }


            const result = await Product.updateOne({ _id: formData._id }, { $set: updateData })



            if (result.modifiedCount > 0) {

                return res.status(200).json({ mission: true, message: 'successfully updated' })
            }
            return res.status(500).json({ mission: false, message: 'nothing updated' })

        }

    } catch (error) {
        return res.status(500).json({ mission: false, message: error.message })
    }


}





module.exports.getProducts = async (req, res) => {


    try {

        const products = await Product.find({}).populate('category', 'name discount').populate('productCollection', 'name')



        if (products.length <= 0) {

            res.status(500).json({ mission: false, message: 'empty categories', data: [] })

        } else {

            if (products[0].isListed) {

                res.status(200).json({ mission: true, message: 'successfull', data: products })

            }

        }

    } catch (error) {
        return res.status(500).json({ mission: false, message: error.messgae })
    }

}



module.exports.getCAtegoryProducts = async (req, res) => {



    const id = req.params.id


    try {

        const products = await Product.find({ category: id, isListed: true }).populate('category', 'name discount').limit(10)

        if (products.length <= 0) {

            res.status(500).json({ mission: false, message: 'empty categories', data: [] })

        } else {



            res.status(200).json({ mission: true, message: 'successfull', data: products })


        }

    } catch (error) {
        return res.status(500).json({ mission: false, message: error.messgae })
    }

}






module.exports.updateProduct = async (req, res) => {


    // console.log('adlfjkads');


    const { uniqeID, updateBool, action } = req.body

    try {
        if (action === 'access') {

            const updatedtatus = await Product.updateOne({ _id: uniqeID }, { isListed: updateBool })


            if (updatedtatus.modifiedCount > 0) {

                return res.status(200).json({ mission: true, message: 'successfully updated', uniqeID: uniqeID, action })
            }



        } else if (action === 'delete') {

            const result = await Product.findByIdAndDelete(uniqeID)


            return res.status(200).json({ mission: true, message: 'successfully deleted', uniqeID: uniqeID, action })
        }

    } catch (error) {

        return res.status(500).json({ mission: false, message: error.messgae })
    }

}





module.exports.getProductDetails = async (req, res) => {
    const _id = req.params.id

    try {
        const productDetails = await Product.findOne({ _id }).populate('category', 'name discount')


        if (productDetails) {

            return res.status(200).json(productDetails)
        }

        return res.status(500).json('no product found')

    } catch (error) {

        return res.status(500).json(error.message)
    }

}


module.exports.getAllProduct = async (req, res) => {

    // MongoDB Aggregation Pipeline for Product Popularity
    const pipeline = await Order.aggregate([
        // Unwind the items array to work with individual items
        { $unwind: "$items" },

        // Lookup product details
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        // Unwind the productDetails array (since lookup returns an array)
        { $unwind: "$productDetails" },

        // Group by product ID to calculate metrics
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$productDetails.name" },
                totalOrders: { $sum: 1 },
                totalQuantity: { $sum: "$items.quantity" },
                totalSales: {
                    $sum: {
                        $multiply: [
                            { $divide: ["$items.quantity", 1000] },
                            "$productDetails.salePrice"
                        ]
                    }
                },
                avgQuantityPerOrder: { $avg: "$items.quantity" },
                orderDates: { $push: "$createdAt" }
            }
        },
        // Calculate popularity score
        // Based on: order frequency, quantity sold, and revenue generated
        {
            $addFields: {
                popularityScore: {
                    $add: [
                        { $multiply: ["$totalOrders", 0.4] },  // 40% weight to order frequency
                        { $multiply: [{ $divide: ["$totalQuantity", 1000] }, 0.3] },  // 30% weight to quantity
                        { $multiply: [{ $divide: ["$totalSales", 10000] }, 0.3] }  // 30% weight to sales
                    ]
                }
            }
        },
        // Sort by popularity score in descending order
        { $sort: { popularityScore: -1 } },
        // Project the final output format
        {
            $project: {
                _id: 1,
                productName: 1,
                totalOrders: 1,
                totalQuantity: { $divide: ["$totalQuantity", 1000] },  // Convert to Kg
                totalSales: { $round: ["$totalSales", 2] },
                avgQuantityPerOrder: { $round: [{ $divide: ["$avgQuantityPerOrder", 1000] }, 2] },
                popularityScore: { $round: ["$popularityScore", 2] },
                // Calculate if trending (more orders in last 7 days compared to previous 7 days)
                isTrending: {
                    $let: {
                        vars: {
                            last7Days: {
                                $filter: {
                                    input: "$orderDates",
                                    as: "date",
                                    cond: {
                                        $gte: ["$$date", { $subtract: [new Date(), { $multiply: [7, 24, 60, 60, 1000] }] }]
                                    }
                                }
                            },
                            prev7Days: {
                                $filter: {
                                    input: "$orderDates",
                                    as: "date",
                                    cond: {
                                        $and: [
                                            { $lt: ["$$date", { $subtract: [new Date(), { $multiply: [7, 24, 60, 60, 1000] }] }] },
                                            { $gte: ["$$date", { $subtract: [new Date(), { $multiply: [14, 24, 60, 60, 1000] }] }] }
                                        ]
                                    }
                                }
                            }
                        },
                        in: { $gt: [{ $size: "$$last7Days" }, { $size: "$$prev7Days" }] }
                    }
                }
            }
        }
    ]);

    //   console.log(pipeline);

    // const _id = req.params.id

    try {
        const productDetails = await Product.find({}).populate('category', 'name discount')

        // console.log(productDetails);



        if (productDetails) {

            return res.status(200).json({ productDetails, pipeline })
        }

        return res.status(500).json('no product found')

    } catch (error) {

        return res.status(500).json(error.message)
    }

}



module.exports.updateOffer = async (req, res) => {


    const { discountType, discountValue, minQuantity, maxAmount, offerType, productId, offerFor } = req.body

    const discountData = {
        type: offerType,
        isPercentage: discountType === "percentage" ? true : false,
        value: discountValue,
        minQuantity,
        maxAmount,
        updatedAt: Date.now()
    }

    try {
        let productDetails = ''

        console.log(discountData);


        if (offerFor === "Product") {

            productDetails = await Product.updateOne({ _id: productId }, { $set: { discount: { ...discountData } } })

        } else {

            productDetails = await Category.updateOne({ _id: req.body.category }, { $set: { discount: { ...discountData } } })

        }


        if (productDetails) {

            console.log(productDetails);

            return res.status(200).json('Offer udated successfully')
        }

        return res.status(500).json('no product found')

    } catch (error) {

        return res.status(500).json(error.message)
    }

}

module.exports.getAllDiscounts = async (req, res) => {

    // const id = req.user.id

    try {


        const descounts = await Product.find({}, { discount: 1, name: 1, category: 1, pics: 1 }).populate('category', 'name')
        const descountCategory = await Category.find({}, { discount: 1, name: 1 })
        descounts.push(...descountCategory)
        if (descounts) {
            ;

            return res.status(200).json([...descounts])
        }

        return res.status(500).json('no Discounts')

    } catch (error) {

        return res.status(500).json(error.message)
    }

}




// productController.js - Backend
module.exports.getFilteredProducts = async (req, res) => {
    try {
        const {
            category,
            priceRange,
            sortBy = 'date-desc',
            searchQuery,
            showInStock,
            showFeatured,
            isCollection,
            page,
            limit = 10
        } = req.body;

        // Build filter object
        const filter = {};

        // Category filter
        if (category && category !== 'All Categories') {
            const categoryDoc = await Category.findOne({ name: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }

        // Price range filter
        if (priceRange) {
            filter.salePrice = {
                $gte: priceRange[0],
                $lte: priceRange[1]
            };
        }

        // Stock filter
        if (showInStock) {
            filter.stock = { $gt: 0 };
        }

        // Featured filter
        if (showFeatured) {
            filter.featured = true;
        }

        // Search filter
        if (searchQuery) {
            filter.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Sort options
        let sortOption = {};
        switch (sortBy) {
            case 'name-asc':
                sortOption = { name: 1 };
                break;
            case 'name-desc':
                sortOption = { name: -1 };
                break;
            case 'price-asc':
                sortOption = { salePrice: 1 };
                break;
            case 'price-desc':
                sortOption = { salePrice: -1 };
                break;
            case 'date-asc':
                sortOption = { createdAt: 1 };
                break;
            case 'date-desc':
                sortOption = { createdAt: -1 };
                break;
            case 'popularity':
                // Implement popularity sorting using aggregation pipeline
                const pipeline = await Order.aggregate([
                    // Your existing popularity pipeline
                ]);
                break;
        }

        let collectionsData = []

        if(isCollection){

            collectionsData = await Collection.find({
                name: { $regex: new RegExp(searchQuery, 'i') }
            }).sort(sortOption).populate('category', 'name discount');

        }

        // Pagination
        const skip = (page - 1) * limit;

        // Get filtered products with pagination
        const [productDetails, total] = await Promise.all([
            Product.find(filter)
                .populate('category', 'name discount')
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit)),
            Product.countDocuments(filter)
        ]);

        // Get popularity data if needed
        // const pipeline = sortBy === 'popularity' ? await getPopularityPipeline() : [];

        return res.status(200).json({
            success: true,
            productDetails,
            // pipeline,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            },
            collections: collectionsData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// // Helper function for popularity pipeline
// const getPopularityPipeline = async () => {
//     return Order.aggregate([
//         // Your existing popularity pipeline logic
//     ]);
// };