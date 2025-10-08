import { Args } from "../utils/utils.js";

export default class Services {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "services";
    constructor(client) {
        this.#client = client;
    }

    /**
     * Obtains configuration variables for the service of the API Key.
     */
    async getConfig() {
        let response = await this.#client.sendAPIRequest(this.#section, "getConfig", "GET", []);

        return response?.config ?? {};
    }
}
