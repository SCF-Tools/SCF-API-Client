'use strict';

var axios = require('axios');

class APIError extends Error {
    constructor(message, data){
        super(message);
        this.name = "SCF API Error";
        this.data = data;
        this.type = "APIError";
    }
}

const Args = {
    GET: "GET",
    POST: "POST",
};

class Bridge {
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
     * @param {string} uuid
     * @param {string} discord_id
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
     * @param {string|null} uuid
     * @param {string|null} discord_id
     */
    async getLinked(uuid = null, discord_id = null) {
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

        let response = await this.#client.sendAPIRequest(this.#section, "getLinked", "GET", args);

        return {
            uuid: response.uuid,
            discord_id: response.discord_id,
        };
    }

    /**
     * Sets the status of the bridge of the token.
     * @param {string} connected
     * @param {string} version
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
     * @param {string} scf_id
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

class Bridgelock {
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

class Experimental {
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

class GTW {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "gtw";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Generates hints for a provided word.
     * @param {string} word
     */
    async start(word) {
        let response = await this.#client.sendAPIRequest(this.#section, "start", "GET", [
            {
                name: "word",
                value: word,
                type: Args.GET,
            },
        ]);

        return {
            description: response.description ?? "",
            hints: response.hints ?? [],
        };
    }

    /**
     * @typedef {Object} PlayerEntry
     * @property {string} discord_id
     * @property {number} total

     * @typedef {Object} Leaderboard
     * @property {PlayerEntry[]} weekly
     * @property {PlayerEntry[]} overall

     * @typedef {Object} GetTopResponse
     * @property {Leaderboard} score
     * @property {Leaderboard} rounds
     * 
     * Returns Guess The Word leaderboards.
     * @returns {Promise<GetTopResponse>}
     */
    async getTop() {
        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", []);

        return {
            score: {
                weekly: response?.top?.score?.weekly ?? [],
                overall: response?.top?.score?.overall ?? [],
            },
            rounds: {
                weekly: response?.top?.rounds?.weekly ?? [],
                overall: response?.top?.rounds?.overall ?? [],
            }
        };
    }

    /**
     * Awards points for Guess The Word minigame.
     * @param {string} discord_id
     * @param {number} points
     */
    async awardPoints(discord_id, points) {
        let response = await this.#client.sendAPIRequest(this.#section, "awardPoints", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "points",
                value: points,
                type: Args.POST,
            },
        ]);

        return {
            game_id: response.game_id ?? null,
        };
    }
}

class Inactive {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "inactive";

    constructor(client) {
        this.#client = client;
    }

    /**
     * Adds a player to the inactive list.
     * @param {string} uuid
     * @param {number} days
     */
    async add(uuid, days) {
        let response = await this.#client.sendAPIRequest(this.#section, "add", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
            {
                name: "days",
                value: days,
                type: Args.POST,
            },
        ]);

        return {
            expires: response.expires ?? 0,
        };
    }

    /**
     * Removes a player from the inactive list.
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

    /**
     * Checks if a player is on the inactive list.
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

        return {
            protected: response?.info?.state ?? false,
            requested: response?.info?.requested ?? 0,
            expired: response?.info?.expired ?? 0,
        };
    }

    /**
     * @typedef {Object} PlayerEntry
     * @property {string} uuid
     * @property {number} requested
     * @property {number} expired
     * 
     * Returns the list of all inactive players.
     * @returns {Promise<PlayerEntry[]>}
     */
    async list() {
        let response = await this.#client.sendAPIRequest(this.#section, "list", "GET", []);

        return response.list ?? [];
    }
}

class Longpoll {
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
     * @param {string|number} request_id
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

class Minigames {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "minigames";

    constructor(client) {
        this.#client = client;
    }

    // TODO: Implement authorizations mechanism for games
    // Put hold on user's funds, and subtract/remove hold on win
    // Put a hold on user's game ID, so that it doesn't
    // subtract if something goes wrong, only when game is completed
    // successfully.

    /**
     * Updates coin balance for a profile.
     * @param {string} discord_id
     * @param {number} amount
     */
    async updateCoins(discord_id, amount) {
        let negative = amount < 0;
        amount = Math.abs(amount);

        await this.#client.sendAPIRequest(this.#section, "updateCoins", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "amount",
                value: amount,
                type: Args.POST,
            },
            {
                name: "negative",
                value: negative ? 1 : 0,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Resets a specific cooldown timer for a user.
     * @param {string} discord_id
     * @param {string} cooldown
     * @param {number} time
     */
    async resetCooldown(discord_id, cooldown, time) {
        await this.#client.sendAPIRequest(this.#section, "resetCooldown", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "cooldown",
                value: cooldown,
                type: Args.POST,
            },
            {
                name: "time",
                value: time,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Logs a completed minigame outcome.
     * @param {string} game_id
     * @param {string} discord_id
     * @param {string} game
     * @param {number} bet
     * @param {number} outcome
     */
    async logOutcome(game_id, discord_id, game, bet, outcome) {
        await this.#client.sendAPIRequest(this.#section, "logOutcome", "POST", [
            {
                name: "game_id",
                value: game_id,
                type: Args.POST,
            },
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "game",
                value: game,
                type: Args.POST,
            },
            {
                name: "bet",
                value: bet,
                type: Args.POST,
            },
            {
                name: "outcome",
                value: outcome,
                type: Args.POST,
            },
        ]);
    }

