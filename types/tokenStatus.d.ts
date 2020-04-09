export default class TokenStatus {
    constructor(token: any, tokenExpiresAt: any);
    unknown(): boolean;
    valid(): boolean;
    expired(): boolean;
}
