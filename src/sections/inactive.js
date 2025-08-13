import { Args } from "../utils/utils.js";

export default class Inactive {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "inactive";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Adds a player to the inactive list.
     * @param {string} uuid
     * @param {number} days
     */
    async add(uuid, days) {
        let response = await this.#client.sendAPIRequest(this.#section, "add", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
            {
                name: "days",
                value: days,
                type: Args.POST,
            },
        ]);

        return {
            expires: response.expires ?? 0,
        };
    }

    /**
     * Removes a player from the inactive list.
     * @param {string} uuid
     */
    async remove(uuid) {
        await this.#client.sendAPIRequest(this.#section, "remove", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Checks if a player is on the inactive list.
     * @param {string} uuid
     */
    async check(uuid) {
        let response = await this.#client.sendAPIRequest(this.#section, "check", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);

        return {
            protected: response?.info?.state ?? false,
            requested: response?.info?.requested ?? 0,
            expired: response?.info?.expired ?? 0,
        };
    }

    /**
     * @typedef {Object} PlayerEntry
     * @property {string} uuid
     * @property {number} requested
     * @property {number} expired
     * 
     * Returns the list of all inactive players.
     * @returns {Promise<PlayerEntry[]>}
     */
    async list() {
        let response = await this.#client.sendAPIRequest(this.#section, "list", "GET", []);

        return response.list ?? [];
    }
}