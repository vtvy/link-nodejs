const knex = require("../database/knex");
class LinkService {
    constructor() {
        this.links = knex("links");
    }
    // Define methods for accessing the database
    #getLink(payload) {
        const links = { ...payload };
        const linkProperties = [
            "name",
            "public",
            "passwd",
            "color",
            "url",
            "author",
        ];
        // Remove non-link properties
        Object.keys(links).forEach(function (key) {
            if (linkProperties.indexOf(key) == -1) {
                delete links[key];
            }
        });
        //remove # from #rrggbb
        if (links.color.length === 7) {
            links.color = links.color.substring(1);
        }
        return links;
    }
    //
    async create(payload) {
        const link = this.#getLink(payload);
        const [id] = await this.links.insert(link);
        return { id, ...link, type: 1, createAt: newDate().toJSON() };
    }
    //
    async all() {
        return await this.links
            .column(
                "id",
                "name",
                "author",
                "public",
                "passwd",
                "color",
                "url",
                "createAt",
                "updateAt",
                knex.raw("1 as type")
            )
            .select();
    }

    async findByName(name) {
        return await this.links.where("name", "like", `%${name}%`).select("*");
    }

    async findById(id) {
        return await this.links.where("id", id).select("*").first();
    }

    async update(payload) {
        const id = payload.id;
        const update = this.#getLink(payload);
        return await this.links.where("id", id).update(update);
    }

    async delete(id) {
        return await this.links.where({ id: id }, { author: 1 }).del();
    }

    async allFavorite() {
        return await this.links.where("favorite", 1).select("*");
    }

    async deleteAll() {
        return await this.links.del();
    }
}

module.exports = LinkService;
