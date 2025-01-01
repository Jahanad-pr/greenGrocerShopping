const Address = require('../../models/other/AddressModel')




module.exports.upsertAddress = async (req, res) => {
    const { uniqueID, user, ...otherData } = req.body;

    // Set default values if they are not provided in the request body
    const upserData = {
        ...otherData,
        user,
        isListed: req.body.isListed !== undefined ? req.body.isListed : true,
        updatedAt: Date.now(),
        createdAt: req.body.createdAt || Date.now(),
    };


    const filter = uniqueID || `${user}${Date.now()}` ; // Use _id if it exists, otherwise use the `user` to identify records


    try {
        const result = await Address.updateOne({ uniqueID:filter }, { $set: upserData }, { upsert: true });

        if(result.modifiedCount){

            return res.status(200).json('Successfully updated ');

        }else{
            return res.status(200).json('Successfully added');
        }

    } catch (error) {

        return res.status(400).json(error.message);
    }
}


module.exports.getAdresses = async (req, res) => {

    const _id = req.params.id 


    

    try {
        const result = await Address.find({user:_id})
        

        if(result){

            return res.status(200).json(result)

        }else{

            return res.status(400).json('NO addresses')

        }

    } catch (error) {

        return res.status(400).json(error.message);
    }
}




module.exports.deleteAddress = async (req, res) => {

    const _id = req.params.id 
    const user = req.user.id


    console.log(_id);
    try {
        const result = await Address.findByIdAndDelete({user,_id})


        if(result){

            return res.status(200).json("Successfully deleted")

        }else{

            return res.status(400).json('NO addresses')

        }

    } catch (error) {

        return res.status(400).json(error.message);
    }
}