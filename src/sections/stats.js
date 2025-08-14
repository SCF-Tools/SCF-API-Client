import { Args } from "../utils/utils.js";

export default class Stats {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "stats";

    constructor(client) {
        this.#client = client;
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns guild player statistics over time.
     * @returns {Promise<{
     *   weeks: string[],
     *   points: Object,
     *   guilds: Object
     * }>}
     */

    async getPlayerStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerStats", "GET", [], false);

        return {
            weeks: response.weeks ?? [],
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns hourly message statistics for guilds.
     * @returns {Promise<{points: Object, guilds: Object}>}
     */
    async getHourlyStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getHourlyStats", "GET", [], false);

        return {
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }

    /**
     * Returns weekly guild statistics.
     * @returns {Promise<{weeks: string[], points: Object, guilds: Object}>}
     */
    async getWeeklyStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getWeeklyStats", "GET", [], false);

        return {
            weeks: response.weeks ?? [],
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }
}