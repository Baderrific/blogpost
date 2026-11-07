const Post = require('../models/Post');
const { errorHandler } = require("../auth");

// only expose the author's username, never email or password
const authorFields = "username";

module.exports.createPost = (req, res) => {

    const { title, content } = req.body || {};

    if (typeof title !== "string" || typeof content !== "string" || title.trim() === "" || content.trim() === "") {

        return res.status(400).send({
            message: "Title and content are required"
        });
    }

    let newPost = new Post({
        title : title,
        content : content,
        author : req.user.id
    });

    return newPost.save()
    .then(post => post.populate("author", authorFields))
    .then(result => res.status(201).send({
        message: "Post was created successfully",
        result: result
    }))
    .catch(error => errorHandler(error, req, res));
};


module.exports.getAllPosts = (req, res) => {

    return Post.find({})
    .sort({ createdAt: -1 })
    .populate("author", authorFields)
    .then(result => {

        return res.status(200).send({
            message: result.length > 0 ? "All Available Posts" : "No Posts Found",
            count: result.length,
            result: result
        });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getMyPosts = (req, res) => {

    return Post.find({ author: req.user.id })
    .sort({ createdAt: -1 })
    .populate("author", authorFields)
    .then(result => {

        return res.status(200).send({
            message: result.length > 0 ? "Your Posts" : "You have no posts yet",
            count: result.length,
            result: result
        });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.getPost = (req, res) => {

    return Post.findById(req.params.id)
    .populate("author", authorFields)
    .then(post => {

        if(post == null) {

            return res.status(404).send({
                message: "Post does not exist"
            });
        }

        return res.status(200).send({ result: post });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.updatePost = (req, res) => {

    const { title, content } = req.body || {};

    if (typeof title === "undefined" && typeof content === "undefined") {

        return res.status(400).send({
            message: "Provide a title or content to update"
        });
    }

    if ((typeof title !== "undefined" && (typeof title !== "string" || title.trim() === ""))
        || (typeof content !== "undefined" && (typeof content !== "string" || content.trim() === ""))) {

        return res.status(400).send({
            message: "Title and content must not be empty"
        });
    }

    return Post.findById(req.params.id)
    .then(post => {

        if(post == null) {

            return res.status(404).send({
                message: "Post does not exist"
            });
        }

        // only the author can edit their own post
        if(post.author.toString() !== req.user.id) {

            return res.status(403).send({
                message: "Action Forbidden. You can only update your own posts"
            });
        }

        if(typeof title !== "undefined") post.title = title;
        if(typeof content !== "undefined") post.content = content;

        return post.save()
        .then(updatedPost => updatedPost.populate("author", authorFields))
        .then(result => res.status(200).send({
            message: "Post was updated successfully",
            result: result
        }));
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.deletePost = (req, res) => {

    return Post.findById(req.params.id)
    .then(post => {

        if(post == null) {

            return res.status(404).send({
                message: "Post does not exist"
            });
        }

        // the author can delete their own post, an admin can delete any post
        if(post.author.toString() !== req.user.id && !req.user.isAdmin) {

            return res.status(403).send({
                message: "Action Forbidden. You can only delete your own posts"
            });
        }

        return post.deleteOne()
        .then(() => res.status(200).send({
            message: "Post was deleted successfully"
        }));
    })
    .catch(error => errorHandler(error, req, res));
};
