const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');


router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });
    if (user) {
        res.json({ error: 'User already exists!' });
    } else {
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({ username: username, password: hash, });
            res.json("Success");
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });

    if (user) {
        //Crypt password to database
        bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                const accessToken = sign({ username: user.username, id: user.id }, process.env.JWT_SECRET);
                res.json({ token: accessToken, username: user.username, id: user.id });
            } else {
                res.json({ error: "Wrong username or password!" });
            }
        });
    } else {
        res.json({ error: "User doesn't exist!" });
    }
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get('/info/:id', validateToken, async (req, res) => {
    const id = req.params.id;
    const info = await Users.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    res.json(info);
});

module.exports = router;