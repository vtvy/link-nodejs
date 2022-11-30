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
    //
    async create(payload) {
        const user = this.#getUser(payload);
        const [id] = await this.users.insert(user);
        return { id, ...user, createAt: new Date().toJSON() };
    }
    //
    async all() {
        return await this.users.select("*");
    }

    async findByName(name) {
        return await this.users.where("name", "like", `%${name}%`).select("*");
    }

    async findById(id) {
        return await this.users.where("id", id).select("*").first();
    }

    async update(id, payload) {
        const update = this.#getUser(payload);
        return await this.users.where("id", id).update(update);
    }

    async delete(id) {
        return await this.users.where("id", id).del();
    }

    async allFavorite() {
        return await this.users.where("favorite", 1).select("*");
    }

    async deleteAll() {
        return await this.users.del();
    }
}

module.exports = UserService;
