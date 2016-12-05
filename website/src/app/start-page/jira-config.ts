import { JiraAuth } from '../jira';
import { DocModel } from '../start-page/models';

export interface JiraConfig {
    token: string;
    url: string;
    models: DocModel[];
};
