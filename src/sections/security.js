import { Args } from "../utils/utils.js";

export default class Security {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "security";
    constructor(client) {
        this.#client = client;
    }

    /**
     * Adds heat to a user.
     * @param {string} id The Discord ID of the user.
     * @param {number|string} heat The amount of heat to add.
     * @param {string} type The reason why the heat was added.
     */
    async addHeat(id, heat, type) {
        let response = await this.#client.sendAPIRequest(this.#section, "addHeat", "POST", [
            {
                name: "id",
                value: id,
                type: Args.POST,
            },
            {
                name: "heat",
                value: heat,
                type: Args.POST,
            },
            {
                name: "type",
                value: type,
                type: Args.POST,
            },
        ]);

        return response.heat;
    }

    /**
     * Returns user's heat level.
     * @param {string} id Discord ID of the user.
     */
    async getHeat(id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getHeat", "GET", [
            {
                name: "id",
                value: id,
                type: Args.GET,
            },
        ]);

        return response.heat;
    }
}
