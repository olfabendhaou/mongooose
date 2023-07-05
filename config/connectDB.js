// require mongoose

const mongoose = require('mongoose');

const connectDB = async() => {

    try { await mongoose.connect(process.env.DB_URI)
    
        console.log("Data base Connected successfully");
    }
    catch (error) {

        console.error("data base connection error");

}

}
module.exports = connectDB ;