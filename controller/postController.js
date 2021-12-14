const Post = require('../models/postModel');

exports.getAllPosts = async (req,res,next) => {
    const posts = await Post.find()
    res.status(200).json({
        status: 'success' ,
        result: posts.length,
        data:{
            posts
        }
    });
}

exports.getOnePost = async (req,res,next) =>  {
    const id = req.params.id ;
    const post = await Post.findById(id);
    res.status(200).json({
        status:'success',
        post
    })
}

exports.createPost = async (req,res,next) => {
    const post = await Post.create(req.body);
    res.status(201).json({
        status:'success'
    })
}

exports.updatePost = async (req,res,next) => {
    const post = await Post.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators: true
    });

    res.status(201).json({
        status:'successsfully updated'
    });
}

exports.deletePost = async (req,res,next) => {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: 'successfully delete post'
    })
}