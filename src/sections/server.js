import { Args } from "../utils/utils.js";

export default class Server {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "server";
    constructor(client) {
        this.#client = client;
    }

    /**
     * Blacklists user from SCF Services.
     */
    async addBlacklist(uuid, reason = null) {
        await this.#client.sendAPIRequest(this.#section, "addBlacklist", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "reason",
                value: reason,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Removes user's SCF blacklist.
     */
    async removeBlacklist(uuid) {
        await this.#client.sendAPIRequest(this.#section, "removeBlacklist", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);
    }

    /**
     * Checks if a player is blacklisted from SCF Services.
     */
    async isBlacklisted(uuid) {
        let response = await this.#client.sendAPIRequest(this.#section, "isBlacklisted", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);

        return {
            banned: response.banned ?? false,
            reason: response.reason ?? "N/A"
        };
    }

    /**
     * Verifies user in SCF Discord.
     */
    async verify(discord_id, uuid) {
        await this.#client.sendAPIRequest(this.#section, "verify", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.GET,
            },
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);
    }

    /**
     * Removes user verification status in SCF Discord.
     */
    async unverify(uuid) {
        await this.#client.sendAPIRequest(this.#section, "unverify", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
        ]);
    }

    /**
     * Returns the information about the linked user.
     */
    async getVerified(uuid = null, discord_id = null) {
        let response = await this.#client.sendAPIRequest(this.#section, "getVerified", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "discord_id",
                value: discord_id,
                type: Args.GET,
            },
        ]);

        return {
            uuid: response.uuid,
            discord_id: response.discord_id
        };
    }
}
