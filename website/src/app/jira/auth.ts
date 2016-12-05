export interface JiraAuth {
    username: string;
    password: string;
};

/**
 * Token from auth data in base64
 * 
 * @export
 * @param {JiraAuth} auth
 * @returns {string}
 */
export function getToken(auth: JiraAuth): string {
    return btoa(`${auth.username}:${auth.password}`);
}