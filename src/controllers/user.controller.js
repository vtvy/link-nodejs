const UserService = require("../services/user.service");
const ApiError = require("../api-error");
const { restart } = require("nodemon");

// Create and Save a new Contact
exports.create = async (req, res, next) => {
    if (!(req.body?.name || req.body?.username || req.body?.passwd)) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const userService = new UserService();
        let newUser = {};
        const user = await userService.create(req.body);
        return res.send(user);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let users = [];

    try {
        const userService = new UserService();
        const { name } = req.query;
        if (name) {
            users = await userService.findByName(name);
        } else {
            users = await userService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving contacts")
        );
    }

    return res.send(users);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService();
        const contact = await userService.findById(req.params.id);
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
        const userService = new UserService();
        const updated = await userService.update(req.params.id, req.body);
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
        const userService = new UserService();
        const deleted = await userService.delete(req.params.id);
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
        const userService = new UserService();
        const contacts = await userService.allFavorite();
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
        const userService = new UserService();
        const deleted = await userService.deleteAll();
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
