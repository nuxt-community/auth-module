export default class RequestHandler {
    constructor(auth: any);
    $auth: any;
    _getUpdatedRequestConfig(config: any): any;
    setHeader(token: any): void;
    clearHeader(): void;
    initializeRequestInterceptor(): void;
}
