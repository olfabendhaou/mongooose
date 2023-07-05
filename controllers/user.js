
const User = require('/Users/olfabendhaou/Desktop/mongoose/Model/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req,res) => {

    try {
        const {Firstname, name, email , password } = req.body ;

        const foundUser = await User.findOne({email});
        if (foundUser ){
            return  res.status(400).send({ errors : [{ msg : "email déja utulisé "}]});
        }
        
        const saltRound= 10 
        const hashPassword = await bcrypt.hash(password,saltRound);

        const newUser = new User({...req.body});
        newUser.password = hashPassword;

        await newUser.save();

        const token = jwt.sign({
            id: newUser._id,
        }, process.env.SCRT_KEY, {expiresIn : "48h"});

        return  res.status(200).send({ success : [{ msg : "inscription réussite "}], token, user:newUser});
    }
    catch(error){
        res.status(400).send({ errors : [{ msg : "try again "}]});
    }
}


exports.login = async(req,res) => {
    try{
        const {email, password} = req.body ;

        const foundUser = await User.findOne({email});

        if (!foundUser){
            return  res.status(400).send({ errors : [{ msg : "USER NOT FOUND!!!"}]});
        }

        const checkPasswords = await bcrypt.compare(password, foundUser.password);

        if (!checkPasswords) {

            return  res.status(400).send({ errors : [{ msg : "email or password incorrect"}]});
        }

        const token = jwt.sign({
            id: foundUser._id,
        }, process.env.SCRT_KEY, {expiresIn : "48h"});


    
        res.status(200).send({ success : [{ msg : "welcom back"}], token, user:foundUser});
    }
    catch (error){
        res.status(400).send({ errors : [{ msg : "oooops!check your informations!"}]});   
    }
}

exports.updateUserPassword = async (req,res) => {

    const {oldPassword,newPassword, confirmpassword} = req.body;
    
    const {_id} = req.params;
    try{
        //get user
        const user= await User.findById(req.params);
        if (!user){
            return res.status(400).send('User not found')
        }

        //validate  old password
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword){
            return res.status(400).send({errors : [{msg : "veuillez vérifier votre mot de passe"}]})
        }
        if (password !== confirmPassword)
        { 
            return res.status(400).send({errors : [{msg : "veuillez vérifier votre nouveau mot de passe"}]})
        }
        // hash new password 
        const hashepassword = await bcrypt.hash(password, 10);

        // update user's password
        user.password = hashepassword ;

        const updateUserPassword = await user.save();
        return res.json({success :[{msg : "votre mot de passe a été modifié avec succès"}], user :updateUserPassword})  ;

    }
    catch(err){

    res.status(400).send({ errors : [{ msg : "veuillez essayer ultérieurementation"}]});
    }
}


