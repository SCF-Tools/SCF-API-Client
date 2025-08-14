import { Args } from "../utils/utils.js";

export default class Minigames {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "minigames";

    constructor(client) {
        this.#client = client;
    }

    // TODO: Implement authorizations mechanism for games
    // Put hold on user's funds, and subtract/remove hold on win
    // Put a hold on user's game ID, so that it doesn't
    // subtract if something goes wrong, only when game is completed
    // successfully.

    /**
     * Updates coin balance for a profile.
     * @param {string} discord_id
     * @param {number} amount
     */
    async updateCoins(discord_id, amount) {
        let negative = amount < 0;
        amount = Math.abs(amount);

        await this.#client.sendAPIRequest(this.#section, "updateCoins", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "amount",
                value: amount,
                type: Args.POST,
            },
            {
                name: "negative",
                value: negative ? 1 : 0,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Resets a specific cooldown timer for a user.
     * @param {string} discord_id
     * @param {string} cooldown
     * @param {number} time
     */
    async resetCooldown(discord_id, cooldown, time) {
        await this.#client.sendAPIRequest(this.#section, "resetCooldown", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "cooldown",
                value: cooldown,
                type: Args.POST,
            },
            {
                name: "time",
                value: time,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Logs a completed minigame outcome.
     * @param {string} game_id
     * @param {string} discord_id
     * @param {string} game
     * @param {number} bet
     * @param {number} outcome
     */
    async logOutcome(game_id, discord_id, game, bet, outcome) {
        await this.#client.sendAPIRequest(this.#section, "logOutcome", "POST", [
            {
                name: "game_id",
                value: game_id,
                type: Args.POST,
            },
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "game",
                value: game,
                type: Args.POST,
            },
            {
                name: "bet",
                value: bet,
                type: Args.POST,
            },
            {
                name: "outcome",
                value: outcome,
                type: Args.POST,
            },
        ]);
    }

    /**
     * @typedef {Object} MinigameCoins
     * @property {number} purse
     * @property {number} bank
     * @property {number} total
     * 
     * @typedef {Object} MinigameCooldowns
     * @property {string} work
     * @property {string} crime
     * @property {string} beg
     * @property {string} social
     *
     * @typedef {Object} MinigamePlayer
     * @property {string} discord_id
     * @property {MinigameCoins} coins
     * @property {MinigameCooldowns} cooldowns
     * 
     * Returns top 10 minigame players, sorted by networth.
     * @returns {Promise<MinigamePlayer[]>}
     */
    async getTop() {
        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", []);

        return response.top ?? [];
    }

    /**
     * 
     * Returns the minigame profile for a Discord ID.
     * @param {string} discord_id
     * @returns {Promise<MinigamePlayer>}
     */
    async getProfile(discord_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getProfile", "GET", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.GET,
            },
        ]);

        return response.profile ?? {};
    }

    /**
     * Transfers coins between bank and purse.
     * @param {string} discord_id
     * @param {number} amount
     * @param {boolean} withdraw
     */
    async bankTransfer(discord_id, amount, withdraw = false) {
        await this.#client.sendAPIRequest(this.#section, "bankTransfer", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "amount",
                value: amount,
                type: Args.POST,
            },
            {
                name: "withdraw",
                value: withdraw ? 1 : 0,
                type: Args.POST,
            },
        ]);
    }
}