const FolderService = require("../services/folder.service");
const ApiError = require("../api-error");

// Create and Save a new folder
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const folderService = new FolderService();
        const folder = await folderService.create(req.body);
        return res.send(folder);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the folder")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let users = [];

    try {
        const userService = new FolderService();
        const { name } = req.query;
        if (name) {
            users = await userService.findByName(name);
        } else {
            users = await userService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving folders")
        );
    }

    return res.send(users);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new FolderService();
        const folder = await userService.findById(req.params.id);
        if (!folder) {
            return next(new ApiError(404, "folder not found"));
        }
        return res.send(folder);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Error retrieving folder with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new FolderService();
        const updated = await userService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "folder not found"));
        }
        return res.send({ message: "folder was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not updated folder with id=${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new FolderService();
        const deleted = await userService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "folder not found"));
        }
        return res.send({ message: "folder was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not delete folder with id=${req.params.id}`
            )
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const userService = new FolderService();
        const folders = await userService.allFavorite();
        return res.send(folders);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite folders"
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const userService = new FolderService();
        const deleted = await userService.deleteAll();
        return res.send({
            message: `${deleted} folders were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all folders")
        );
    }
};