    /**
     * @typedef {Object} Coins
     * @property {number} purse
     * @property {number} bank
     * @property {number} total
     * 
     * @typedef {Object} Cooldowns
     * @property {string} work
     * @property {string} crime
     * @property {string} beg
     * @property {string} social
     *
     * @typedef {Object} PlayerEntry
     * @property {string} discord_id
     * @property {Coins} coins
     * @property {Cooldowns} cooldowns
     * 
     * Returns top 10 minigame players, sorted by networth.
     * @returns {Promise<PlayerEntry[]>}
     */
    async getTop() {
        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", []);

        return response.top ?? [];
    }

    /**
     * 
     * Returns the minigame profile for a Discord ID.
     * @param {string} discord_id
     * @returns {Promise<PlayerEntry>}
     */
    async getProfile(discord_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getProfile", "GET", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.GET,
            },
        ]);

        return response.profile ?? {};
    }

    /**
     * Transfers coins between bank and purse.
     * @param {string} discord_id
     * @param {number} amount
     * @param {boolean} withdraw
     */
    async bankTransfer(discord_id, amount, withdraw = false) {
        await this.#client.sendAPIRequest(this.#section, "bankTransfer", "POST", [
            {
                name: "discord_id",
                value: discord_id,
                type: Args.POST,
            },
            {
                name: "amount",
                value: amount,
                type: Args.POST,
            },
            {
                name: "withdraw",
                value: withdraw ? 1 : 0,
                type: Args.POST,
            },
        ]);
    }
}

class Score {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "score";

    constructor(client) {
        this.#client = client;
    }

    /**
     * @typedef {Object} PlaceEntry
     * @property {number} place
     * @property {number} score
     * @property {string} nick
     *
     * @typedef {Object} PlayerEntry
     * @property {string} uuid
     * @property {number} score
     * @property {string} nick
     */

    /**
     * Returns the score and the place of a user in the guild of the token this week.
     * @param {string} uuid
     * @param {boolean} overall
     * @returns {Promise<PlaceEntry>}
     */
    async getCutoff(uuid, overall = false) {
        let response = await this.#client.sendAPIRequest(this.#section, "getCutoff", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "overall",
                value: overall ? 1 : 0,
                type: Args.GET,
            },
        ]);

        return {
            place: response.place ?? 0,
            score: response.score ?? 0,
            nick: response.nick ?? "",
        };
    }

    /**
     * Returns the score and the place of a user in the guild of the token in the past 7 days.
     * @param {string} uuid
     * @param {boolean} overall
     * @returns {Promise<PlaceEntry>}
     */
    async getRolling(uuid, overall = false) {
        let response = await this.#client.sendAPIRequest(this.#section, "getRolling", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "overall",
                value: overall ? 1 : 0,
                type: Args.GET,
            },
        ]);

        return {
            place: response.place ?? 0,
            score: response.score ?? 0,
            nick: response.nick ?? "",
        };
    }

    /**
     * Logs the information about a sent guild message.
     * @param {string} uuid
     * @param {string} nick
     * @param {string} guild_id
     */
    async saveMessage(uuid, nick, guild_id) {
        await this.#client.sendAPIRequest(this.#section, "saveMessage", "POST", [
            {
                name: "uuid",
                value: uuid,
                type: Args.POST,
            },
            {
                name: "nick",
                value: nick,
                type: Args.POST,
            },
            {
                name: "guild_id",
                value: guild_id,
                type: Args.POST,
            },
        ]);
    }

    /**
     * Returns the top players in a guild based on their score.
     * @param {string|null} guild_id
     * @returns {Promise<{total: number, list: PlayerEntry[]}>}
     */
    async getTop(guild_id = null) {
        let args = [];
        if (guild_id) {
            args.push({
                name: "guild_id",
                value: guild_id,
                type: Args.GET,
            });
        }
        let response = await this.#client.sendAPIRequest(this.#section, "getTop", "GET", args);

        return {
            total: response.total ?? 0,
            list: response.players ?? [],
        };
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns the sum of all player entries starting from a specific period.
     * @param {string} uuid
     * @param {string} type
     * @param {string} period_id
     * @returns {Promise<{
     *    uuid: string,
     *    nick: string,
     *    guild_id: string,
     *    messages: string,
     *    score: string,
     *    last_message: string,
     * }>}
     */
    async getPlayerSummary(uuid, type, period_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerSummary", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "type",
                value: type,
                type: Args.GET,
            },
            {
                name: "period_id",
                value: period_id,
                type: Args.GET,
            },
        ]);

        return response.entry ?? {};
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns the needed player entry.
     * @param {string} uuid - The UUID of the user.
     * @param {string} type - A type of a record - "hour", "day", or "week".
     * @param {string} period_id - An ID of a period to get the entry for.
     * @returns {Promise<{
     *    uuid: string,
     *    nick: string,
     *    guild_id: string,
     *    messages: string,
     *    score: string,
     *    last_message: string,
     * }>}
     */
    async getPlayerEntry(uuid, type, period_id) {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerEntry", "GET", [
            {
                name: "uuid",
                value: uuid,
                type: Args.GET,
            },
            {
                name: "type",
                value: type,
                type: Args.GET,
            },
            {
                name: "period_id",
                value: period_id,
                type: Args.GET,
            },
        ]);

        return response.entry ?? {};
    }
}

