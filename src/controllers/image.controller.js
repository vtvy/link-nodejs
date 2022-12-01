const ImageService = require("../services/image.service");
const ApiError = require("../api-error");
const fs = require("fs");

// Create and Save a new image
exports.create = async (req, res, next) => {
    if (!req.body?.path) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const imageService = new ImageService();
        const image = await imageService.create(req.body);
        return res.send(image);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the image")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let images = [];

    try {
        const imageService = new ImageService();
        const { name } = req.query;
        if (name) {
            images = await imageService.findByName(name);
        } else {
            images = await imageService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving images")
        );
    }
    return res.send(images);
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const imageService = new ImageService();
        const updated = await imageService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "image not found"));
        }
        return res.send({ message: "image was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not updated image with id=${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const imageService = new ImageService();
        const { name, deleted } = await imageService.delete(req.params.id);
        if (!(deleted && name)) {
            return next(new ApiError(404, "image not found"));
        }
        let id = 1;
        console.log(deleted);
        const imagePath = `./src/images/${id}/${name}`;
        console.log(imagePath);
        fs.unlinkSync(imagePath);
        return res.send({ message: "image was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete image with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const imageService = new ImageService();
        const images = await imageService.allFavorite();
        return res.send(images);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite images"
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const imageService = new ImageService();
        const deleted = await imageService.deleteAll();
        return res.send({
            message: `${deleted} images were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all images")
        );
    }
};
