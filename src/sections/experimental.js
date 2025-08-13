import { Args } from "../utils/utils.js";

export default class Experimental {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "experimental";

    constructor(client) {
        this.#client = client;
    }

    /**
     * AI moderation for player messages.
     * @param {string} message
     */
    async moderateMessage(message) {
        let response = await this.#client.sendAPIRequest(this.#section, "moderateMessage", "POST", [
            {
                name: "message",
                value: message,
                type: Args.POST,
            },
        ]);

        return {
            action: response.action ?? "allow",
            fallback: response.fallback ?? false,
        };
    }

    /**
     * Saves the fact that the player was invited to the guild.
     * @param {string} uuid
     */
    async saveInvite(uuid) {
        await this.#client.sendAPIRequest(this.#section, "saveInvite", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Checks if a player UUID was already invited to the guild.
     * @param {string} uuid
     */
    async wasInvited(uuid) {
        let response = await this.#client.sendAPIRequest(this.#section, "wasInvited", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);

        return response.saved ?? false;
    }
}