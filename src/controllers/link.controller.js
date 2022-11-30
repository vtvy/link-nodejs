const LinkService = require("../services/link.service");
const ApiError = require("../api-error");

// Create and Save a new link
exports.create = async (req, res, next) => {
    if (!(req.body?.name || req.body?.url)) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const linkService = new LinkService();
        const link = await linkService.create(req.body);
        return res.send(link);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the link")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let links = [];
    try {
        const linkService = new LinkService();
        const { name } = req.query;
        if (name) {
            links = await linkService.findByName(name);
        } else {
            links = await linkService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving links")
        );
    }

    return res.send(links);
};

exports.findOne = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const link = await linkService.findById(req.params.id);
        if (!link) {
            return next(new ApiError(404, "Link not found"));
        }
        return res.send(link);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving link with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    console.log("numberof body length" + Object.keys(req.body).length);
    try {
        const linkService = new LinkService();
        const updated = await linkService.update(req.body);
        if (!updated) {
            return next(new ApiError(404, "Link not found"));
        }
        return res.send({ message: "Link was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not updated link with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const deleted = await linkService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "Link not found"));
        }
        return res.send({ message: "Link was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete link with id=${req.params.id}`)
        );
    }
};
