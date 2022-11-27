const knex = require("../database/knex");
class imageService {
    constructor() {
        this.images = knex("images");
    }
    // Define methods for accessing the database
    #getimage(payload) {
        const images = { ...payload };
        const imageProperties = ["name", "author"];
        // Remove non-image properties
        Object.keys(images).forEach(function (key) {
            if (imageProperties.indexOf(key) == -1) {
                delete images[key];
            }
        });
        return images;
    }
    //
    async create(payload) {
        const image = this.#getimage(payload);
        const [id] = await this.images.insert(image);
        return { id, ...image };
    }
    //
    async all() {
        return await this.images.select("*");
    }

    async findByName(name) {
        return await this.images.where("name", "like", `%${name}%`).select("*");
    }

    async findById(id) {
        return await this.images.where("id", id).select("*").first();
    }

    async update(id, payload) {
        const update = this.#getimage(payload);
        return await this.images.where("id", id).update(update);
    }

    async delete(id) {
        return await this.images.where("id", id).del();
    }

    async allFavorite() {
        return await this.images.where("favorite", 1).select("*");
    }

    async deleteAll() {
        return await this.images.del();
    }
}

module.exports = imageService;
