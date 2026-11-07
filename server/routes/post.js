const express = require('express');
const postController = require('../controllers/post');
const { verify } = require("../auth");

const router = express.Router();

router.post("/", verify, postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/my-posts", verify, postController.getMyPosts);

router.get("/:id", postController.getPost);

router.put("/:id", verify, postController.updatePost);

router.delete("/:id", verify, postController.deletePost);

module.exports = router;
