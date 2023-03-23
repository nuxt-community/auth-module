import type { AxiosRequestConfig } from 'axios';
import type { AxiosResponse } from 'axios';
import type { Context } from '@nuxt/types';
import type { Middleware } from '@nuxt/types';
import type { NuxtAxiosInstance } from '@nuxtjs/axios';

export declare class Auth {
    ctx: Context;
    options: ModuleOptions;
    strategies: Record<string, Scheme>;
    error: Error;
    $storage: Storage_2;
    $state: any;
    private _errorListeners;
    private _redirectListeners;
    private _stateWarnShown;
    private _getStateWarnShown;
    constructor(ctx: Context, options: ModuleOptions);
    get state(): any;
    get strategy(): Scheme;
    getStrategy(throwException?: boolean): Scheme;
    get user(): Record<string, unknown> | null;
    get loggedIn(): boolean;
    get busy(): boolean;
    init(): Promise<void>;
    getState(key: string): unknown;
    registerStrategy(name: string, strategy: Scheme): void;
    setStrategy(name: string): Promise<HTTPResponse | void>;
    mounted(...args: unknown[]): Promise<HTTPResponse | void>;
    loginWith(name: string, ...args: unknown[]): Promise<HTTPResponse | void>;
    login(...args: unknown[]): Promise<HTTPResponse | void>;
    fetchUser(...args: unknown[]): Promise<HTTPResponse | void>;
    logout(...args: unknown[]): Promise<void>;
    setUserToken(token: string | boolean, refreshToken?: string | boolean): Promise<HTTPResponse | void>;
    reset(...args: unknown[]): void;
    refreshTokens(): Promise<HTTPResponse | void>;
    check(...args: unknown[]): SchemeCheck;
    fetchUserOnce(...args: unknown[]): Promise<HTTPResponse | void>;
    setUser(user: unknown): void;
    request(endpoint: HTTPRequest, defaults?: HTTPRequest): Promise<HTTPResponse>;
    requestWith(strategy: string, endpoint: HTTPRequest, defaults?: HTTPRequest): Promise<HTTPResponse>;
    wrapLogin(promise: Promise<HTTPResponse | void>): Promise<HTTPResponse | void>;
    onError(listener: ErrorListener): void;
    callOnError(error: Error, payload?: {}): void;
    redirect(name: string, noRouter?: boolean): void;
    onRedirect(listener: RedirectListener): void;
    callOnRedirect(to: string, from: string): string;
    hasScope(scope: string): boolean;
}

export declare function auth0(_nuxt: any, strategy: ProviderPartialOptions<Auth0ProviderOptions>): void;

export declare interface Auth0ProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
    domain: string;
}

export declare class Auth0Scheme extends Oauth2Scheme {
    logout(): void;
}

export declare const authMiddleware: Middleware;

export declare class BaseScheme<OptionsT extends SchemeOptions> {
    $auth: Auth;
    options: OptionsT;
    constructor($auth: Auth, ...options: OptionsT[]);
    get name(): string;
}

/**
 * A metadata document that contains most of the OpenID Provider's information,
 * such as the URLs to use and the location of the service's public signing keys.
 * You can find this document by appending the discovery document path
 * (/.well-known/openid-configuration) to the authority URL(https://example.com)
 * Eg. https://example.com/.well-known/openid-configuration
 *
 * More info: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
 */
export declare class ConfigurationDocument {
    scheme: OpenIDConnectScheme;
    $storage: Storage_2;
    key: string;
    constructor(scheme: OpenIDConnectScheme, storage: Storage_2);
    _set(value: OpenIDConnectConfigurationDocument | boolean): boolean | OpenIDConnectConfigurationDocument;
    get(): OpenIDConnectConfigurationDocument;
    set(value: OpenIDConnectConfigurationDocument | boolean): boolean | OpenIDConnectConfigurationDocument;
    request(): Promise<void>;
    validate(): void;
    init(): Promise<void>;
    setSchemeEndpoints(): void;
    reset(): void;
}

