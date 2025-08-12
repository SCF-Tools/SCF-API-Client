import { Args } from "../utils/utils.js";

export default class Bridge {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "bridge";
    constructor(client) {
        this.#client = client;
    }

    /**
     * Links a Discord account to a Hypixel account via bridge verification.
     */
    async link(discord_id, uuid) {
        await this.#client.sendAPIRequest(this.#section, "link", "POST", [
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
     * Returns the information about the linked user.
     */
    async getLinked(uuid = null, discord_id = null) {
        let response = await this.#client.sendAPIRequest(this.#section, "getLinked", "GET", [
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
            discord_id: response.discord_id,
        };
    }

    /**
     * Sets the status of the bridge of the token.
     */
    async setStatus(connected, version) {
        await this.#client.sendAPIRequest(this.#section, "setStatus", "POST", [
            {
                name: "connected",
                value: connected,
                type: Args.POST,
            },
            {
                name: "version",
                value: version,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Returns the status of the bridge of the token.
     */
    async getStatus(scf_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getStatus", "GET", [
            {
                name: "scf_id",
                value: scf_id,
                type: Args.GET,
            },
        ]);

        return {
            connected: response.status.connected,
            version: response.status.version,
            timestamp: response.status.timestamp
        };
    }
}