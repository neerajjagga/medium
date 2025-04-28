const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// const {rateLimit} = require('express-rate-limit');
const chalk = require("chalk");
const { connectDB } = require("./db/db");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

// const limiter = rateLimit({
//   windowMs : 15 * 60 * 1000, 
//   limit : 100,
//   message: {
//     status: 429,
//     error: "Too Many Requests",
//     message: "You have exceeded the request limit. Please try again later.",
//   },
//   standardHeaders: true,
// })

app.use(express.json());
app.use(cookieParser());
// app.use(limiter);
app.use(
  cors({
    origin: ["http://localhost:5173", "https://medium-git-main-neerajjaggas-projects.vercel.app"],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));



// time log middleware
app.use((req, res, next) => {
  const { url, method, ip, headers, query } = req;
  const timestamp = new Date().toLocaleString();

  const start = Date.now();

  // Log incoming request details
  console.log(chalk.cyan.bold("-------------------------------------------"));
  console.log(chalk.green("🚀 Request Received:"));
  console.log(`🌐 URL: ${chalk.yellow(url)}`);
  console.log(`📦 Method: ${chalk.blue(method)}`);
  console.log(`💻 IP Address: ${chalk.magenta(ip)}`);
  console.log(`🕒 Time: ${chalk.white(timestamp)}`);
  console.log(`🔑 Headers: ${JSON.stringify(headers, null, 2)}`);
  console.log(`🔍 Query Params: ${JSON.stringify(query, null, 2)}`);
  console.log(chalk.cyan.bold("-------------------------------------------"));

  res.on("finish", () => {
    const responseTime = Date.now() - start;

    console.log(chalk.cyan.bold("-------------------------------------------"));
    console.log(chalk.red("✅ Response Sent:"));
    console.log(`🚦 Status Code: ${chalk.green(res.statusCode)}`);
    console.log(`⏱ Response Time: ${chalk.magenta(`${responseTime}ms`)}`);
    console.log(chalk.cyan.bold("-------------------------------------------"));
  });

  next();
});

const { userRouter } = require("./routes/user.route");
const { getStartedRouter } = require("./routes/getStarted.route");
const { blogRouter } = require("./routes/blog.route");
const { connectionRouter } = require("./routes/connection.route");
const { profileRouter } = require("./routes/profile.route");
const { feedRouter } = require("./routes/feed.route");

app.use("/api/auth", userRouter);
app.use("/api/get-started", getStartedRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/connections", connectionRouter);
app.use("/api/profile", profileRouter);
app.use("/api/feed", feedRouter);

//error log middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
      message: "Internal server error",
      error: err.message || err,
  });
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error coming while connecting to DB" + error);
  });
