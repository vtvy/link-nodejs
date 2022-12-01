const express = require("express");
const cors = require("cors");
const aduserController = require("./controllers/aduser.controller");
const userController = require("./controllers/user.controller");
const imageController = require("./controllers/image.controller");
const linkController = require("./controllers/link.controller");
const noteController = require("./controllers/note.controller");
const multer = require("multer");
const storage = require("./middleware/multer");
const {
    verifyToken,
    verifyAdminToken,
} = require("./middleware/authentication");

const upload = multer({ storage });

const ApiError = require("./api-error");

const app = express();

app.use(cors(), express.json());
console.log(__dirname);
app.use("/image", express.static(__dirname + "/images"));

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});

app.route("/api/aduser")
    .get(verifyAdminToken, aduserController.findAll)
    .post(verifyAdminToken, aduserController.create);

app.route("/api/aduser/:id")
    .get(aduserController.findOne)
    .put(aduserController.update)
    .delete(aduserController.delete);

app.route("/api/user").get(userController.update).post(userController.login);

app.route("/api/image", verifyToken)
    .get(imageController.findAll)
    .post(upload.single("file"), imageController.create);

app.route("/api/image/:id").delete(imageController.delete);

app.route("/api/link").get(linkController.findAll).post(linkController.create);

app.route("/api/link/:id")
    .put(linkController.update)
    .delete(linkController.delete);

app.route("/api/note").get(noteController.findAll).post(noteController.create);

app.route("/api/note/:id")
    .put(noteController.update)
    .delete(noteController.delete);

// Handle 404 response.
app.use((req, res, next) => {
    // Handle for unknown route
    //      Call next() to pass to the error handling middleware
    return next(new ApiError(404, "Resource not found"));
});

// Define error-handling middleware last, after other app.use() and routes calls.
app.use((error, req, res, next) => {
    // The centralized error handing middleware.
    // In any route handler, calling next(error)
    //      will pass to this error hanling middleware.
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
