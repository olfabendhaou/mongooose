const { check, validationResult } = require('express-validator');

exports.registerValidator =() => {
    check("firstname", "veuillez insérez votre prénom !").not().isEmpty();
    check("name", "veuillez insérez votre nom !").not().isEmpty();
    check("email", "veuillez insérez votre email !").isEmail();
    check("password", "password !").isLength({min : 6});
}
exports.loginValidator = ()=> {
    check("email", "veuillez insérez votre email !").isEmail();
    check("password", "password !").isLendth({min : 6});   
}
exports.validation =(req,res,next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();

}