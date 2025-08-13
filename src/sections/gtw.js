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
     * @param {string} word - The word to generate hints for.
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
     * @typedef {Object} PlayerEntry
     * @property {string} discord_id - The Discord ID of the player.
     * @property {number} total - The total score or rounds.

     * @typedef {Object} Leaderboard
     * @property {PlayerEntry[]} weekly - Weekly leaderboard entries.
     * @property {PlayerEntry[]} overall - Overall leaderboard entries.

     * @typedef {Object} GetTopResponse
     * @property {Leaderboard} score - Score leaderboard.
     * @property {Leaderboard} rounds - Rounds leaderboard.
     * 
     * Returns Guess The Word leaderboards.
     * @returns {Promise<GetTopResponse>}
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
     * @param {string} discord_id - The Discord ID of the winner.
     * @param {number} points - The amount of points to award.
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