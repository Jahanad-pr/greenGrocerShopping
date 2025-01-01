const User = require("../models/Auth/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTP, verifyOTP } = require("../config/sendOTP");


const SECRET_KEY = process.env.SECRET_KEY || "secret";

// Create a new user
module.exports.createAUser = async (req, res) => {
  const { email, password, username, place, gender, phone, profileUrl } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(profileUrl);
  

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    place,
    gender,
    phone,
    createdAt: Date.now(),
    isVerified: false,
    isListed: true,
    profileUrl,
    couponApplyed:{}
  });

  try {
    const newUserData = await newUser.save();
    res.status(200).json('ahte');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// if user exits 
module.exports.isUerExist = async(req, res)=>{

  const { email } = req.body;
  try {
    
      const userData = await User.findOne({email})
    
      if(userData){
    
        return res.status(500).json('This Email already taken')
    
      }else{
    
        return res.status(200).json({forWord:true})
    
      }
    
  } catch (error) {
    return res.status(500).json(error)
  }

  

}

// Login user
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Wrong Password or email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {

      return res.status(401).json({ message: "Wrong Password or email" });

    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "9h" });
    res.cookie("userToken", token, {
      httpOnly: true, // Secure against client-side JS access
      maxAge: 9900000, // 9 hours
      sameSite: "None", // Needed for cross-origin cookies
      secure: true, // Set to true only in production (for HTTPS)
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google login or signup
module.exports.googleLog = async (req, res) => {
  const { email, password, username, phone, place ,gender  } = req.body;

  try {
    const existingUser = await User.findOne({ email:`${email}.gmail` });

    const verifying = req.body?.gender || existingUser?.gender

    if (existingUser) {

      const updatData = {...req.body,isVerified:verifying?true:false,email:`${email}.gmail`}

      const update = await User.updateOne({email:`${email}.gmail`},{$set:updatData})

      if(verifying){

        const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
          expiresIn: "1h",
        });
  
        res.cookie("userToken", token, {
          httpOnly: true, // Secure against client-side JS access
          maxAge: 9900000, // 9 hours
          sameSite: "None", // Needed for cross-origin cookies
          secure: true, // Set to true only in production (for HTTPS)
        });
      }


      if(update.modifiedCount>0){

  
        return res.status(200).json({data:{...existingUser,isVerified:verifying?true:false},isNew:false});

      }else{

        return res.status(200).json({data:existingUser,isNew:false});

      }
      

    } else {

      const newUser = await User.create({
        email:`${email}.gmail`,
        googleMail:email,
        password,
        username,
        phone,
        place,
        gender,
        createdAt: Date.now(),
        isListed: true,
      });

      return res.status(200).json({data:newUser,isNew:true});
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user data
module.exports.getUserData = async (req, res) => {
  
  if (req.user) {

    const { id } = req.user;

    try {
      const user = await User.find({ _id: id });

      if (!user || user.length <= 0) {

        res.clearCookie('userToken')
        return res.status(404).json({ message: "User not found" });

      }

      if (user[0].isListed) {

        res.status(201).json({ verified: true, user });

      } else {

        res.clearCookie('userToken')
        res.status(201).json({ verified: false, user });

      }

    } catch (error) {

      res.status(400).json({ message: error.message });

    }
  }
};

// Get OTP
module.exports.getOTP = async (req, res) => {
  const { mail } = req.body;
  // console.log(mail);
  
  const message = await sendOTP(mail);
  res.status(message ? 201 : 400).json(message.message);
};

// Confirm OTP
module.exports.conformOTP = async (req, res) => {
  const { mail, otp } = req.body;
  const { success, message } = verifyOTP(mail, otp);

  res.status(success ? 201 : 400).json(message);
};

// Update user verification
module.exports.updateVerification = async (req, res) => {
  const { phone, gender, place, uniqueId } = req.body;

  try {
    const updatedData = await User.updateOne({ _id: uniqueId }, { phone, gender, place, isVerified: true });
    res.status(200).json({ message: "User updated successfully", updatedData });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating user", error: error.message });
  }
};


module.exports.logoutUser = async(req,res)=>{

  const { id } = req.body

  console.log(id);
  

  try {

    if(id){

      res.clearCookie('userToken')

      res.status(200).json({forWord:true})

    }else{
      res.status(401).json('Somethng went wrong')
    }

    
  } catch (error) {
    res.status(500).json(error.message)
  }

}



// Create a new user
module.exports.updateProfile = async (req, res) => {

  const formData = req.body;
  const { _id } = req.body;

  try {

    const updateStatus = await User.updateOne({ _id },{$set:formData})

    if(updateStatus.modifiedCount){
      
      res.status(200).json('Updated successfully');

    }else{
      res.status(400).json('Nothing Updated');
    }

  } catch (error) {

    res.status(400).json( error.message );
  }
};


// check password match or not
module.exports.matchPassword = async (req, res) => {

  const { password,_id } = req.body;


  
  try {
    
    const UserData = await User.findOne({ _id },{ password:1,_id:0 })
    
    const isPasswordValid = await bcrypt.compare(password, UserData.password);

    if(isPasswordValid){

      res.status(200).json('Passowrd confirmed ,Reset your passowrd');

    }else{

      res.status(400).json('Password do not match');

    }

  } catch (error) {

    res.status(400).json({ message: error.message });

  }
};



// Reset password
module.exports.resetPassword = async (req, res) => {

  const { password,_id,email } = req.body;

  const filter = { email } || { _id }    

  console.log('hhhhhhhhhhhhhsd');
  

  
  
  const UserData = await User.findOne( filter ,{ password:1,_id:0 })
  
  
  const isPasswordSame = await bcrypt.compare(password, UserData.password);
  
  if(isPasswordSame){
    return res.status(400).json('Enterd Password Is Same');
  }
  
  try {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const updateStatus = await User.updateOne(filter,{$set:{ password:hashedPassword }})
    
    // console.log(updateStatus);

    if(updateStatus.modifiedCount){

      return res.status(200).json('Reset password successfully');

    }


    
  } catch (error) {

    return res.status(400).json(error.message);
    
  }
  

};



// add the location
module.exports.addLocation = async (req, res) => {

  const { locationData,position,_id } = req.body;

  
  

  
  try {
    
    const updateData = await User.updateOne(
      { _id },
      { $set: position === 'first' 
          ? { 'location.first': locationData }
          : position === 'second'
          ? { 'location.second': locationData }
          : { 'location.third': locationData }
      }
    );
    
    if(updateData.modifiedCount){
      
      return res.status(200).json('Location Updated successfully');
      
    }else if(updateData.upsertedCount){
      
    return  res.status(200).json('Location added successfully');
      
    }
    
    return res.status(400).json('Somthing went wrong');

  } catch (error) {
    console.log(error.message);

    return res.status(400).json({ message: error.message });

  }
};


// New route to find the top 8 users based on orders and wallet
module.exports.getTopUsers = async (req, res) => {
    try {
        const topUsers = await User.aggregate([
            {
                $lookup: {
                    from: 'orders', // Assuming orders collection is named 'orders'
                    localField: '_id',
                    foreignField: 'user',
                    as: 'userOrders'
                }
            },
            {
                $project: {
                    userId: '$_id',
                    username: 1,
                    email: 1, // Include email in the projection
                    wallet: 1,
                    orders: { $size: '$userOrders' },
                    profileUrl:1
                }
            },
            {
                $sort: { orders: -1, wallet: -1 } // Sort by number of orders and wallet
            },
            {
                $limit: 8 // Limit to top 8 users
            }
        ]);

        return res.status(200).json(topUsers);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching top users', error });
    }
};