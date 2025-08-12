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
     * @param {string} uuid
     * @param {string|null} reason
     */
    async addBlacklist(uuid, reason = null) {
        await this.#client.sendAPIRequest(this.#section, "addBlacklist", "POST", [
            {
                name: "uuid",
                value: uuid,
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
     * Removes user's SCF blacklist.
     * @param {string} uuid
     */
    async removeBlacklist(uuid) {
        await this.#client.sendAPIRequest(this.#section, "removeBlacklist", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Checks if a player is blacklisted from SCF Services.
     * @param {string} uuid
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
     * @param {string} discord_id
     * @param {string} uuid
     */
    async verify(discord_id, uuid) {
        await this.#client.sendAPIRequest(this.#section, "verify", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Removes user verification status in SCF Discord.
     * @param {string} uuid
     */
    async unverify(uuid) {
        await this.#client.sendAPIRequest(this.#section, "unverify", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Returns the information about the linked user.
     * @param {string|null} discord_id
     * @param {string|null} uuid
     */
    async getVerified(discord_id = null, uuid = null) {
        let args = [];
        if(uuid){
            args.push({
                name: "uuid",
                value: uuid,
                type: Args.GET,
            });
        }
        if(discord_id){
            args.push({
                name: "discord_id",
                value: discord_id,
                type: Args.GET,
            });
        }

        let response = await this.#client.sendAPIRequest(this.#section, "getVerified", "GET", args);

        return {
            uuid: response.uuid,
            discord_id: response.discord_id
        };
    }
}
