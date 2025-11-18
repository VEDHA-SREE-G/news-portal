//destructing the users property from the models obj and assigning it to a local variable User 
const { users: User } = require('../models');
// jwt - to verify the identity of the user after logged in & to authenticate user
const jwt = require('jsonwebtoken')
//bcryptjs - contains hash algorithm and compare easily --> password security
const bcrypt = require('bcryptjs')
require('dotenv').config()
exports.register = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message : "Username, Email and Password are required"});
        }
        //validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        //test method --> find matches in the specified pattern
        if(!emailRegex.test(email)){
            return res.status(400).json({message : "Invalid email format"});
        }
        const existingUsername = await User.findOne({where : { username }})
        const existingEmail = await User.findOne({where : { email }})
        if(existingUsername){
            return res.status(400).json({message : "Username already exists"})
        }
        if(existingEmail){
            return res.status(400).json({message : "Email already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username,
            email,
            password : hashedPassword
        })
        res.status(201).json({
            message : "user registered successfully",
            user : {
                id : newUser.userID,
                name : newUser.username,
                email : newUser.email
            }
        })
    }
    catch(error){
        res.status(500).json({ message: "Server error during registration" });
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({where : {email}})
        if(!user) return res.status(401).json({message : "Invalid Email"})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(401).json({message : "Invalid Password"})
        const token = jwt.sign({
            id : user.userID,
            username : user.username,
            email : user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn : '1h'
        })
        res.status(200).json({message: "login successful", token, user : {
            id : user.userID,
            name : user.username,
            email : user.email
        }})
    }
    catch(error){
        res.status(500).json({message : "server error during login"})
        console.log(error);
    }
}