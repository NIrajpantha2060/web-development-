// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const transporter = require("../config/emailConfig");

// // FORGOT PASSWORD - Send reset email
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     // Find user by email
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       // Don't reveal if email exists or not for security
//       return res.status(200).json({ 
//         message: "If an account with that email exists, a password reset link has been sent." 
//       });
//     }

//     // Generate reset token (valid for 1 hour)
//     const resetToken = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Create reset URL
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     // Email template
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: user.email,
//       subject: "Password Reset - Lift Nepal 🚗",
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//             }
//             .container {
//               max-width: 600px;
//               margin: 0 auto;
//               padding: 20px;
//               background-color: #f9f9f9;
//             }
//             .header {
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               color: white;
//               padding: 30px;
//               text-align: center;
//               border-radius: 10px 10px 0 0;
//             }
//             .content {
//               background: white;
//               padding: 30px;
//               border-radius: 0 0 10px 10px;
//             }
//             .button {
//               display: inline-block;
//               padding: 12px 30px;
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               color: white;
//               text-decoration: none;
//               border-radius: 5px;
//               margin: 20px 0;
//             }
//             .footer {
//               text-align: center;
//               margin-top: 20px;
//               color: #666;
//               font-size: 12px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🚗 Lift Nepal</h1>
//               <p>Password Reset Request</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.username},</h2>
//               <p>We received a request to reset your password for your Lift Nepal account.</p>
//               <p>Click the button below to reset your password:</p>
//               <div style="text-align: center;">
//                 <a href="${resetUrl}" class="button">Reset Password</a>
//               </div>
//               <p><strong>This link will expire in 1 hour.</strong></p>
//               <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
//               <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
//               <p style="color: #666; font-size: 14px;">
//                 If the button doesn't work, copy and paste this link into your browser:<br>
//                 <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
//               </p>
//             </div>
//             <div class="footer">
//               <p>© 2025 Lift Nepal. All rights reserved.</p>
//               <p>This is an automated email, please do not reply.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ 
//       message: "If an account with that email exists, a password reset link has been sent." 
//     });

//   } catch (error) {
//     console.error("Forgot password error:", error);
//     res.status(500).json({ message: "Error sending reset email. Please try again later." });
//   }
// };

// // RESET PASSWORD - Update password with token
// const resetPassword = async (req, res) => {
//   const { token, newPassword } = req.body;

//   if (!token || !newPassword) {
//     return res.status(400).json({ message: "Token and new password are required" });
//   }

//   if (newPassword.length < 6) {
//     return res.status(400).json({ message: "Password must be at least 6 characters long" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user
//     const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update password
//     await user.update({ password: hashedPassword });

//     // Send confirmation email
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: user.email,
//       subject: "Password Changed Successfully - Lift Nepal 🚗",
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               line-height: 1.6;
//               color: #333;
//             }
//             .container {
//               max-width: 600px;
//               margin: 0 auto;
//               padding: 20px;
//               background-color: #f9f9f9;
//             }
//             .header {
//               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//               color: white;
//               padding: 30px;
//               text-align: center;
//               border-radius: 10px 10px 0 0;
//             }
//             .content {
//               background: white;
//               padding: 30px;
//               border-radius: 0 0 10px 10px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>🚗 Lift Nepal</h1>
//               <p>Password Changed Successfully</p>
//             </div>
//             <div class="content">
//               <h2>Hello ${user.username},</h2>
//               <p>Your password has been successfully changed.</p>
//               <p>If you did not make this change, please contact our support team immediately.</p>
//               <p>You can now log in with your new password.</p>
//             </div>
//             <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
//               <p>© 2025 Lift Nepal. All rights reserved.</p>
//             </div>
//           </div>
//         </body>
//         </html>
//       `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: "Password has been reset successfully" });

//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(400).json({ message: "Invalid reset token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
//     }
    
//     console.error("Reset password error:", error);
//     res.status(500).json({ message: "Error resetting password. Please try again later." });
//   }
// };

// module.exports = { forgotPassword, resetPassword };



const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/emailConfig");

// FORGOT PASSWORD - Send reset email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Email not registered - show error
      return res.status(404).json({ 
        message: "This email is not registered in Lift Nepal" 
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email template
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset - Lift Nepal 🚗",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Lift Nepal</h1>
              <p>Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Hello ${user.username},</h2>
              <p>We received a request to reset your password for your Lift Nepal account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Lift Nepal. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: "If an account with that email exists, a password reset link has been sent." 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error sending reset email. Please try again later." });
  }
};

// CHANGE PASSWORD - Change password for authenticated user
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All password fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "New password and confirmation do not match" });
  }

  // Validate new password: minimum 8 characters, at least one capital letter
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one capital letter" });
  }

  try {
    // Find user
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedNewPassword });

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Changed Successfully - Lift Nepal 🚗",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Lift Nepal</h1>
              <p>Password Changed Successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${user.username},</h2>
              <p>Your password has been successfully changed.</p>
              <p>If you did not make this change, please contact our support team immediately.</p>
              <p>You can now log in with your new password.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Lift Nepal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Error changing password. Please try again later." });
  }
};

// RESET PASSWORD - Update password with token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  // Update validation: minimum 8 characters, at least one capital letter
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ message: "Password must contain at least one capital letter" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findOne({ where: { id: decoded.id, email: decoded.email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Changed Successfully - Lift Nepal 🚗",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Lift Nepal</h1>
              <p>Password Changed Successfully</p>
            </div>
            <div class="content">
              <h2>Hello ${user.username},</h2>
              <p>Your password has been successfully changed.</p>
              <p>If you did not make this change, please contact our support team immediately.</p>
              <p>You can now log in with your new password.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Lift Nepal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password has been reset successfully" });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid reset token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired. Please request a new one." });
    }
    
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password. Please try again later." });
  }
};

module.exports = { forgotPassword, resetPassword, changePassword };