export declare class ConfigurationDocumentRequestError extends Error {
    constructor();
}

export declare class CookieScheme<OptionsT extends CookieSchemeOptions = CookieSchemeOptions> extends LocalScheme<OptionsT> implements TokenableScheme<OptionsT> {
    constructor($auth: Auth, options: SchemePartialOptions<CookieSchemeOptions>);
    mounted(): Promise<HTTPResponse | void>;
    check(): SchemeCheck;
    login(endpoint: HTTPRequest): Promise<HTTPResponse>;
    reset(): void;
}

export declare interface CookieSchemeCookie {
    name: string;
}

export declare interface CookieSchemeEndpoints extends LocalSchemeEndpoints {
    csrf: HTTPRequest;
}

export declare interface CookieSchemeOptions extends LocalSchemeOptions {
    endpoints: CookieSchemeEndpoints;
    cookie: CookieSchemeCookie;
}

export declare function discord(nuxt: any, strategy: ProviderPartialOptions<DiscordProviderOptions>): void;

export declare interface DiscordProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
}

export declare interface EndpointsOption {
    [endpoint: string]: string | HTTPRequest | false;
}

export declare type ErrorListener = (...args: unknown[]) => void;

export declare class ExpiredAuthSessionError extends Error {
    constructor();
}

export declare function facebook(_nuxt: any, strategy: ProviderPartialOptions<FacebookProviderOptions>): void;

export declare interface FacebookProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
}

export declare function github(nuxt: any, strategy: ProviderPartialOptions<GithubProviderOptions>): void;

export declare interface GithubProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
}

export declare function google(_nuxt: any, strategy: ProviderPartialOptions<GoogleProviderOptions>): void;

export declare interface GoogleProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
}

export declare type HTTPRequest = AxiosRequestConfig;

export declare type HTTPResponse = AxiosResponse;

export declare class IdToken {
    scheme: IdTokenableScheme;
    $storage: Storage_2;
    constructor(scheme: IdTokenableScheme, storage: Storage_2);
    get(): string | boolean;
    set(tokenValue: string | boolean): string | boolean;
    sync(): string | boolean;
    reset(): void;
    status(): TokenStatus;
    private _getExpiration;
    private _setExpiration;
    private _syncExpiration;
    private _updateExpiration;
    private _setToken;
    private _syncToken;
    userInfo(): unknown;
}

export declare interface IdTokenableScheme<OptionsT extends IdTokenableSchemeOptions = IdTokenableSchemeOptions> extends Scheme<OptionsT> {
    idToken: IdToken;
    requestHandler: RequestHandler;
}

export declare interface IdTokenableSchemeOptions extends SchemeOptions {
    idToken: TokenOptions;
}

export declare function laravelJWT(_nuxt: any, strategy: ProviderPartialOptions<LaravelJWTProviderOptions>): void;

export declare interface LaravelJWTProviderOptions extends ProviderOptions, RefreshSchemeOptions {
    url: string;
}

export declare class LaravelJWTScheme extends RefreshScheme {
    protected updateTokens(response: HTTPResponse, { isRefreshing, updateOnRefresh }?: {
        isRefreshing?: boolean;
        updateOnRefresh?: boolean;
    }): void;
}

export declare function laravelPassport(nuxt: any, strategy: PartialPassportOptions | PartialPassportPasswordOptions): void;

export declare interface LaravelPassportPasswordProviderOptions extends ProviderOptions, RefreshSchemeOptions {
    url: string;
}

export declare interface LaravelPassportProviderOptions extends ProviderOptions, Oauth2SchemeOptions {
    url: string;
}

export declare function laravelSanctum(_nuxt: any, strategy: ProviderPartialOptions<LaravelSanctumProviderOptions>): void;

export declare interface LaravelSanctumProviderOptions extends ProviderOptions, CookieSchemeOptions {
    url: string;
}

