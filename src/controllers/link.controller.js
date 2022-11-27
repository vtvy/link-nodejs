const LinkService = require("../services/link.service");
const ApiError = require("../api-error");

// Create and Save a new Contact
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
        console.log(links);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving contacts")
        );
    }

    return res.send(links);
};

exports.findOne = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const contact = await linkService.findById(req.params.id);
        if (!contact) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(contact);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const linkService = new LinkService();
        const updated = await linkService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not updated contact with id=${req.params.id}`
            )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const deleted = await linkService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const contacts = await linkService.allFavorite();
        return res.send(contacts);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite contacts"
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const linkService = new LinkService();
        const deleted = await linkService.deleteAll();
        return res.send({
            message: `${deleted} contacts were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};
