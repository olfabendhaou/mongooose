const  express = require('express');
const { registerValidator, validation, loginValidator } = require('../Middlewares/Validator');
const router = express.Router();
const {register, login, updateUserPassword} = require('/Users/olfabendhaou/Desktop/mongoose/controllers/user.js');
const isAuth = require('/Users/olfabendhaou/Desktop/mongoose/Middlewares/isAuth.js');

router.post("/register", registerValidator(), validation, register);

router.post("/login",loginValidator(), validation, login);

router.get("/current" , isAuth , (req,res)=>
{res.send(req.user)});

router.put("/updateUserPassword/:_id", isAuth , updateUserPassword);

module.exports = router