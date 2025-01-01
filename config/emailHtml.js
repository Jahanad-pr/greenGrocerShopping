exports.html = (code)=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transmit Security Verification</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #bfcc72, #a9c3de); font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 50vh;border-radius: 22px;">
    <div style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); max-width: 500px; width: 80%; margin: 20px; padding: 40px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.2);">
        <!-- Logo -->
        <div style="margin-bottom: 32px;">
            <img style="width:40%;" src="https://i.ibb.co/KxV0mCm/main.png" alt="main" border="0">
        </div>

        <!-- Header -->
        <h1 style="font-size: 25px; font-weight: bold; margin: 0 0 24px 0; background: linear-gradient(to right, #4f86f7, #7f53ac);background-clip: text; color: transparent;">
            Let's go Green
        </h1>
        
        <!-- Body Text -->
        <div style="color: rgba(75, 85, 99, 0.8); margin-bottom: 32px;color:#000000 ;opacity:0.4">
            <p style="margin: 0;">To complete your login, please enter the One-Time Password (OTP) we’ve sent to your registered mobile number or email. This code helps us verify your identity and keep your account secure. If you haven’t received the code, please check your spam folder or request a new one. Make sure to enter it here within the next few minutes to continue.</p>
        </div>

        <!-- Verification Code -->
        <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; margin-left:auto;margin-right:auto">
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 10px; background: linear-gradient(to right, #4f86f7, #7f53ac); background-clip: text; color: transparent; margin: 0; margin-left:auto;margin-right:auto">
                ${code}
            </p>
        </div>

        <!-- Info Text -->
        <div style="margin-bottom: 32px; color: #4B5563;">
            <p style="margin: 0;">This code will securely sign you up using</p>
            <p style="color: #3B82F6; font-weight: bold; margin: 0;">yourmail@email.com</p>
        </div>

        <!-- Footer -->
        <div style="color: #9CA3AF; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
        </div>
    </div>
</body>
</html>

`
}