export declare class LocalScheme<OptionsT extends LocalSchemeOptions = LocalSchemeOptions> extends BaseScheme<OptionsT> implements TokenableScheme<OptionsT> {
    token: Token;
    requestHandler: RequestHandler;
    constructor($auth: Auth, options: SchemePartialOptions<LocalSchemeOptions>, ...defaults: SchemePartialOptions<LocalSchemeOptions>[]);
    check(checkStatus?: boolean): SchemeCheck;
    mounted({ tokenCallback, refreshTokenCallback }?: {
        tokenCallback?: () => void;
        refreshTokenCallback?: any;
    }): Promise<HTTPResponse | void>;
    login(endpoint: HTTPRequest, { reset }?: {
        reset?: boolean;
    }): Promise<HTTPResponse>;
    setUserToken(token: string): Promise<HTTPResponse | void>;
    fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void>;
    logout(endpoint?: HTTPRequest): Promise<void>;
    reset({ resetInterceptor }?: {
        resetInterceptor?: boolean;
    }): void;
    protected updateTokens(response: HTTPResponse): void;
    protected initializeRequestInterceptor(): void;
}

export declare interface LocalSchemeEndpoints extends EndpointsOption {
    login: HTTPRequest;
    logout: HTTPRequest | false;
    user: HTTPRequest | false;
}

export declare interface LocalSchemeOptions extends TokenableSchemeOptions {
    endpoints: LocalSchemeEndpoints;
    user: UserOptions;
    clientId: string | false;
    grantType: string | false;
    scope: string[] | false;
}

export declare type MatchedRoute = {
    components: VueComponent[];
};

export declare const moduleDefaults: ModuleOptions;

export declare interface ModuleOptions {
    plugins?: Array<string | {
        src: string;
        ssr: boolean;
    }>;
    ignoreExceptions: boolean;
    resetOnError: boolean | ((...args: unknown[]) => boolean);
    defaultStrategy: string;
    watchLoggedIn: boolean;
    rewriteRedirects: boolean;
    fullPathRedirect: boolean;
    scopeKey: string;
    redirect: {
        login: string;
        logout: string;
        callback: string;
        home: string;
    };
    vuex: {
        namespace: string;
    };
    cookie: {
        prefix: string;
        options: {
            path: string;
            expires?: number | Date;
            maxAge?: number;
            domain?: string;
            secure?: boolean;
        };
    } | false;
    localStorage: {
        prefix: string;
    } | false;
    strategies: {
        [strategy: string]: Strategy;
    };
}

export declare class Oauth2Scheme<OptionsT extends Oauth2SchemeOptions = Oauth2SchemeOptions> extends BaseScheme<OptionsT> implements RefreshableScheme {
    req: any;
    token: Token;
    refreshToken: RefreshToken;
    refreshController: RefreshController;
    requestHandler: RequestHandler;
    constructor($auth: Auth, options: SchemePartialOptions<Oauth2SchemeOptions>, ...defaults: SchemePartialOptions<Oauth2SchemeOptions>[]);
    protected get scope(): string;
    protected get redirectURI(): string;
    protected get logoutRedirectURI(): string;
    check(checkStatus?: boolean): SchemeCheck;
    mounted(): Promise<HTTPResponse | void>;
    reset(): void;
    login(_opts?: {
        state?: string;
        params?: any;
        nonce?: string;
    }): Promise<void>;
    logout(): void;
    fetchUser(): Promise<void>;
    _handleCallback(): Promise<boolean | void>;
    refreshTokens(): Promise<HTTPResponse | void>;
    protected updateTokens(response: HTTPResponse): void;
    protected pkceChallengeFromVerifier(v: string, hashValue: boolean): Promise<string>;
    protected generateRandomString(): string;
    private _sha256;
    private _base64UrlEncode;
}

export declare interface Oauth2SchemeEndpoints extends EndpointsOption {
    authorization: string;
    token: string;
    userInfo: string;
    logout: string | false;
}

