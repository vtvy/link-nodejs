const NoteService = require("../services/note.service");
const ApiError = require("../api-error");

// Create and Save a new note
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const noteService = new NoteService();
        const note = await noteService.create(req.body);
        return res.send(note);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the note")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let users = [];
    try {
        const userService = new NoteService();
        const { name } = req.query;
        if (name) {
            users = await userService.findByName(name);
        } else {
            users = await userService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving notes")
        );
    }

    return res.send(users);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new NoteService();
        const note = await userService.findById(req.params.id);
        if (!note) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send(note);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving note with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new NoteService();
        const updated = await userService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send({ message: "note was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not updated note with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new NoteService();
        const deleted = await userService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "note not found"));
        }
        return res.send({ message: "note was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete note with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const userService = new NoteService();
        const notes = await userService.allFavorite();
        return res.send(notes);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite notes"
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const userService = new NoteService();
        const deleted = await userService.deleteAll();
        return res.send({
            message: `${deleted} notes were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all notes")
        );
    }
};
