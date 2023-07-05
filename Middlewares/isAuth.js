const User = require('/Users/olfabendhaou/Desktop/mongoose/Model/User')
const jwt = require('jsonwebtoken')

module.exports = isAuth = async (req, res,next) => {
    try {
        const token = req.headers('Authorization');
        if (!token) {
            return res.status(400).send({errors: [{msg :"Not Authorized 1"}]});
        }

        const decoded = jwt.verify(token, process.env.SCRT_KEY);
        const foundUser = await User.findOne({_id : decoded.id});
        if (!foundUser) {
            return res.status(400).send({errors: [{msg :"Not Authorized 2"}]});
        } 
        req.user= foundUser;
        next()

    }
    catch (error) {
        res.status(400).send({ errors : [{ msg : "Not Authorized3"}]});
    }
}