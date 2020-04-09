import TokenStatus from "./tokenStatus";
import { Auth } from './index';

export interface TokenBase {
    constructor(auth: any);
    $auth: Auth;
    get(): any;
    set(tokenValue: any): any;
    sync(): any;
    reset(): void;
    status(): TokenStatus;
}

export class RefreshToken extends TokenBase {}

export class Token extends TokenBase {
  refreshIn(): number;
}
