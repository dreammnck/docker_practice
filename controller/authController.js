const User = require('../models/userModel');
const bcypt = require("bcryptjs");

const signUp = async (req,res,next) => {
    const {password,username} = req.body;
    const hashPassword = await bcypt.hash(password,12);

    const newUser = await User.create({
        username:username,
        password:hashPassword
    });

    req.session.user = newUser;
    
    res.status(201).json({
        status: 'successfully login',
        newUser
    })
}

const login = async (req,res,next) => {
 
    const {username , password} = req.body;
    const user = await User.findOne({
        username:username
    });

    if(!user) {
        res.status(404).json({
            status : "fail, user not found"
        })
    }

    const validPassword = await bcypt.compare(password,user.password);

    if(! validPassword) {
        res.status(400).json({
            status: 'Invalid username'
        })
    }

    req.session.user = user.username;

    res.status(200).json({
        status: "successfully log in"
    })
}

module.exports = {
    signUp,
    login,
}

