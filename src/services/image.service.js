const knex = require("../database/knex");
class ImageService {
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
        return { id, ...image, type: 2, createAt: new Date().toJSON() };
    }
    //
    async all() {
        return await this.images
            .column(
                "id",
                "name",
                "author",
                "createAt",
                "updateAt",
                knex.raw("2 as type")
            )
            .select();
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
        const image = await this.images.where("id", id).select("name").first();
        const deleted = await this.images
            .where({ id: id }, { author: 1 })
            .del();
        return { name: image.name, deleted };
    }

    async allFavorite() {
        return await this.images.where("favorite", 1).select("*");
    }

    async deleteAll() {
        return await this.images.del();
    }
}

module.exports = ImageService;
