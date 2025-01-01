const Collection = require('../../models/other/collectionModel')

// uspert collection
module.exports.upsertCollection = async(req,res)=>{

    

    const { name,_id } = req.body

    const data = req.body

    const filter = _id ? { _id } : { name }

    const isListed = req.body.isListed || true
    const updatedAt = Date.now()
    const createdAt = req.body.createdAt || Date.now()

    try {
        
        const result = await Collection.updateOne( filter, { $set: { name,createdAt,updatedAt,isListed,...data } }, { upsert: true, new: true })
        
        if(result.modifiedCount){
            return res.status(200).json({mission:true,message:'successfully updated'})
            
        }else{
            
            return res.status(200).json({mission:true,message:'successfully Created'})
        }


      } catch (error) {
        return res.status(500).json({mission:false,message: error.message })
      }
}


// get collections
module.exports.getCollections = async(req,res)=>{

    try {

        const collection = await Collection.find({}).populate('category','name')
        
        if(collection.length<=0){
            res.status(500).json({mission:false,message:'empty categories',data:[]})
        }else{
            res.status(200).json({mission:true,message:'successfull',data:collection})
        }
        
    } catch (error) {
        return res.status(500).json({mission:false,message: error.messgae }) 
    }

}


// upadte of category
module.exports.updateCollection = async(req,res)=>{

    const { uniqeID,updateBool,action } = req.body
    
    try {
        if(action==='access'){

            
            
            const updatedtatus = await Collection.updateOne({ _id:uniqeID },{ isListed:updateBool })

            if(updatedtatus.modifiedCount>0){

                return res.status(200).json({mission:true,message:'successfully updated',uniqeID:uniqeID,action})
            }
            return res.status(500).json({mission:false,message:'nothing updated'}) 
            
        }else if(action==='delete'){
            
                const result = await Collection.findByIdAndDelete(uniqeID)

                
                return res.status(200).json({mission:true,message:'successfully deleted',uniqeID:uniqeID,action})
        }

    } catch (error) {

        return res.status(500).json({mission:false,message: error.messgae }) 
    }

}


// get CAtegory Collection
module.exports.getCAtegoryCollection = async(req,res)=>{

    const id = req.params.id

    // console.log(id);
    

    
    
    try {
        
        const Collections = await Collection.find({  category:id }).populate({ path: 'category', select: 'name' }).populate({ path: 'products' })
        // console.log(Collections);

        
        if(Collections.length<=0){

            res.status(500).json({mission:false,message:'empty categories',data:[]})

        }else{

            if(Collections){

                res.status(200).json({mission:true,message:'successfull',data:Collections})

            }

        }
        
    } catch (error) {
        return res.status(500).json({mission:false,message: error.messgae }) 
    }

}


module.exports.getAllCollection = async(req,res)=>{
    
    // const _id = req.params.id
    
    try {
            const productDetails = await Collection.find({}).populate('category','name')

            // console.log(productDetails);
            


            if(productDetails){

                return res.status(200).json(productDetails)
            }

            return res.status(500).json('no collection found') 

    } catch (error) {

        return res.status(500).json(error.message) 
    }

}