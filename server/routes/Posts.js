const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/MulterMiddleware')

router.get('/', validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({
        include: [Likes]
    });
    const likedPosts = await Likes.findAll({
        where: {
            UserId: req.user.id
        },
    });
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

router.get('/byId/:id', validateToken, async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id, { include: [Likes] });
    const UserId = req.user.id;
    const Like = { PostId: id, UserId: UserId };
    const liked = await Likes.findOne({
        where: Like
    });
    res.json({ post: post, liked: liked });
});

router.get('/byUserId/:id', validateToken, async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({ where: { UserId: id }, include: [Likes] });
    res.json(listOfPosts);
});

router.post("/", validateToken, upload.single('image'), async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.image = req.file ? req.file.filename : null;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

router.delete('/byId/:id', validateToken, async (req, res) => {
    const id = req.params.id;
    const post = Posts.destroy({
        where: {
            id: id,
        },
    });
    res.json(post)
});

module.exports = router;