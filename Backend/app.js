const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const {connectDB} = require('./db/db');
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// time log middleware
app.use('/', (req, res, next) => {
    const date = new Date();
    console.log(`Req coming for ${req.url}, method is ${req.method}, ip is ${req.ip} at time : ${date.toLocaleString()}`);
    next();
})

const { userRouter } = require('./routes/user.route');
const {blogRouter} = require('./routes/blog.route')

app.use('/api/auth', userRouter);
app.use('/api', blogRouter);



//error log middleware
app.use('/', (err, req, res, next) => {
    res.status(500).json({
        message : "Internal server error",
        Error : err
    });
    next();
})

connectDB()
.then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is listening on port : ${PORT}`);
    }) 
})
.catch(error => {
    console.log("Error coming while connecting to DB" + error);
})
