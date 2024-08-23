const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const port = 3001;

const db = require('./models');

// Routers
const postRouter = require('./routes/Posts');
app.use('/posts', postRouter);
const commentsRouter = require('./routes/Comments');
app.use('/comments', commentsRouter);
const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter);
const likesRouter = require('./routes/Likes');
app.use('/likes', likesRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
});

