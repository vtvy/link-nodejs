const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const userID = 1;
        const dir = `./src/images/${userID}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        const filename = new Date().toJSON().slice(0, 10) + file.originalname;
        callback(null, filename);
        req.body.path = filename;
    },
});

module.exports = storage;
