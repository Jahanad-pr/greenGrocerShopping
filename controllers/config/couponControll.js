const Coupon = require('../../models/other/CouponModel')




module.exports.updateCoupon = async (req, res) => {

    const updateData = req.body
    const { code } = req.body

    
    
    try {
        
        const result = await Coupon.updateOne(
            { code },
            { $set: updateData },
            { upsert: true }
        );
        
        // console.log(result);
        
        

        if(result.modifiedCount){

            return res.status(200).json('Item updated succsffuly')
            
        }else{
            
            return res.status(200).json('Item added succsffuly')
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}



module.exports.getAllCoupons = async (req, res) => {

    try {
        
        const result = await Coupon.find({})
        
        if(result){

            return res.status(200).json(result)
            
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}


module.exports.deleteCoupon= async (req, res) => {

    try {
        
        const result = await Coupon.deleteOne({_id: req.params.code})
        
        if(result){

            return res.status(200).json('Item deleted succsffuly')
            
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}


module.exports.updateCouponAccess= async (req, res) => {

    const { id,state } = req.body

    try {
        
        const result = await Coupon.updateOne({_id: id},{ $set: { isActive: state } })

        console.log(id);
        
        
        if(result){

            return res.status(200).json({mission:true,message:'aceess changed succsffuly',uniqeID:id})
            
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}
