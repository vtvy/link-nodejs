const AdUserService = require("../services/aduser.service");
const ApiError = require("../api-error");
const bcrypt = require("bcrypt");

const saltRounds = 9;

// Create and Save a new user
exports.create = async (req, res, next) => {
    if (!(req.body?.name || req.body?.username || req.body?.passwd)) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const aduserService = new AdUserService();
        const existedUser = await aduserService.findByUsername(
            req.body.username
        );
        if (existedUser)
            return next(new ApiError(400, "Username have been used"));
        req.body.passwd = bcrypt.hashSync(req.body.passwd, saltRounds);
        console.log(req.body.passwd);
        const user = await aduserService.create(req.body);
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
        const aduserService = new AdUserService();
        const { name } = req.query;
        if (name) {
            users = await aduserService.findByName(name);
        } else {
            users = await aduserService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occorred while retrieving users")
        );
    }

    return res.send(users);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new AdUserService();
        const user = await userService.findById(req.params.id);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(user);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new AdUserService();
        const updated = await userService.update(req.params.id, req.body);
        if (!updated) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not updated user with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new AdUserService();
        let id = req.params.id;
        if (id === "1")
            return next(new ApiError(403, "This user cannot be deleted"));
        const deleted = await userService.delete(id);
        if (!deleted) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const userService = new AdUserService();
        const users = await userService.allFavorite();
        return res.send(users);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(
                500,
                "An error occurred while retrieving favorite users"
            )
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const userService = new AdUserService();
        const deleted = await userService.deleteAll();
        return res.send({
            message: `${deleted} users were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all users")
        );
    }
};
