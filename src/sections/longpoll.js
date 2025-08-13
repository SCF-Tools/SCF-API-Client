import { Args } from "../utils/utils.js";

export default class Longpoll {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "longpoll";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Creates a longpoll request.
     * @param {string} action
     * @param {string} executor
     * @param {object} payload
     */
    async create(action, executor, payload) {
        await this.#client.sendAPIRequest(this.#section, "create", "POST", [
            {
                name: "action",
                value: action,
                type: Args.POST,
            },
            {
                name: "executor",
                value: executor,
                type: Args.POST,
            },
            {
                name: "payload",
                value: JSON.stringify(payload),
                type: Args.POST,
            },
        ]);
    }

    /**
     * Removes a longpoll request.
     * @param {string|number} request_id - The ID of the longpoll request.
     */
    async remove(request_id) {
        await this.#client.sendAPIRequest(this.#section, "remove", "POST", [
            {
                name: "request_id",
                value: request_id,
                type: Args.POST,
            },
        ]);
    }

    /**
     * @typedef {Object} LongpollRequest
     * @property {number} rid
     * @property {string} action
     * @property {object} data
     * 
     * Returns the list of longpoll requests to be handled.
     * @returns {Promise<LongpollRequest[]>}
     */
    async getApplicable() {
        let response = await this.#client.sendAPIRequest(this.#section, "getApplicable", "GET", []);

        return response.requests ?? [];
    }
}