const express = require("express")
const cors = require("cors")
const connection = require("./config/db")
require("dotenv").config();
const {auth} = require("./middlewares/auth.middleware")

const userRouter = require("./router/userRoute")
const bookRouter = require("./router/bookRoute")
const orderRouter = require("./router/orderRoute")

const app = express()
app.use(cors({origin:"*"}));
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use("/user", userRouter)
app.use(auth)
app.use("/books", bookRouter)
app.use("/", orderRouter)


app.listen(process.env.port, async()=>{
    try{
        await connection;
        console.log("Connected to Mongo Atlas")
    }catch(e){
        console.log(e);
        console.log("Could not connect to DB")
    }
    console.log(`Server started on port ${process.env.port}`);
})