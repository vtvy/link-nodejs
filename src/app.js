const express = require("express");
const cors = require("cors");
const userController = require("./controllers/user.controller");
const imageController = require("./controllers/image.controller");
const linkController = require("./controllers/link.controller");
const noteController = require("./controllers/note.controller");
const multer = require("multer");
const storage = require("./middleware/multer");

const upload = multer({ storage });

const ApiError = require("./api-error");

const app = express();

app.use(cors(), express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});

app.route("/api/user")
    .get(userController.findAll)
    .post(userController.create)
    .delete(userController.deleteAll);

app.route("/api/image")
    .get(imageController.findAll)
    .post(upload.single("file"), imageController.create)
    .delete(imageController.deleteAll);

app.route("/api/link")
    .get(linkController.findAll)
    .post(linkController.create)
    .delete(linkController.deleteAll);

app.route("/api/note")
    .get(noteController.findAll)
    .post(noteController.create)
    .delete(noteController.deleteAll);

app.route("/api/contacts/:id(\\d+)")
    .get(userController.findOne)
    .put(userController.update)
    .delete(userController.delete);

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
