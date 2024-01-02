const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const Token = require('../models/tokenModel')
const crypto = require("crypto")

// Generate Token
const generateToken = (id) =>
{
    return jwt.sign({ id },process.env.JWT_SECRET, {expiresIn:
    "1d" });
  
};

 
// Register User
const registerUser = asyncHandler( async(req,res) =>
{
    const {name,email,password} =  req.body;
    
    //Validation

    if(!name || !email || !password)
    {
        res.status(400)

        throw new Error("Please fill all required fields")
    }

    if(password.length < 6)
    {
        res.status(400)
        throw new Error("Password must be up to 6 characters")
    }

    // Check Email exists
    const userExists =  await User.findOne({email});

    if(userExists)
    {
        res.status(400)

        throw new Error('Email has already registered')
    }
   

    // Create new User
    const user = await User.create({
        name,
        email,
        password
    })

     // Generate Token
     const token = generateToken(user._id);

    //  Send HTTP-Only Cookie
    res.cookie("token", token, {
        path:"/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),    // 1day
        sameSite: 'none',
        secure: true 
    });

    if (user) 
    {
        const {_id,name, email,photo,phone,bio} = user

        res.status(201).json(
            {
                _id,
                name,
                email,
                photo,
                phone,
                bio,
                token
            })
    } else{
        res.status(400)

        throw new Error("Invalid user Data")
    }

} );

// Login User

const loginUser = asyncHandler( async  (req,res) =>
{
   const {email,password} = req.body;

//    Validate the request
    if(!email || !password)
    {
        res.status (400)

        throw new Error("Please add email and Password")
    }
    // Check user exists
    const user = await User.findOne({email})
   
    if(!user)
    {
        res.status(400)

        throw new Error('User Not Found, Please Signup')
    }

    // User exist, Check if Password is Correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password);
   
    // Generate Token
    const token = generateToken(user._id);

    //  Send HTTP-Only Cookie
    res.cookie("token", token, {
        path:"/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),    // 1day
        sameSite: 'none',
        secure: true 
    });
    
    if(user && passwordIsCorrect)
    {
        const {_id,name, email,photo,phone,bio} = user

        res.status(200).json(
        {
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        });


    } else{
        res.status(400)

        throw new Error("Invalid Email or Password")
    }


}) 

const logoutUser = asyncHandler( async (req,res) =>
{
    res.cookie("token", "", {
        path:"/",
        httpOnly: true,
        expires: new Date(Date(0)),    // Now
        sameSite: 'none',
        secure: true 
    });

    return res.status(200).json({
        message: "Successfully Logged out"
    })

} )

// Get User Profile
const getUser = asyncHandler( async(req,res)=>
{
    const user = await User.findById(req.user._id)
    
    if (user)
    {
        const { _id, name, email, photo, phone, bio } = user

        res.status(200).json(
            {
                _id,
                name,
                email,
                photo,
                phone,
                bio
            }
        )
    }else{
        res.status(400)

        throw new Error('User Not Found')
    }
} )


// Get Login Status

const loginStatus = asyncHandler(async(req,res)=>
{

    const token = req.cookies.token;

    if(!token)
    {
        res.json(false)
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if(verified)
    {
        res.json(true)
    }

    res.send("Login Status")
})


// Update User
const updateuser = asyncHandler( async (req,res)=>
{
    const user = await User.findById(req.user._id)

    if(user)
    {
        const {name, email, phone, photo ,bio } = user

        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.photo = req.body.photo || photo;
        user.bio = req.body.bio || bio


        const updatedUser = await user.save()
        
        res.status(200).json({
            _id :updatedUser._id,
            name : updatedUser.name,
            email : updatedUser.email,
            photo : updatedUser.photo,
            phone : updatedUser.phone,
            bio : updatedUser.bio,
        })
    } else{

        res.status(404)

        throw new Error("User not Found")
    }
    
} );

const changePassword = asyncHandler ( async (req,res) =>
{
    const user = await User.findById(req.user._id)

    const {oldPassword, password} = req.body

    if(!user)
    {
        res.status(400)

        throw new Error("User not found, Pleasse Signup")
    }

    // Validate
    if(!oldPassword || !password )
    {
        res.status(401)

        throw new Error('Please add new and old Password')
    }

    // check if Password Password correct

    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

    if( oldPassword === password )
    {
        res.status(401)
        throw new Error ("You have Entered The same old and new Password")
    }


    if(user && passwordIsCorrect)
    {
        user.password = password

        await user.save()

        res.status(200).send("Password Change successful")
    } else {

        res.status(404)
        throw new Error("Old Password is Incorrect")
    }

} );


const forgotPassword = asyncHandler ( async(req,res) =>
{
    const {email} = req.body

    const user = await User.findOne({email});

    if(!user)
    {
        res.status(404)
        throw new Error ("User doesn't Exist")
    }

    // Create reset Token

    let resetToken = crypto.randomBytes(32).toString("hex") + user._id

    // Hash token before saving to db

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    console.log(hashedToken);

    res.send("I got Password")


} )

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    loginStatus,
    updateuser,
    changePassword,
    forgotPassword
};

