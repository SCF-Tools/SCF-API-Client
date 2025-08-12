// Utils
import APIError from "./src/APIError.js";
import axios from "axios";
import { Args } from "./src/utils/utils.js";

// Sections
import Token from "./src/sections/token.js";

export default class SCFAPIClient {
    #provider;
    #discord_token;
    #scf_token;

    // Sections
    API = {
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
}
