const Order = require('../../models/other/OrderModel')
const Cart = require('../../models/other/cartModel')
const User = require('../../models/Auth/userModel')
const Product = require('../../models/other/productModel')
const { addCoinToWallet } = require('./walletControll')


module.exports.placeOrder = async (req, res) => {

    const OrderData = req.body

    // console.log(OrderData);
    


    try {

        const result = await Order.create(OrderData)

        await Cart.updateOne({ user: OrderData.user }, { $set: { items: [] } })

        OrderData.items.forEach(async (item) => {
            await Product.updateOne(
                { _id: item.product },
                { $inc: { stock : -item.quantity } }
            );
        });

        if(OrderData.coupon?.code){
            // console.log(OrderData.coupon.usage);
            
            await User.updateOne(
                { _id: OrderData.userusername },
                { $set: { [`couponApplyed.${OrderData.coupon.code}`]: OrderData.coupon.usage+1 } }
            )
        }



        if(result){

            const insertesData = await Order.findById(result._id).populate('items.product')
            .populate('items.product.category','name')
            .populate('user')

            // console.log(insertesData);
            

            return res.status(200).json(insertesData)
        }
            return res.status(400).json('Order Not confirmed')

    } catch (error) {

        return res.status(400).json(error.message)
    }
}



module.exports.getOders = async (req, res) => {

    const user = req.params.id || null

    try {
        let result = []


        
        if(user!=='undefined'){
            result = await Order.find({user}).populate('items.product').populate('items.product.category','name')
        }else{
            result = await Order.find({}).populate('items.product').populate('user','username')
        }
        

        if(result){
            return res.status(200).json(result)
        }
            return res.status(400).json('No Orders')

    } catch (error) {

        return res.status(400).json(error.message)
    }
}


module.exports.updateOrderStatus = async (req, res) => {

    const { id:_id, value:order_status } = req.body

    console.log('jkasdhfksalh');
    

    
    
    try {
        
        let result = ''

        if(order_status=='Delivered'){

            // This line is not working as expected because it uses $set twice
            // The second $set overwrites the first one, so only payment_status is updated
            // To update both fields, we should use a single $set operation
            result = await Order.updateOne(
                { _id },
                { $set: { order_status, payment_status: 'completed' } }
            )

        }else{
            result = await Order.updateOne({ _id },{ $set:{ order_status } })
            
        }
        
        // console.log(result);

        if(result.modifiedCount>0){

            return res.status(200).json('Successfully updated')

        }else{

            return res.status(400).json('Somting went wrong')
        }
        
        
    } catch (error) {

        return res.status(400).json(error.message)
    }
    
}

module.exports.cancelOrder = async (req, res) => {

    const { cancelId } = req.body

    
    
    try {

        const order = await Order.findOne({ _id: cancelId });
        
        const result = await Order.updateOne({ _id:cancelId },{ $set:{ order_status:'Cancelled',payment_status:'cancelled' } })
        
        console.log(result);

        if(result.modifiedCount>0){

            // Create a new request object for wallet update
            if(order.payment_status==='completed'){

                const walletReq = {
                    body: {
                        amount: order.price.grandPrice,
                        status: 'cancelled',
                        transaction_id: `REFUND-${order._id}`,
                        type: 'credit',
                        description: `Refund for order ${order._id}`,
                        payment_method:order.payment_method
                    },
                    user: req.user
                };

                // Create a new response object
                const walletRes = {
                    status: function(code) {
                        return {
                            json: function(data) {
                                if (code === 200) {
                                    return res.status(200).json('Order cancelled and amount refunded');
                                } else {
                                    return res.status(code).json(data);
                                }
                            }
                        };
                    }
            }
            // Process wallet update
            await addCoinToWallet(walletReq, walletRes);

            };

            return res.status(200).json('Successfully Cancelled')

        }else{

            return res.status(400).json('Somting went wrong')
        }
        
        
    } catch (error) {

        return res.status(400).json(error.message)
    }
    
}


// module.exports.updateOrderStatus = async (req, res) => {

//     const { orderId,status,paymentStatus } = req.body

//     try {

//         const result = await Order.updateOne({_id:orderId},{ $set:{ order_status:status,payment_status:paymentStatus } })

//         if(result.modifiedCount>0){
//             return res.status(200).json('Successfully updated')
//         }

//     } catch (error) {

//         return res.status(400).json(error.message)
//     }
// }

module.exports.returnOrder = async (req, res) => {
    try {
        const { cancelId } = req.body;
        
        // Get order details
        const order = await Order.findOne({ _id: cancelId });
        if (!order) {
            return res.status(404).json('Order not found');
        }

        // Update order status
        const result = await Order.updateOne(
            { _id: cancelId },
            { $set: { order_status: 'Cancelled', payment_status: 'cancelled' } }
        );

        if (result.modifiedCount > 0) {
            // Create a new request object for wallet update
            if(order.payment_status==='completed'){

                const walletReq = {
                    body: {
                        amount: order.price.grandPrice,
                        status: 'cancelled',
                        transaction_id: `REFUND-${order._id}`,
                        type: 'credit',
                        description: `Refund for order ${order._id}`,
                        payment_method:order.payment_method
                    },
                    user: req.user
                };

                // Create a new response object
                const walletRes = {
                    status: function(code) {
                        return {
                            json: function(data) {
                                if (code === 200) {
                                    res.status(200).json('Order cancelled and amount refunded');
                                } else {
                                    res.status(code).json(data);
                                }
                            }
                        };
                    }
            }
            // Process wallet update
            await addCoinToWallet(walletReq, walletRes);

            };

        } else {
            return res.status(400).json('Something went wrong while cancelling order');
        }
    } catch (error) {
        console.error('Return order error:', error);
        return res.status(500).json(error.message);
    }
}

module.exports.getAllOrders = async (req, res) => {

    try {
        const orders = await Order.find({}).populate('items.product').populate('user','username')

        return res.status(200).json(orders)

    } catch (error) {

        return res.status(400).json(error.message)
        
    }
}

