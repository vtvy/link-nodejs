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
app.use("/image", express.static(__dirname + "/images"));

app.get("/api/guest", linkController.findGuest);

app.route("/api/aduser")
    .get(verifyAdminToken, aduserController.findAll)
    .post(verifyAdminToken, aduserController.create);

app.route("/api/aduser/:id")
    .get(verifyAdminToken, aduserController.findOne)
    .put(verifyAdminToken, aduserController.update)
    .delete(verifyAdminToken, aduserController.delete);

app.route("/api/user")
    .put(verifyToken, userController.update)
    .post(userController.login);

app.route("/api/image", verifyToken)
    .get(verifyToken, imageController.findAll)
    .post(verifyToken, upload.single("file"), imageController.create);

app.route("/api/image/:id").delete(verifyToken, imageController.delete);

app.route("/api/link")
    .get(verifyToken, linkController.findAll)
    .post(verifyToken, linkController.create);

app.route("/api/link/:id")
    .put(verifyToken, linkController.update)
    .delete(verifyToken, linkController.delete);

app.route("/api/note")
    .get(verifyToken, noteController.findAll)
    .post(verifyToken, noteController.create);

app.route("/api/note/:id")
    .put(verifyToken, noteController.update)
    .delete(verifyToken, noteController.delete);

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
