
const  express = require('express');
const router = express.Router();
const Contact = require("../Model/Contact");
const cloudinary = require("../Middlewares/cloudinary");
const upload = require("../Middlewares/multer");
const isAuth = require('../Middlewares/isAuth');


// router.get('/test', (req, res) => {
//     res.send("api is runing")
// }
// )

// add new contact

router.post("/add", isAuth, upload.single("image"), async(req,res) => {
    try {
         // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Create new contact

        let newContact= new Contact({ 
                name: req.body.name,
                email : req.body.email ,
                phone : req.body.phone ,
                profile_img: result.secure_url,
                cloudinary_id: result.public_id,
    });
        await newContact.save() ;

        res.status(200).send({msg : "contact added successfully ", newContact})
    } 
    catch (error) {  
        res.status(400).send({msg : "contact not added ", error}) 
    }
}
)
// get all contacts

router.get("/all-contact", async(req,res) => {
    try {
        const listContacts = await Contact.find() 

        res.status(200).send({msg : "contact list", listContacts})
    } 
    catch (error) {  
        res.status(400).send({msg : "can  not get the list  ", error}) 
    }
}
)
// delete contact

router.delete ("/:_id", async(req,res) => {
    try {
        
        let contact = await Contact.findById(req.params._id);
        
        // Delete image from cloudinary

    await cloudinary.uploader.destroy(contact.cloudinary_id);
    
    // Delete contact from db

        await contact.deleteOne();

        res.status(200).send({msg : "contact deleted"})
    } 
    catch (error) {  
        res.status(400).send({msg : "can  not delete this contact  ", error}) 
    }
}
)
// update contact

router.put ("/:_id", upload.single("image"), async(req,res) => {
    try {
        let contact = await Contact.findById(req.params._id);
        
// Delete image from cloudinary

        await cloudinary.uploader.destroy(contact.cloudinary_id);
        
// Upload new image to cloudinary

    const result = await cloudinary.uploader.upload(req.file.path);
    const data = {
        name: req.body.name || contact.name,
        email: req.body.email || contact.email,
        phone: req.body.phone || contact.phone,
        profile_img: result.secure_url || contact.profile_img,
        cloudinary_id: result.public_id || contact.cloudinary_id,
    };
        let updateContact= await Contact.findByIdAndUpdate(req.params._id, data, {
        new: true
    });

        res.status(200).send({msg : "contact updated successfully",  updateContact})
    }    
    catch (error) {  
        res.status(400).send({msg : "can  not update this contact  ", error}) 
    }
})

// get one contact

router.get ("/:_id", async(req,res) => {
    try {
        const contacttoget = await Contact.findOne({_id :req.params._id}) 
        res.status(200).send({msg : "contact getted successfully", contacttoget})
    }    
    catch (error) {  
        res.status(400).send({msg : "can  not get this contact  ", error}) 
    }
})
module.exports = router