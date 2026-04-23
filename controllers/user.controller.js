import User from "../models/user.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from  "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

 


const registerUser = async (req, res) => {
    // GET DATA
    // Validate
    // Check if user already exists
    // create a user in db
    // create a verification token
    // save token in db
    // send token as email to user
    // send success status to user
    // console.log(req);
    // console.log(typeof req);
    console.log("Registration Started");
    
    const { name, email, password} = req.body;
    
    if( !name || !email || !password){
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    
    try {
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message: "User Already Exists",
            })
        }
        
        const user = await User.create({
            name, 
            email, 
            password,
        });
        console.log(user);
        
        if(!user){
            return res.status(400).json({
                message: "User Registration Failed",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        console.log(token);
        user.verificationToken = token;
        
        await user.save();
        
        
        //Send Mail
        //Create a Transporter using Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        try {
            await transporter.verify();
            console.log("Server is ready to take our messages");
        } catch (err) {
            console.error("Verification failed:", err);
        }
        
        const mailOptions = {
            from: process.env.MAILTRAP_SENDERMAIL,
            to: user.email,
            subject: "PLEASE VERIFY YOUR EMAIL",
            text: `Please click on following link ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
            // html: " ",
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
        }
        
        return res.status(201).json({
            message: "User Registered Successfully",
            success: true,
        });
        console.log("Registration Ended");


        
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(400).json({
            message: error.message || "User not Registered",
            error: error.message,
            success: false,
        });
    }
};

const verifyUser = async ( req, res) => { 
    //Get token from url/params
    //validate
    //find user based on token
    //set isVerified token true
    //remove verification token from db
    //save
    // return response
    console.log("Verification Started 1");
    
    
    const {token} = req.params;
    console.log(token);
    console.log(typeof token);
    
    
    if(!token){
        return res.status(400).json({
            message: "Invalid Token",
        })
    }
    
    try {
        console.log("Verification Started 2");
        
        const user = await User.findOne({verificationToken: token});
        
        if(!user){
            return res.status(400).json({
                message: " Invalid Token or User not found",
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        console.log("Verification Ended");
        return res.status(200).json({
            message: "User Verified SuccessFully",
            success: true, 
        });
        
        
    } catch (error) {
        res.status(400).json({
            message: error.message || "User Verification Failed",
            success: false,
        });
    }
};

const login = async(req, res) => { 
    console.log("Login Started");
    
    //Enter Credentials
    const {email, password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    console.log(email, password);
    
    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message: "Invalid Email and Password",
            });
        }
        console.log(user);
        
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        console.log(isMatch);
        
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Email and Password",
            });
        }
        
        if(!user.isVerified){
            return res.status(400).json({
                message: "Please Verify your Email first",
            });
        }
        
        const token = jwt.sign(
            { id : user._id,  role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "24h"},
        );
        
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 *1000, // 24 hours
        };

        res.cookie("token", token, cookieOptions);
        
        console.log("Login Ended");
        
        res.status(200).json({
            success:true,
            message: "Login Successfully",
            token, 
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });
        
    } catch (error) {
        res.status(400).json({
            message: error.message || "Logion Failed",
            error: error.message,
            success: false,
        });
    }
};


const getMe = async (req, res) => {
    //Get user from req.user
    console.log("Profile Started");
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if(!user){
            return res.status(400).json({
                message: "User not Found",
                success: false,
            });
        }
        
        console.log(user);
        console.log("Profile Ended");

        res.status(200).json({
            success: true,
            user,
        });
        
    } catch ( error ) {
        res.status(400).json({
            message: error.message || " Error in fetching User",
            error: error.message,
            success: false,
        });
    }
}

const logoutUser = async ( req, res) => { 
    console.log("Logout Route started");
    
    
    try {
        console.log("Logout User Entered");
        res.cookie("token", "", {});
        console.log("Logout Route Ended");


        res.status(200).json({
            message: "Logout Successfully",
            success: true,
        });
        
    } catch (error) {
        res.status(400).json({
            message: error.message || " Error in fetching User",
            error: error.message,
            success: false,
        });
    }
}

const forgotUserPassword = async ( req, res) => {
    //Get email from req.body
    //validate
    //find user based on email
    //if user not found return error
    //generate random token
    //save token in db
    //send email to user with token
    
    console.log("Forgot Password Route Started");
    const { email } = req.body;
    
    if( !email ){
        return res.status(400).json({
            message: "Email is required",
            success: false,
        });
    }
    
    try {
        const user = await User.findOne({ email });
        
        if( !user ){
            return res.status(400).json({
                message: "User not Found",
                success: false,
            });
        }
        const token = crypto.randomBytes(30).toString("hex");
        
        user.passwordResetToken = token;
        
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
        console.log(user.passwordResetToken, user.passwordResetExpires);
        
        await user.save();

        //Send Mail
        //Create a Transporter using Nodemailer
        const transporter = nodemailer.createTransport( {
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS
            }
        });
        
        try{
            await transporter.verify();
            console.log("Server is ready to take our messages");
        }catch(error){
            console.error("Server is not ready. Verification failed:", error);
        }
        
        const mailOptions = {
            from: process.env.MAILTRAP_SENDERMAIL,
            to: user.email,
            subject: "PASSWORD RESET",
            text: `PLEASE CLICK ON THE PASSWORD RESET LINK ${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
        }

        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error sending email:", error);
        }
        
        console.log("Forgot Password Route Ended");
        return res.status(200).json({
            message: "Password Reset Email Sent",
            success: true,
        });

    } catch(error) {
        console.error("Forgot Password Error: ", error);
        return res.status(400).json({
            message: error.message || "Error in Forgot Password",
            error: error.message,
            success: false,
        });
    }

};


const resetPassword = async ( req, res) => {
    //Get token from params
    //Get new password from req.body
    //validate
    //find user based on token and token expiry
    //if user not found return error
    //hash new password
    //save new password in db
    //remove reset token and expiry from db
    //send success response

    console.log("Reset Password Route Started");
    const { token } = req.params;
    const { password } = req.body;
    
    if( !token || !password ){
        return res.status(400).json({
            message: "Token and Password are required",
            success: false,
        });
    }
    
    try {
        
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() },
        });
        
        
        if( !user ){
            return res.status(400).json({
                message: "Invalid Token or Token Expired",
                success: false,
            })
        }

        user.password = password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        
        await user.save();
        console.log("Reset Password Route Ended");


        return res.status(200).json({
            message: "Password Reset Successfully",
            success: true,
        });
        
        
    } catch (error) {
        console.error("Reset Password Error: ", error);
        return res.status(400).json({
            message: error.message || "Error in Reset Password",
            error: error.message,
            success: false,
        });
    }

}

export {
    registerUser,
    verifyUser,
    login,
    getMe,
    logoutUser,
    forgotUserPassword,
    resetPassword
};