export declare interface Oauth2SchemeOptions extends SchemeOptions, TokenableSchemeOptions, RefreshableSchemeOptions {
    endpoints: Oauth2SchemeEndpoints;
    user: UserOptions;
    responseMode: 'query.jwt' | 'fragment.jwt' | 'form_post.jwt' | 'jwt';
    responseType: 'code' | 'token' | 'id_token' | 'none' | string;
    grantType: 'implicit' | 'authorization_code' | 'client_credentials' | 'password' | 'refresh_token' | 'urn:ietf:params:oauth:grant-type:device_code';
    accessType: 'online' | 'offline';
    redirectUri: string;
    logoutRedirectUri: string;
    clientId: string | number;
    scope: string | string[];
    state: string;
    codeChallengeMethod: 'implicit' | 'S256' | 'plain';
    acrValues: string;
    audience: string;
    autoLogout: boolean;
}

export declare type OpenIDConnectConfigurationDocument = {
    issuer?: string;
    authorization_endpoint?: string;
    token_endpoint?: string;
    token_endpoint_auth_methods_supported?: string[];
    token_endpoint_auth_signing_alg_values_supported?: string[];
    userinfo_endpoint?: string;
    check_session_iframe?: string;
    end_session_endpoint?: string;
    jwks_uri?: string;
    registration_endpoint?: string;
    scopes_supported?: string[];
    response_types_supported?: string[];
    acr_values_supported?: string[];
    response_modes_supported?: string[];
    grant_types_supported?: string[];
    subject_types_supported?: string[];
    userinfo_signing_alg_values_supported?: string[];
    userinfo_encryption_alg_values_supported?: string[];
    userinfo_encryption_enc_values_supported?: string[];
    id_token_signing_alg_values_supported?: string[];
    id_token_encryption_alg_values_supported?: string[];
    id_token_encryption_enc_values_supported?: string[];
    request_object_signing_alg_values_supported?: string[];
    display_values_supported?: string[];
    claim_types_supported?: string[];
    claims_supported?: string[];
    claims_parameter_supported?: boolean;
    service_documentation?: string;
    ui_locales_supported?: string[];
};

export declare class OpenIDConnectScheme<OptionsT extends OpenIDConnectSchemeOptions = OpenIDConnectSchemeOptions> extends Oauth2Scheme<OptionsT> {
    idToken: IdToken;
    configurationDocument: ConfigurationDocument;
    constructor($auth: Auth, options: SchemePartialOptions<OpenIDConnectSchemeOptions>, ...defaults: SchemePartialOptions<OpenIDConnectSchemeOptions>[]);
    protected updateTokens(response: HTTPResponse): void;
    check(checkStatus?: boolean): SchemeCheck;
    mounted(): Promise<void | HTTPResponse>;
    reset(): void;
    logout(): void;
    fetchUser(): Promise<void>;
    _handleCallback(): Promise<boolean>;
}

export declare interface OpenIDConnectSchemeEndpoints extends Oauth2SchemeEndpoints {
    configuration: string;
}

export declare interface OpenIDConnectSchemeOptions extends Oauth2SchemeOptions, IdTokenableSchemeOptions {
    endpoints: OpenIDConnectSchemeEndpoints;
}

export declare type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

export declare type PartialPassportOptions = ProviderPartialOptions<LaravelPassportProviderOptions>;

export declare type PartialPassportPasswordOptions = ProviderPartialOptions<LaravelPassportPasswordProviderOptions>;

export declare const ProviderAliases: {
    'laravel/jwt': string;
    'laravel/passport': string;
    'laravel/sanctum': string;
};

export declare interface ProviderOptions {
    scheme: string;
    clientSecret: string | number;
}

export declare type ProviderOptionsKeys = Exclude<keyof ProviderOptions, 'clientSecret'>;

export declare type ProviderPartialOptions<Options extends ProviderOptions & SchemeOptions> = PartialExcept<Options, ProviderOptionsKeys>;

export declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>;
};

export declare type RedirectListener = (to: string, from: string) => string;

export declare interface RefreshableScheme<OptionsT extends RefreshableSchemeOptions = RefreshableSchemeOptions> extends TokenableScheme<OptionsT> {
    refreshToken: RefreshToken;
    refreshController: RefreshController;
    refreshTokens(): Promise<HTTPResponse | void>;
}

export declare interface RefreshableSchemeOptions extends TokenableSchemeOptions {
    refreshToken: RefreshTokenOptions;
}

export declare class RefreshController {
    scheme: RefreshableScheme;
    $auth: Auth;
    private _refreshPromise;
    constructor(scheme: RefreshableScheme);
    handleRefresh(): Promise<HTTPResponse | void>;
    private _doRefresh;
}

export declare class RefreshScheme<OptionsT extends RefreshSchemeOptions = RefreshSchemeOptions> extends LocalScheme<OptionsT> implements RefreshableScheme<OptionsT> {
    refreshToken: RefreshToken;
    refreshController: RefreshController;
    refreshRequest: Promise<HTTPResponse> | null;
    constructor($auth: Auth, options: SchemePartialOptions<RefreshSchemeOptions>);
    check(checkStatus?: boolean): SchemeCheck;
    mounted(): Promise<HTTPResponse | void>;
    refreshTokens(): Promise<HTTPResponse | void>;
    setUserToken(token: string | boolean, refreshToken?: string | boolean): Promise<HTTPResponse | void>;
    reset({ resetInterceptor }?: {
        resetInterceptor?: boolean;
    }): void;
    protected updateTokens(response: HTTPResponse, { isRefreshing, updateOnRefresh }?: {
        isRefreshing?: boolean;
        updateOnRefresh?: boolean;
    }): void;
    protected initializeRequestInterceptor(): void;
}

export declare interface RefreshSchemeEndpoints extends LocalSchemeEndpoints {
    refresh: HTTPRequest;
}

export declare interface RefreshSchemeOptions extends LocalSchemeOptions, RefreshableSchemeOptions {
    endpoints: RefreshSchemeEndpoints;
    autoLogout: boolean;
}

export declare class RefreshToken {
    scheme: RefreshableScheme;
    $storage: Storage_2;
    constructor(scheme: RefreshableScheme, storage: Storage_2);
    get(): string | boolean;
    set(tokenValue: string | boolean): string | boolean;
    sync(): string | boolean;
    reset(): void;
    status(): TokenStatus;
    private _getExpiration;
    private _setExpiration;
    private _syncExpiration;
    private _updateExpiration;
    private _setToken;
    private _syncToken;
}

export declare interface RefreshTokenOptions {
    property: string | false;
    type: string | false;
    data: string | false;
    maxAge: number | false;
    required: boolean;
    tokenRequired: boolean;
    prefix: string;
    expirationPrefix: string;
}

export declare class RequestHandler {
    scheme: TokenableScheme | RefreshableScheme;
    axios: NuxtAxiosInstance;
    interceptor: number;
    constructor(scheme: TokenableScheme | RefreshableScheme, axios: NuxtAxiosInstance);
    setHeader(token: string): void;
    clearHeader(): void;
    initializeRequestInterceptor(refreshEndpoint?: string): void;
    reset(): void;
    private _needToken;
    private _getUpdatedRequestConfig;
    private _requestHasAuthorizationHeader;
}

export declare type Route = {
    matched: MatchedRoute[];
};

export declare interface Scheme<OptionsT extends SchemeOptions = SchemeOptions> {
    options: OptionsT;
    name?: string;
    $auth: Auth;
    mounted?(...args: unknown[]): Promise<HTTPResponse | void>;
    check?(checkStatus: boolean): SchemeCheck;
    login(...args: unknown[]): Promise<HTTPResponse | void>;
    fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void>;
    setUserToken?(token: string | boolean, refreshToken?: string | boolean): Promise<HTTPResponse | void>;
    logout?(endpoint?: HTTPRequest): Promise<void> | void;
    reset?(options?: {
        resetInterceptor: boolean;
    }): void;
}

