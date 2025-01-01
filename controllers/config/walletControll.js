const User = require('../../models/Auth/userModel')
const Transaction = require('../../models/other/transationModel')




module.exports.addCoinToWallet = async (req, res) => {

    console.log(req.body);
    

    const updateData = req.body
    const user = req.user.id
    const { code } = req.body

    
    console.log(updateData);
    
    try {

        let result = []

        if(updateData.status==='completed'||updateData.status==='cancelled'){

            result = await User.updateOne(
                { _id:user },
                { $inc: { 'wallet.amount': updateData.amount }, $set: { 'wallet.createdAt': new Date() } },
                { upsert: true }
            );
        }
        
        const transaction = await Transaction.updateOne(
            { user },
            { 
                $pull: { transactions: { transaction_id: updateData.transaction_id } }
            }
        );

        const pushTransaction = await Transaction.updateOne(
            { user },
            { $push: { transactions: updateData } },
            { upsert: true }
        );
        
        // console.log(result);
        
        

        if(result || pushTransaction){

            return res.status(200).json('Item updated succsffuly')
            
        }else if(pushTransaction){
            
            return res.status(200).json('Item added succsffuly')
        }
            
        return res.status(400).json('Somthing went wrong')

      } catch (error) {

        return res.status(400).json(error.message)

    }
}


module.exports.getUserTransactions = async (req, res) => {

    const user = req.user.id

    // console.log(user);
    

    try {
        const transactions = await Transaction.findOne({user})

        console.log(transactions);
        

        if(transactions)return res.status(200).json(transactions.transactions)

        return res.status(400).json('No Transactions')
    } catch (error) {
        return res.status(400).json(error.message)
    }  
} //getUserTransactions
