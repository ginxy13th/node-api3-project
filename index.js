// code away!
const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
const server = express();
const port = 5678;

server.use(express.json());
server.use('/users', userRouter)
server.use('/posts', postRouter)

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({errorMessage: 'Something went wrong'})
})
server.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
})