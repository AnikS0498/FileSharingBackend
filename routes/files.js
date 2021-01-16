require('dotenv').config();
const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../model/file");
const { v4: uuid4 } = require("uuid");


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
     const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
     cb(null, uniqueName);   
    }
});

let uplaod = multer({
    storage,
    limit: {
        fileSize: 1000000 * 100
    },
}).single("myfile");

router.post("/", (req, res)=>{
    
    
    

    //Store file
    uplaod(req, res, async(err)=>{

        // Validate request
        if(!req.file){
            return res.json({error: "File not found"});
        }

        if(err){
            return res.status(500).send({error: err.message})
        }
       
    //Store into Database
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });
    
});

module.exports = router;