class Server {
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

class Staff {
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

class Stats {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "stats";

    constructor(client) {
        this.#client = client;
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns guild player statistics over time.
     * @returns {Promise<{
     *   weeks: string[],
     *   points: Object,
     *   guilds: Object
     * }>}
     */

    async getPlayerStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getPlayerStats", "GET", [], false);

        return {
            weeks: response.weeks ?? [],
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }

    /**
     * This method is unreliable. Only use it when you know what you are doing!
     * Returns hourly message statistics for guilds.
     * @returns {Promise<{points: Object, guilds: Object}>}
     */
    async getHourlyStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getHourlyStats", "GET", [], false);

        return {
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }

    /**
     * Returns weekly guild statistics.
     * @returns {Promise<{weeks: string[], points: Object, guilds: Object}>}
     */
    async getWeeklyStats() {
        let response = await this.#client.sendAPIRequest(this.#section, "getWeeklyStats", "GET", [], false);

        return {
            weeks: response.weeks ?? [],
            points: response.points ?? {},
            guilds: response.guilds ?? {},
        };
    }
}

class Token {
    /**
     * @type {import('../../index').default}
     */

    #client;
    #section = "token";
    constructor(client) {
        this.#client = client;
    }
    /**
     * Returns an SCF Token for the provided Discord Token.
     */
    async auth(token) {
        let response = await this.#client.sendAPIRequest(
            this.#section,
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
        let response = await this.#client.sendAPIRequest(this.#section, "issue", "POST", [
            {
                name: "owner",
                value: owner,
                type: Args.POST,
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
        let response = await this.#client.sendAPIRequest(this.#section, "me", "GET", []);

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

// Utils

class SCFAPIClient {
    #provider;
    #discord_token;
    #scf_token;
    #test_mode = false;
    #test_function;

    // Sections
    API = {
        bridge: new Bridge(this),
        bridgelock: new Bridgelock(this),
        experimental: new Experimental(this),
        gtw: new GTW(this),
        inactive: new Inactive(this),
        longpoll: new Longpoll(this),
        minigames: new Minigames(this),
        score: new Score(this),
        server: new Server(this),
        staff: new Staff(this),
        stats: new Stats(this),
        token: new Token(this),
    };

    /**
     *
     * @param {String} provider
     * @param {?String} discord_token
     * @param {?String} scf_token
     */
    constructor(provider, discord_token = null, scf_token = null) {
        this.#provider = provider;

        if (!discord_token && !scf_token) {
            throw new APIError("Either Discord Token or SCF Token must be provided.", {
                type: "internal",
            });
        }

        this.#discord_token = discord_token;
        this.#scf_token = scf_token;
    }

    async sendAPIRequest(section, method, http_method, params, auth = true) {
        const provider = new URL(this.#provider);
        provider.searchParams.append("method", `${section}.${method}`);

        let config = {
            method: http_method,
            headers: {
                "User-Agent": "SCF-API-Client",
                "Content-Type": "application/json",
            },
        };

        for (const param of params) {
            if (param.type == Args.GET) {
                provider.searchParams.append(param.name, param.value);
            }
            if (param.type == Args.POST) {
                if (!config.data) config.data = {};
                config.data[param.name] = param.value;
            }
        }

        config.url = provider.href;

        if (auth) {
            let token = await this.getToken();
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        if(this.#test_mode){
            config.params = Object.fromEntries(provider.searchParams);
            if(this.#test_function){
                this.#test_function(config);
            }
            return;
        }

        let response;

        try {
            response = await axios(config);
        } catch (error) {
            throw new APIError("Failed to send API request.", {
                type: "request_failed",
                axios: error,
            });
        }

        if (!response?.data) {
            throw new APIError("API has returned no data.", {
                type: "request_failed",
                axios: response,
            });
        }

        let data = response.data;

        if (data.code && !data.success) {
            throw new APIError(data.message, {
                type: data.code,
                axios: response,
            });
        }

        return data;
    }

    async getToken() {
        if (!this.#scf_token) {
            await this.updateToken();
        }

        return this.#scf_token;
    }

    async updateToken() {
        if (!this.#discord_token) {
            throw new APIError("Discord Token is required to authorize.");
        }

        try{
            let response = await this.API.token.auth(this.#discord_token);
            this.#scf_token = response.token;
        }catch(e){
            if(e?.type == "APIError"){
                console.log(e);
            }
        }
    }

    testMode(callback) {
        this.#test_mode = true;
        this.#test_function = callback;
    }
}

module.exports = SCFAPIClient;
