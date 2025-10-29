import { Args } from "../utils/utils.js";

export default class Score {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "score";

    constructor(client) {
        this.#client = client;
    }

    /**
     * @typedef {Object} ScorePlaceEntry
     * @property {number} place
     * @property {number} score
     * @property {string} nick
     *
     * @typedef {Object} PlayerScore
     * @property {string} uuid
     * @property {number} score
     * @property {string} nick
     */

    /**
     * Returns the score and the place of a user in the guild of the token this week.
     * @param {string} uuid
     * @param {boolean} overall
     * @returns {Promise<ScorePlaceEntry>}
     */
    async getCutoff(uuid, overall = false) {
        let response = await this.#client.sendAPIRequest(this.#section, "getCutoff", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "overall",
                value: overall ? 1 : 0,
                type: Args.GET,
            },
        ]);

        return {
            place: response.place ?? 0,
            score: response.score ?? 0,
            nick: response.nick ?? "",
        };
    }

    /**
     * Returns the score and the place of a user in the guild of the token in the past 7 days.
     * @param {string} uuid
     * @param {boolean} overall
     * @returns {Promise<ScorePlaceEntry>}
     */
    async getRolling(uuid, overall = false) {
        let response = await this.#client.sendAPIRequest(this.#section, "getRolling", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "overall",
                value: overall ? 1 : 0,
                type: Args.GET,
            },
        ]);

        return {
            place: response.place ?? 0,
            score: response.score ?? 0,
            nick: response.nick ?? "",
        };
    }

    /**
     * Logs the information about a sent guild message.
     * @param {string} uuid
     * @param {string} nick
     * @param {string} guild_id
     */
    async saveMessage(uuid, nick, guild_id) {
        await this.#client.sendAPIRequest(this.#section, "saveMessage", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
            {
                name: "nick",
                value: nick,
                type: Args.POST,
            },
            {
                name: "guild_id",
                value: guild_id,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Returns the top players in a guild based on their score.
     * @param {string|null} guild_id
     * @param {number} offset
     * @returns {Promise<{total: number, list: PlayerScore[]}>}
     */
    async getTop(guild_id = null, offset = 0) {
        let args = [];
        if (guild_id) {
            args.push({
                name: "guild_id",
                value: guild_id,
                type: Args.GET,
            });
        }
        
        if (offset) {
            args.push({
                name: "offset",
                value: offset,
                type: Args.GET,
            });
        }

        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", args);

        return {
            total: response.total ?? 0,
            list: response.players ?? [],
        };
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns the sum of all player entries starting from a specific period.
     * @param {string} uuid
     * @param {string} type
     * @param {string} period_id
     * @returns {Promise<{
     *    uuid: string,
     *    nick: string,
     *    guild_id: string,
     *    messages: string,
     *    score: string,
     *    last_message: string,
     * }>}
     */
    async getPlayerSummary(uuid, type, period_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerSummary", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "type",
                value: type,
                type: Args.GET,
            },
            {
                name: "period_id",
                value: period_id,
                type: Args.GET,
            },
        ]);

        return response.entry ?? {};
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns the needed player entry.
     * @param {string} uuid - The UUID of the user.
     * @param {string} type - A type of a record - "hour", "day", or "week".
     * @param {string} period_id - An ID of a period to get the entry for.
     * @returns {Promise<{
     *    uuid: string,
     *    nick: string,
     *    guild_id: string,
     *    messages: string,
     *    score: string,
     *    last_message: string,
     * }>}
     */
    async getPlayerEntry(uuid, type, period_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerEntry", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "type",
                value: type,
                type: Args.GET,
            },
            {
                name: "period_id",
                value: period_id,
                type: Args.GET,
            },
        ]);

        return response.entry ?? {};
    }
}
