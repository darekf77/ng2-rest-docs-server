type Color = 'yellow' | 'red' | 'green';

type StatusName = 'In Progress';

interface StatusCategory {
    self: string;
    id: number;
    key: string;
    colorName: Color,
    name: StatusName;
}

interface Status {
    self: string; //"https://jira.eniro.com/rest/api/2/status/10001",
    description: string; // "This status is managed internally by JIRA Software",
    iconUrl: string; // "https://jira.eniro.com/images/icons/subtask.gif",
    name: string; // "Test",
    id: number; // "10001",
    statusCategory: StatusCategory;
}

interface Fields {
    status: Status;
}

export interface JiraTask {
    expand: string;
    id: number,
    self: string; // "https://jira.eniro.com/rest/api/latest/issue/109976",
    key: string; // "PLBO-702",
    fields: Fields;
}



