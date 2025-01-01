const nodemailer = require("nodemailer");
const { html } = require('../config/emailHtml')

// Create a transporter object using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devlopersalu@gmail.com",
    pass: "ichs jjrq wtmd sefx",
  },
});


let otpStore = {};






// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
  // Generates a random 6-digit number
};

// Function to send OTP email
exports.sendOTP = async (mail) => {
  const otp = generateOTP();

  // console.log(mail);
  


  // Set up email data with the OTP included
  const mailOptions = {
    from: "devlopersalu@gmail.com",
    to: mail,
    subject: "Log greengrocer with you OTP Code",
    text: `Your OTP is ${otp}`,
    html: html(otp)// HTML body
  };
  // Store OTP with a timestamp and an expiration time of 3 minutes
  otpStore[mail] = { otp, expiresAt: Date.now() + 3 * 60 * 1000 };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP:", otp)
    return { success: true, message: "OTP sent successfully, verify within 3 minutes", messageId: info.messageId };
    
  } catch (error) {
    console.log("Error occurred:", error.message);
    return { success: false, message: "Failed to send OTP" };
    
  }
  

};



// Function to verify the OTP
exports.verifyOTP = (email, userOtp) => {

    const otpData = otpStore[email];
    
    // Check if OTP exists and has not expired
    if (!otpData || otpData.expiresAt < Date.now()) {
        return { success: false, message: "OTP expired or not found" };
    }
    
    // Check if the provided OTP matches the stored one
    if (otpData.otp == parseInt(userOtp, 10)) {
        // OTP verified successfully; remove it from store after verification
      delete otpStore[email];
      
      return { success: true, message: "OTP verified successfully" };
    }
  
    return { success: false, message: "Invalid OTP" };
  };