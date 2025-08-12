export default class APIError extends Error {
    constructor(message, data){
        super(message);
        this.name = "SCF API Error";
        this.data = data;
        this.type = "APIError";
    }
}