export interface JiraAuth {
    username: string;
    password: string;
    url: string;
};

/**
 * Token from auth data in base64
 * 
 * @export
 * @param {JiraAuth} auth
 * @returns {string}
 */
export function getToken(auth: JiraAuth): string {
    return new Buffer(`${auth.username}:${auth.password}`).toString('base64');
}

