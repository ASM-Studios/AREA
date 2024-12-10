export type Parameter = {
    name: string;
    description: string;
    type: "string" | "number" | "datetime";
};

export type Action = {
    id: number;
    name: string;
    description: string;
    parameters: Parameter[];
};

export type Reaction = {
    id: number;
    name: string;
    description: string;
    parameters: Parameter[];
};

export type Service = {
    id: number;
    name: string;
    actions: Action[];
    reactions: Reaction[];
};

export type Server = {
    current_time: number;
    services: Service[];
};

export type Client = {
    host: string;
};

export type About = {
    client: Client;
    server: Server;
};

/* --------------------------------- */

export interface WorkflowParameter {
    name: string;
    type: "string" | "number" | "datetime";
    value: unknown;
}

export interface WorkflowDefinition {
    name: string;
    type: "action" | "reaction";
    description: string;
    parameters: WorkflowParameter[];
}

export type Workflow = {
    name: string;
    services: number[];
    description: string;
    events: WorkflowDefinition[];
};

export interface WorkflowItem {
    id: string;
    name: string;
    parameters?: Record<string, string>;
}

export interface SelectedAction extends Omit<Action, 'parameters'> {
    parameters: Record<string, string>;
}

export interface SelectedReaction extends Omit<Reaction, 'parameters'> {
    parameters: Record<string, string>;
}

/* --------------------------------- */

export type WorkflowParameterValue = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    parameters_id: number;
    workflow_event_id: number;
    value: string;
};

export type WorkflowEvent = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    workflow_id: number;
    event_id: number;
    parameters_values: WorkflowParameterValue[];
};

export type WorkflowTableDetail = {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    user_id: number;
    name: string;
    description: string;
    status: string;
    is_active: boolean;
    events: WorkflowEvent[];
};
