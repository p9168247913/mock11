const express = require("express")
const OrderModel = require("../models/orderModel")
const orderRouter = express.Router()

orderRouter.get("/orders", async (req, res) => {
    const userId = req.body.userId;
    try {
        const data = await OrderModel.find({ userId: userId })
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

orderRouter.post("/order", async (req, res) => {
    try {
        const data = new OrderModel(req.body);
        await data.save();
        res.send("data is added");
    } catch (error) {
        res.send(error);
    }
});

module.exports = orderRouter;
