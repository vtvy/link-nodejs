const knex = require("../database/knex");
class UserService {
    constructor() {
        this.users = knex("users");
    }
    // Define methods for accessing the database
    #getUser(payload) {
        const users = { ...payload };
        const userProperties = ["name", "username", "passwd"];
        // Remove non-User properties
        Object.keys(users).forEach(function (key) {
            if (userProperties.indexOf(key) == -1) {
                delete users[key];
            }
        });
        return users;
    }

    async findByName(name) {
        return await this.users.where("name", "like", `%${name}%`).select("*");
    }

    async findByUsername(username) {
        return await this.users
            .where("username", username)
            .select("id", "name", "avatar", "passwd", "role")
            .first();
    }

    async update(id, payload) {
        const update = this.#getUser(payload);
        return await this.users.where("id", id).update(update);
    }

    async delete(id) {
        return await this.users.where("id", id).del();
    }
}

module.exports = UserService;
