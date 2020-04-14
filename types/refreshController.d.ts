import { Auth } from './index';
export default class RefreshController {
    constructor(scheme: any);
    scheme: any;
    $auth: Auth;
    handleRefresh(): Promise<any>;
    initializeScheduledRefresh(): void;
    initializeRequestInterceptor(refreshEndpoint: any): void;
    reset(): void;
}
