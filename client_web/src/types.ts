export type Parameter = {
    name: string;
    description: string;
    type: "string" | "number" | "datetime";
};

export type Action = {
    name: string;
    description: string;
    parameters: Parameter[];
};

export type Reaction = {
    name: string;
    description: string;
    parameters: Parameter[];
};

export type Service = {
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
    parameters: WorkflowParameter[];
}

export interface WorkflowAction extends WorkflowDefinition {

}

export interface WorkflowReaction extends WorkflowDefinition {

}

export type Workflow = {
    name: string;
    description: string;
    actions: WorkflowAction[];
    reactions: WorkflowReaction[];
};

export interface WorkflowItem {
    id: string;
    name: string;
    parameters?: Record<string, string>;
}
