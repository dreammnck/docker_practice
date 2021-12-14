const express = require('express');
const postController = require('../controller/postController');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

router.use(protect);

// localhost3000/posts
router.route("/")
    .get(postController.getAllPosts)
    .post(protect,postController.createPost)

// localhost3000/posts/id
router.route("/:id")
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost)

// app.post("/", callback function)

module.exports = router;