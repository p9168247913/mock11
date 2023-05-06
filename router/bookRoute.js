const express = require("express")
const bookRouter = express.Router()
const BookModel = require("../models/bookModel")
const jwt = require("jsonwebtoken")

require("dotenv").config();

bookRouter.get("/", async (req, res) => {
    if(req.query.category && req.query.author){
        let category = req.query.category
        let author = req.query.author
        try{
            const books = await BookModel.find({ $and: [{ category: category }, { author: author }] })
            res.send(books)
        }catch(e){
            res.status(400).send({ msg: e.message })
        }
        return
    }

    if(req.query.category){
        let category = req.query.category
        try{
            const books = await BookModel.find({category: category})
            console.log(books);
            res.send(books)
        }catch(e){
            res.status(400).send({ msg: e.message })
        }
        return
    }

   
    
    if (!req.query.category) {
        try {

            const books = await BookModel.find()
            res.status(201).send(books)

        } catch (e) {
            res.status(400).send({ msg: e.message })
        }
        return 
    }
 res.send("not went in if contition")

})

bookRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    try {
        const book = await BookModel.find({_id:id});
        res.status(200).send(book);
    } catch (e) {
        res.status(400).send({ msg: e.message })
    }
})

bookRouter.post("/", async (req, res) => {
    try {
        const book = new BookModel(req.body);
        await book.save();
        res.status(201).send({ msg: "New Book Added", book })
    } catch (e) {
        res.status(400).send({ msg: e.message })
    }
})

bookRouter.patch("/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    try {
        await BookModel.findByIdAndUpdate({ _id: id }, payload)
        res.status(201).send({ msg: "Book Updated" })
    } catch (e) {
        res.status(400).send({ msg: e.message })
    }
})

bookRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const token=req.headers.authorization
    const decoded= jwt.verify(token, process.env.key)
    const req_id = decoded.userId 
    const book=BookModel.findOne({_id:id})
    const userId_in_book=book.userId
    try {
        if(req_id===userId_in_book){
            await BookModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":"Book has been Deleted"})
        }else{
            res.status(400).send({"msg":"Not Authorised"})
        }
    } catch (e) {
        res.send({ msg: e.message })
    }
})

module.exports = bookRouter

