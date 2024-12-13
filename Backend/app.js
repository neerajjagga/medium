const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const chalk = require('chalk');
const {connectDB} = require('./db/db');
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// time log middleware
app.use('/', (req, res, next) => {
    const { url, method, ip, headers, query } = req;  // Destructure necessary properties
    const timestamp = new Date().toLocaleString();
    
    // Store the start time for response time calculation
    const start = Date.now();

    // Log incoming request details
    console.log(chalk.cyan.bold('-------------------------------------------'));
    console.log(chalk.green('🚀 Request Received:'));
    console.log(`🌐 URL: ${chalk.yellow(url)}`);
    console.log(`📦 Method: ${chalk.blue(method)}`);
    console.log(`💻 IP Address: ${chalk.magenta(ip)}`);
    console.log(`🕒 Time: ${chalk.white(timestamp)}`);
    console.log(`🔑 Headers: ${JSON.stringify(headers, null, 2)}`);
    console.log(`🔍 Query Params: ${JSON.stringify(query, null, 2)}`);
    console.log(chalk.cyan.bold('-------------------------------------------'));

    // Capture the response once the request is processed
    res.on('finish', () => {
        const responseTime = Date.now() - start;  // Calculate response time

        console.log(chalk.cyan.bold('-------------------------------------------'));
        console.log(chalk.red('✅ Response Sent:'));
        console.log(`🚦 Status Code: ${chalk.green(res.statusCode)}`);
        console.log(`⏱ Response Time: ${chalk.magenta(`${responseTime}ms`)}`);
        console.log(chalk.cyan.bold('-------------------------------------------'));
    });

    next();  // Pass the request to the next middleware
});

const { userRouter } = require('./routes/user.route');
const {blogRouter} = require('./routes/blog.route');
const {connectionRouter} = require('./routes/connection.route');

app.use('/api/auth', userRouter);
app.use('/api', blogRouter);
app.use('/api', connectionRouter);

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
