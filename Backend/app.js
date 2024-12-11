const express = require('express')
const dotenv = require('dotenv');
const {connectDB} = require('./db/db');
const app = express();

dotenv.config();
const PORT = process.env.PORT;

const { userRouter } = require('./routes/user.route');

app.use('/user', userRouter);

app.use(express.json());

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
