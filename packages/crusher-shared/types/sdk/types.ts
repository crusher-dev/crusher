
  export interface CrusherCookieSetPayload {
    /**
     * The URL to associate the cookie with. The promise will be rejected if the URL is
     * invalid.
     */
    url: string;
    /**
     * The name of the cookie. Empty by default if omitted.
     */
    name: string;
    /**
     * The value of the cookie. Empty by default if omitted.
     */
    value: string;
    /**
     * The domain of the cookie; this will be normalized with a preceding dot so that
     * it's also valid for subdomains. Empty by default if omitted.
     */
    domain?: string;
    /**
     * The path of the cookie. Empty by default if omitted.
     */
    path?: string;
    /**
     * Whether the cookie should be marked as Secure. Defaults to false.
     */
    secure?: boolean;
    /**
     * Whether the cookie should be marked as HTTP only. Defaults to false.
     */
    httpOnly?: boolean;
    /**
     * The expiration date of the cookie as the number of seconds since the UNIX epoch.
     * If omitted then the cookie becomes a session cookie and will not be retained
     * between sessions.
     */
    expirationDate?: number;
    /**
     * The Same Site policy to apply to this cookie.  Can be `unspecified`,
     * `no_restriction`, `lax` or `strict`.  Default is `no_restriction`.
     */
    sameSite?: ('None' | 'Lax' | 'Strict');
  }