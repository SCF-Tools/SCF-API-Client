import { Args } from "../utils/utils.js";

export default class Bridgelock {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "bridgelock";
    constructor(client) {
        this.#client = client;
    }

    /**
     * Locks a user from using Guild Bridges.
     * @param {string} uuid
     * @param {string} moderator_id
     * @param {string} reason
     */
    async add(uuid, moderator_id, reason = "") {
        await this.#client.sendAPIRequest(this.#section, "add", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
            {
                name: "moderator_id",
                value: moderator_id,
                type: Args.POST,
            },
            {
                name: "reason",
                value: reason,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Checks if a player is bridge locked.
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

        console.log(response);

        return {
            locked: response?.data?.locked ?? false,
            info: {
                lock_id: response?.data?.info?.lock_id ?? null,
                moderator_id: response?.data?.info?.moderator ?? null,
                reason: response?.data?.info?.reason ?? null,
                timestamp: response?.data?.info?.timestamp ?? null,
            }
        };
    }

    /**
     * Removes the restriction on using the bridges.
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
}