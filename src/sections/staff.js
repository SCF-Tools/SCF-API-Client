import { Args } from "../utils/utils.js";

export default class Staff {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "staff";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Creates a staff log entry.
     * @param {string} actor
     * @param {string} action
     * @param {string} affected
     * @param {string} description
     * @returns {Promise<{id: string}>}
     */
    async createLog(actor, action, affected = "", description = "") {
        let response = await this.#client.sendAPIRequest(this.#section, "createLog", "POST", [
            {
                name: "actor",
                value: actor,
                type: Args.POST,
            },
            {
                name: "action",
                value: action,
                type: Args.POST,
            },
            {
                name: "affected",
                value: affected,
                type: Args.POST,
            },
            {
                name: "description",
                value: description,
                type: Args.POST,
            },
        ]);

        return {
            id: response.id ?? "",
        };
    }

    /**
     * Approves a staff log entry.
     * @param {string} id
     * @param {string} reviewer
     */
    async approveLog(id, reviewer) {
        await this.#client.sendAPIRequest(this.#section, "approveLog", "POST", [
            {
                name: "id",
                value: id,
                type: Args.POST,
            },
            {
                name: "reviewer",
                value: reviewer,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Denies (removes) a staff log entry.
     * @param {string} id
     */
    async denyLog(id) {
        await this.#client.sendAPIRequest(this.#section, "denyLog", "POST", [
            {
                name: "id",
                value: id,
                type: Args.POST,
            },
        ]);
    }

    /**
     * @typedef {Object} StaffLog
     * @property {number} action_id
     * @property {string} action
     * @property {string} affected
     * @property {string} description
     * @property {string} timestamp
     * @property {string} approved_by
     * 
     * Returns staff log entries filtered by actor.
     * @param {string} actor
     * @returns {Promise<StaffLog[]>}
     */
    async getLogs(actor) {
        let response = await this.#client.sendAPIRequest(this.#section, "getLogs", "GET", [
            {
                name: "actor",
                value: actor,
                type: Args.GET,
            },
        ]);

        return response.actions ?? [];
    }
}