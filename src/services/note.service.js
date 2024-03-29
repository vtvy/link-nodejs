const knex = require("../database/knex");
class NoteService {
    constructor() {
        this.notes = knex("notes");
    }
    // Define methods for accessing the database
    #getnote(payload) {
        const notes = { ...payload };
        const noteProperties = ["name", "content", "author"];
        // Remove non-note properties
        Object.keys(notes).forEach(function (key) {
            if (noteProperties.indexOf(key) == -1) {
                delete notes[key];
            }
        });
        return notes;
    }
    //
    async create(payload) {
        const note = this.#getnote(payload);
        const [id] = await this.notes.insert(note);
        return { id, ...note, type: 3, createAt: new Date().toJSON() };
    }
    //
    async all() {
        return await this.notes
            .column(
                "id",
                "name",
                "author",
                "content",
                "createAt",
                "updateAt",
                knex.raw("3 as type")
            )
            .select();
    }

    async findByName(name) {
        return await this.notes.where("name", "like", `%${name}%`).select("*");
    }

    async findById(id) {
        return await this.notes.where("id", id).select("*").first();
    }

    async update(payload) {
        const id = payload.id;
        const update = this.#getnote(payload);
        return await this.notes.where("id", id).update(update);
    }

    async delete(id) {
        return await this.notes.where({ id: id }, { author: 1 }).del();
    }

    async allFavorite() {
        return await this.notes.where("favorite", 1).select("*");
    }

    async deleteAll() {
        return await this.notes.del();
    }
}

module.exports = NoteService;
