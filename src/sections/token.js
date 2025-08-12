import { Args } from "../utils/utils.js";
import APIError from "../APIError.js";

export default class Token {
    /**
     * @type {import('../../index').default}
     */

    #client;
    constructor(client) {
        this.#client = client;
    }
    /**
     * Returns an SCF Token for the provided Discord Token.
     */
    async auth(token) {
        let response = await this.#client.sendAPIRequest(
            "token",
            "auth",
            "POST",
            [
                {
                    name: "token",
                    value: token,
                    type: Args.POST,
                },
            ],
            false
        );

        return {
            token: response.token,
            owner: response.owner,
        };
    }

    /**
     * Issues an SCF Token for the provided SCF ID.
     */
    async issue(owner) {
        let response = await this.#client.sendAPIRequest("token", "issue", "GET", [
            {
                name: "owner",
                value: owner,
                type: Args.GET,
            },
        ]);

        return {
            token: response.token,
        };
    }

    /**
     * Returns the information about the used API token.
     */
    async me() {
        let response = await this.#client.sendAPIRequest("token", "me", "GET", []);

        return {
            scf_id: response.information.scf_id,
            info: {
                name: response.information.name,
                guild_id: response.information.guild_id,
                type: response.information.type,
                features: response.information.features,
                bot_id: response.information.bot_id,
            },
        };
    }
}
