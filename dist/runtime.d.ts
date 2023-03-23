import { Context, Middleware } from '@nuxt/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare type OpenIDConnectConfigurationDocument = {
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

declare class ConfigurationDocumentRequestError extends Error {
    constructor();
}

declare class BaseScheme<OptionsT extends SchemeOptions> {
    $auth: Auth;
    options: OptionsT;
    constructor($auth: Auth, ...options: OptionsT[]);
    get name(): string;
}

interface LocalSchemeEndpoints extends EndpointsOption {
    login: HTTPRequest;
    logout: HTTPRequest | false;
    user: HTTPRequest | false;
}
interface LocalSchemeOptions extends TokenableSchemeOptions {
    endpoints: LocalSchemeEndpoints;
    user: UserOptions;
    clientId: string | false;
    grantType: string | false;
    scope: string[] | false;
}
declare class LocalScheme<OptionsT extends LocalSchemeOptions = LocalSchemeOptions> extends BaseScheme<OptionsT> implements TokenableScheme<OptionsT> {
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

interface CookieSchemeEndpoints extends LocalSchemeEndpoints {
    csrf: HTTPRequest;
}
interface CookieSchemeCookie {
    name: string;
}
interface CookieSchemeOptions extends LocalSchemeOptions {
    endpoints: CookieSchemeEndpoints;
    cookie: CookieSchemeCookie;
}
declare class CookieScheme<OptionsT extends CookieSchemeOptions = CookieSchemeOptions> extends LocalScheme<OptionsT> implements TokenableScheme<OptionsT> {
    constructor($auth: Auth, options: SchemePartialOptions<CookieSchemeOptions>);
    mounted(): Promise<HTTPResponse | void>;
    check(): SchemeCheck;
    login(endpoint: HTTPRequest): Promise<HTTPResponse>;
    reset(): void;
}

interface Oauth2SchemeEndpoints extends EndpointsOption {
    authorization: string;
    token: string;
    userInfo: string;
    logout: string | false;
}
interface Oauth2SchemeOptions extends SchemeOptions, TokenableSchemeOptions, RefreshableSchemeOptions {
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
declare class Oauth2Scheme<OptionsT extends Oauth2SchemeOptions = Oauth2SchemeOptions> extends BaseScheme<OptionsT> implements RefreshableScheme {
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

interface ModuleOptions {
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

interface OpenIDConnectSchemeEndpoints extends Oauth2SchemeEndpoints {
    configuration: string;
}
interface OpenIDConnectSchemeOptions extends Oauth2SchemeOptions, IdTokenableSchemeOptions {
    endpoints: OpenIDConnectSchemeEndpoints;
}
declare class OpenIDConnectScheme<OptionsT extends OpenIDConnectSchemeOptions = OpenIDConnectSchemeOptions> extends Oauth2Scheme<OptionsT> {
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

interface RefreshSchemeEndpoints extends LocalSchemeEndpoints {
    refresh: HTTPRequest;
}
interface RefreshSchemeOptions extends LocalSchemeOptions, RefreshableSchemeOptions {
    endpoints: RefreshSchemeEndpoints;
    autoLogout: boolean;
}
declare class RefreshScheme<OptionsT extends RefreshSchemeOptions = RefreshSchemeOptions> extends LocalScheme<OptionsT> implements RefreshableScheme<OptionsT> {
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

declare class Auth0Scheme extends Oauth2Scheme {
    logout(): void;
}

declare class LaravelJWTScheme extends RefreshScheme {
    protected updateTokens(response: HTTPResponse, { isRefreshing, updateOnRefresh }?: {
        isRefreshing?: boolean;
        updateOnRefresh?: boolean;
    }): void;
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
declare class ConfigurationDocument {
    scheme: OpenIDConnectScheme;
    $storage: Storage;
    key: string;
    constructor(scheme: OpenIDConnectScheme, storage: Storage);
    _set(value: OpenIDConnectConfigurationDocument | boolean): boolean | OpenIDConnectConfigurationDocument;
    get(): OpenIDConnectConfigurationDocument;
    set(value: OpenIDConnectConfigurationDocument | boolean): boolean | OpenIDConnectConfigurationDocument;
    request(): Promise<void>;
    validate(): void;
    init(): Promise<void>;
    setSchemeEndpoints(): void;
    reset(): void;
}

declare class ExpiredAuthSessionError extends Error {
    constructor();
}

declare class RefreshController {
    scheme: RefreshableScheme;
    $auth: Auth;
    private _refreshPromise;
    constructor(scheme: RefreshableScheme);
    handleRefresh(): Promise<HTTPResponse | void>;
    private _doRefresh;
}

declare enum TokenStatusEnum {
    UNKNOWN = "UNKNOWN",
    VALID = "VALID",
    EXPIRED = "EXPIRED"
}
declare class TokenStatus {
    private readonly _status;
    constructor(token: string | boolean, tokenExpiresAt: number | false);
    unknown(): boolean;
    valid(): boolean;
    expired(): boolean;
    private _calculate;
}

declare class RefreshToken {
    scheme: RefreshableScheme;
    $storage: Storage;
    constructor(scheme: RefreshableScheme, storage: Storage);
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

declare class RequestHandler {
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

declare class Token {
    scheme: TokenableScheme;
    $storage: Storage;
    constructor(scheme: TokenableScheme, storage: Storage);
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

declare class IdToken {
    scheme: IdTokenableScheme;
    $storage: Storage;
    constructor(scheme: IdTokenableScheme, storage: Storage);
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

declare type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : RecursivePartial<T[P]>;
};
declare type PartialExcept<T, K extends keyof T> = RecursivePartial<T> & Pick<T, K>;

interface UserOptions {
    property: string | false;
    autoFetch: boolean;
}
interface EndpointsOption {
    [endpoint: string]: string | HTTPRequest | false;
}
interface SchemeOptions {
    name: string;
}
declare type SchemePartialOptions<Options extends SchemeOptions> = PartialExcept<Options, keyof SchemeOptions>;
interface SchemeCheck {
    valid: boolean;
    tokenExpired?: boolean;
    refreshTokenExpired?: boolean;
    idTokenExpired?: boolean;
    isRefreshable?: boolean;
}
interface Scheme<OptionsT extends SchemeOptions = SchemeOptions> {
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
interface TokenOptions {
    property: string;
    type: string | false;
    name: string;
    maxAge: number | false;
    global: boolean;
    required: boolean;
    prefix: string;
    expirationPrefix: string;
}
interface TokenableSchemeOptions extends SchemeOptions {
    token: TokenOptions;
    endpoints: EndpointsOption;
}
interface TokenableScheme<OptionsT extends TokenableSchemeOptions = TokenableSchemeOptions> extends Scheme<OptionsT> {
    token: Token;
    requestHandler: RequestHandler;
}
interface IdTokenableSchemeOptions extends SchemeOptions {
    idToken: TokenOptions;
}
interface IdTokenableScheme<OptionsT extends IdTokenableSchemeOptions = IdTokenableSchemeOptions> extends Scheme<OptionsT> {
    idToken: IdToken;
    requestHandler: RequestHandler;
}
interface RefreshTokenOptions {
    property: string | false;
    type: string | false;
    data: string | false;
    maxAge: number | false;
    required: boolean;
    tokenRequired: boolean;
    prefix: string;
    expirationPrefix: string;
}
interface RefreshableSchemeOptions extends TokenableSchemeOptions {
    refreshToken: RefreshTokenOptions;
}
interface RefreshableScheme<OptionsT extends RefreshableSchemeOptions = RefreshableSchemeOptions> extends TokenableScheme<OptionsT> {
    refreshToken: RefreshToken;
    refreshController: RefreshController;
    refreshTokens(): Promise<HTTPResponse | void>;
}

declare type HTTPRequest = AxiosRequestConfig;
declare type HTTPResponse = AxiosResponse;

interface Strategy extends SchemeOptions {
    provider?: string | ((...args: unknown[]) => unknown);
    scheme: string;
    enabled: boolean;
    [option: string]: unknown;
}

declare type StorageOptions = ModuleOptions & {
    initialState: {
        user: null;
        loggedIn: boolean;
    };
};
declare class Storage {
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

declare type ErrorListener = (...args: unknown[]) => void;
declare type RedirectListener = (to: string, from: string) => string;
declare class Auth {
    ctx: Context;
    options: ModuleOptions;
    strategies: Record<string, Scheme>;
    error: Error;
    $storage: Storage;
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

declare const authMiddleware: Middleware;

export { Auth, Auth0Scheme, BaseScheme, ConfigurationDocument, ConfigurationDocumentRequestError, CookieScheme, CookieSchemeCookie, CookieSchemeEndpoints, CookieSchemeOptions, ErrorListener, ExpiredAuthSessionError, IdToken, LaravelJWTScheme, LocalScheme, LocalSchemeEndpoints, LocalSchemeOptions, Oauth2Scheme, Oauth2SchemeEndpoints, Oauth2SchemeOptions, OpenIDConnectScheme, OpenIDConnectSchemeEndpoints, OpenIDConnectSchemeOptions, RedirectListener, RefreshController, RefreshScheme, RefreshSchemeEndpoints, RefreshSchemeOptions, RefreshToken, RequestHandler, Storage, StorageOptions, Token, TokenStatus, TokenStatusEnum, authMiddleware };
