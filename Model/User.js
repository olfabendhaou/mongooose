const mongoose = require('mongoose')

const schema =  mongoose.Schema ;

const userSchema = new schema({
    Firstname : {
        type : String,
        required: true
    } ,
    name : {

        type : String,
        required: true

    } ,
    email : {
        
        type : String,
        required: true,
        unique : true
    },
    password: {
        type : String,
        required: true
    }
})
module.exports = User= mongoose.model("User", userSchema)