export declare interface SchemeCheck {
    valid: boolean;
    tokenExpired?: boolean;
    refreshTokenExpired?: boolean;
    idTokenExpired?: boolean;
    isRefreshable?: boolean;
}

export declare interface SchemeOptions {
    name: string;
}

export declare type SchemePartialOptions<Options extends SchemeOptions> = PartialExcept<Options, keyof SchemeOptions>;

declare class Storage_2 {
    ctx: Context;
    options: StorageOptions;
    state: any;
    private _state;
    private _useVuex;
    constructor(ctx: Context, options: StorageOptions);
    setUniversal<V extends unknown>(key: string, value: V): V | void;
    getUniversal(key: string): unknown;
    syncUniversal(key: string, defaultValue?: unknown): unknown;
    removeUniversal(key: string): void;
    _initState(): void;
    setState<V extends unknown>(key: string, value: V): V;
    getState(key: string): unknown;
    watchState(key: string, fn: (value: unknown, oldValue: unknown) => void): () => void;
    removeState(key: string): void;
    setLocalStorage<V extends unknown>(key: string, value: V): V | void;
    getLocalStorage(key: string): unknown;
    removeLocalStorage(key: string): void;
    getCookies(): Record<string, unknown>;
    setCookie<V extends unknown>(key: string, value: V, options?: {
        prefix?: string;
    }): V;
    getCookie(key: string): unknown;
    removeCookie(key: string, options?: {
        prefix?: string;
    }): void;
    getPrefix(): string;
    isLocalStorageEnabled(): boolean;
    isCookiesEnabled(): boolean;
}
export { Storage_2 as Storage }

export declare type StorageOptions = ModuleOptions & {
    initialState: {
        user: null;
        loggedIn: boolean;
    };
};

export declare interface Strategy extends SchemeOptions {
    provider?: string | ((...args: unknown[]) => unknown);
    scheme: string;
    enabled: boolean;
    [option: string]: unknown;
}

export declare type StrategyOptions<SOptions extends SchemeOptions = SchemeOptions> = ProviderPartialOptions<ProviderOptions & SOptions>;

export declare class Token {
    scheme: TokenableScheme;
    $storage: Storage_2;
    constructor(scheme: TokenableScheme, storage: Storage_2);
    get(): string | boolean;
    set(tokenValue: string | boolean): string | boolean;
    sync(): string | boolean;
    reset(): void;
    status(): TokenStatus;
    private _getExpiration;
    private _setExpiration;
    private _syncExpiration;
    private _updateExpiration;
    private _setToken;
    private _syncToken;
}

export declare interface TokenableScheme<OptionsT extends TokenableSchemeOptions = TokenableSchemeOptions> extends Scheme<OptionsT> {
    token: Token;
    requestHandler: RequestHandler;
}

export declare interface TokenableSchemeOptions extends SchemeOptions {
    token: TokenOptions;
    endpoints: EndpointsOption;
}

export declare interface TokenOptions {
    property: string;
    type: string | false;
    name: string;
    maxAge: number | false;
    global: boolean;
    required: boolean;
    prefix: string;
    expirationPrefix: string;
}

export declare class TokenStatus {
    private readonly _status;
    constructor(token: string | boolean, tokenExpiresAt: number | false);
    unknown(): boolean;
    valid(): boolean;
    expired(): boolean;
    private _calculate;
}

export declare enum TokenStatusEnum {
    UNKNOWN = "UNKNOWN",
    VALID = "VALID",
    EXPIRED = "EXPIRED"
}

export declare interface UserOptions {
    property: string | false;
    autoFetch: boolean;
}

export declare interface VueComponent {
    options: object;
    _Ctor: VueComponent;
}

export { }
