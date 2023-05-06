const express = require("express")
const userRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const UserModel = require("../models/userModel")

userRouter.get("/", async (req, res) => {
    try {
        const data = await UserModel.find()
        res.send(data)
    } catch (e) {
        res.send(e)
    }
})

userRouter.post("/register", async (req, res) => {
    const { name, email, password, isAdmin } = req.body
    console.log(req.body);
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                let ExistingUser = await UserModel.findOne({ email: email })
                if (ExistingUser) {
                    res.send("User Already Exists, Try Login!")
                } else {
                    const newUser = new UserModel({ name, email, password: hash, isAdmin })
                    await newUser.save()
                    res.status(201).send({ msg: "New User Added", user: newUser })
                }
            }
        })
    } catch (e) {
        console.log(e);
        res.send(`Registration Error: - ${e}`)
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        let User = await UserModel.find({ email: email })
        if (User.length > 0) {
            bcrypt.compare(password, User[0].password, (err, result) => {
                if (result) {
                    let token = jwt.sign({ userId: User[0]._id }, process.env.key);
                    res.status(201).send({ msg: `Login Successfull | Welcome ${User[0].name}`, token: token });
                } else {
                    res.send({ msg: "Wrong Password" })
                }
            })
        } else {
            res.send({ msg: `Email ${email} does not Exist. Try Registering` })
        }
    } catch (e) {
        res.send({ msg: "Error", reason: e })
    }
})
module.exports = userRouter