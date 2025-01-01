const Cart = require('../../models/other/cartModel')




module.exports.addtoCart = async (req, res) => {


    const { cartData, userId } = req.body

    console.log(req.body);
    


    try {

        const result = await Cart.updateOne(
            { user: userId },
            { $push: { items: cartData } },
            { upsert: true }
        );
        

        if(result){

            return res.status(200).json('Item added succsffuly')
        }
            
        return res.status(400).json('Somthing went wrong')

    } catch (error) {

        return res.status(400).json(error.message)

    }
}


module.exports.checkPorductInCart = async (req, res) => {

   const id = req.user.id

    const prductID  = req.params.prductID



    try {


        const result = await Cart.findOne(
            { user: id, items: { $elemMatch: { product: prductID } } }, // Query to match items.product
            { items: { $elemMatch: { product: prductID } } } // Projection to include only the matching item
        );

        
        

        if(result){

            return res.status(200).json(result.items[0])
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}


module.exports.getCartItems = async (req, res) => {

    const id = req.user.id

    try {


        const result = await Cart.findOne({ user: id }).populate({
            path: 'items.product',
            match: { stock: { $gt: 0 } },
            populate: { path: 'category', select: 'name' }
        })


        if (result) {

            return res.status(200).json(result)
        }

        return res.status(400).json('Somthing went wrong')

    } catch (error) {

        return res.status(400).json(error.message)

    }
}



module.exports.updateCartITem = async (req, res) => {

    // console.log('jshalkd');
    

    const id = req.user.id
    const productId = req.params.id
    const { action,seletor } = req.body

    console.log(action);
    
 
     try {
        let result = ''
 
        if(action==='remove'){
            result = await Cart.updateOne(
               { user: id },
               { $pull: { items: { product: productId } } }
           )
           if(result){
   
               return res.status(200).json('Item removed successfully')
           }

        }else{
            result = await Cart.updateOne(
                { user: id, "items.product": productId },
                { $set: { "items.$.quantity": seletor } }
            )
            if(result){
   
                return res.status(200).json('Item Quantity Changed')
            }
        }

        //  console.log(result);
         
 
             
         return res.status(400).json('Somthing went wrong')
 
       } catch (error) {
 
         return res.status(400).json(error.message)
 
     }
 }
