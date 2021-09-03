const express = require("express");
const router = express.Router();

const  Connection  = require("../db/model/connection");
const MSG = require("../db/model/msg");
const auth = require("../services/auth/authenticate");


router.get('/msg', auth.authenticateUser, async (req, res, next) => {
    try {
        const connections = await Connection.find({}).sort({ updateAt: 1 }).populate("user_id");
        
        res.render("msg/index", {
            layout: "./layouts/msg",
            connections: connections,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/msg/chat/:uid',auth.authenticateUser.async(req,res,next))

