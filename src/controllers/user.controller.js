const UserService = require("../services/user.service");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
    if (!(req.body?.username || req.body?.passwd)) {
        return next(new ApiError(400, "Fields can not be empty"));
    }
    try {
        const userService = new UserService();
        const user = await userService.findByUsername(req.body.username);
        const match = bcrypt.compareSync(req.body.passwd, user.passwd);
        if (match) {
            let token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.SECRET_TOKEN_CODE
            );
            delete user["passwd"];
            return res.send({ user, token });
        } else {
            return next(new ApiError(404, "Username or Password is incorrect"));
        }
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
            new ApiError(500, "An error occorred while retrieving Users")
        );
    }

    return res.send(users);
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService();
        const User = await userService.findById(req.params.id);
        if (!User) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(User);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving User with id=${req.params.id}`)
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
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was updated successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not updated User with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService();
        const deleted = await userService.delete(req.params.id);
        if (!deleted) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete User with id=${req.params.id}`)
        );
    }
};
