import { JiraAuth } from './auth';

export interface JiraConfig {
    auth: JiraAuth,
    token: string;
    url: string;
};


