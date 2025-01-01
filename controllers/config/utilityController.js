const path = require('path');
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, '../../public/uploads/products'); 
       // Move out of the router folder
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });



module.exports.upload = multer({ storage: storage });

// Set up Multer to store images in a folder called 'uploads'
module.exports.uploadImages = async (req,res)=>{  

  console.log(req.file);
  
  
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const fileUrl = `https://shalu.ddns.net/uploads/Products/${req.file.filename}`;

    res.send({ url: fileUrl });
  
  
  };
