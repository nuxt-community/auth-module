import Auth from "./auth"

export default class RequestHandler {
    constructor(auth: any);
    $auth: Auth;
    _getUpdatedRequestConfig(config: any): any;
    setHeader(token: any): void;
    clearHeader(): void;
    initializeRequestInterceptor(): void;
}
