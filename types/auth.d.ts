import { Storage } from './index';
import { Token } from './token';

export default class Auth<T = any> {
  ctx: any;
  $state: any;
  $storage: Storage;
  user: Partial<T>;
  loggedIn: boolean;
  loginWith(strategyName: string, ...args: any): Promise<never>;
  login(...args: any): Promise<never>;
  logout(): Promise<never>;
  fetchUser(): Promise<never>;
  fetchUserOnce(): Promise<never>;
  hasScope(scopeName: string): boolean;
  onError(handler: (error: Error, name: string, endpoint: any) => void): any;
  setUser(user?: Partial<T>): any;
  reset(): Promise<never>;
  redirect(name: string): any;
  onRedirect(listener: () => void): void;
  strategy(): string;
  registerStrategy(strategyName: string, strategy: object): void;
  setStrategy(strategyName: string): void;
  setUserToken(token: string): Promise<void>;
  refreshTokens(): Promise<any>;
  token: Token;
  refreshToken: Token;

}
