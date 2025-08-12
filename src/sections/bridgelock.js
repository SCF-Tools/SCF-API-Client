import { Args } from "../utils/utils.js";

export default class BridgeLock {
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
            locked: response.locked ?? false,
            info: {
                lock_id: response.info.lock_id ?? null,
                moderator_id: response.info.moderator ?? null,
                reason: response.info.reason ?? null,
                timestamp: response.info.timestamp ?? null,
            }
        };
    }

    /**
     * Removes the restriction on using the bridges.
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