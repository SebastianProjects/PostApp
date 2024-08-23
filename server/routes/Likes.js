const express = require('express');
const router = express.Router();
const { Likes } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;
    const Like = { PostId: PostId, UserId: UserId };

    const found = await Likes.findOne({
        where: Like
    });
    if (found) {
        await Likes.destroy({
            where: Like
        });;
        res.json({ liked: false });
    } else {
        await Likes.create(Like);
        res.json({ liked: true });
    }
});

module.exports = router;