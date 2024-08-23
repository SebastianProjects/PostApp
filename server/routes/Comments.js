const express = require('express');
const router = express.Router();
const { Comments } = require('../models');

const {vaidateToken, validateToken} = require('../middlewares/AuthMiddleware');

router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({ where: { PostId: postId } });
    res.json(comments);
});

router.post('/', validateToken, async (req, res) => {
    const comment = req.body;
    comment.username = req.user.username;
    const newComment = await Comments.create(comment);
    res.json(newComment);
});

router.delete('/:commentId', validateToken, async (req, res) => {
    const id = req.params.commentId;
    const comment = await Comments.destroy({
        where: {
            id: id,
        },
    });
    res.json(comment)
});

module.exports = router;