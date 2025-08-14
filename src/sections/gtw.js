import { Args } from "../utils/utils.js";

export default class GTW {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "gtw";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Generates hints for a provided word.
     * @param {string} word
     */
    async start(word) {
        let response = await this.#client.sendAPIRequest(this.#section, "start", "GET", [
            {
                name: "word",
                value: word,
                type: Args.GET,
            },
        ]);

        return {
            description: response.description ?? "",
            hints: response.hints ?? [],
        };
    }

    /**
     * @typedef {Object} GTWPlayer
     * @property {string} discord_id
     * @property {number} total

     * @typedef {Object} GTWLeaderboard
     * @property {GTWPlayer[]} weekly
     * @property {GTWPlayer[]} overall

     * @typedef {Object} GTWTop
     * @property {GTWLeaderboard} score
     * @property {GTWLeaderboard} rounds
     * 
     * Returns Guess The Word leaderboards.
     * @returns {Promise<GTWTop>}
     */
    async getTop() {
        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", []);

        return {
            score: {
                weekly: response?.top?.score?.weekly ?? [],
                overall: response?.top?.score?.overall ?? [],
            },
            rounds: {
                weekly: response?.top?.rounds?.weekly ?? [],
                overall: response?.top?.rounds?.overall ?? [],
            }
        };
    }

    /**
     * Awards points for Guess The Word minigame.
     * @param {string} discord_id
     * @param {number} points
     */
    async awardPoints(discord_id, points) {
        let response = await this.#client.sendAPIRequest(this.#section, "awardPoints", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "points",
                value: points,
                type: Args.POST,
            },
        ]);

        return {
            game_id: response.game_id ?? null,
        };
    }
}