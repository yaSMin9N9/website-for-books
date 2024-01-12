const path = require("path")
const multer =require("multer")

//photo storage
const photoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../image"));
    },
    filename: function(req, file, cb) {
        if (file) {
            cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
        } else {
            cb({ message: "file not found" }, false);
        }
    }
});
//photo upload middleware
const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb({ message: "unsupported file" }, false);
        }
    },
    limits: { fileSize: 2048 * 1024 } // Corrected to fileSize
});
module.exports =photoUpload