import { User } from "@/Context/Scopes/UserContext";
import { About, Action, filteredEvents, Reaction, Service } from "@/types";

const setDefaultData = (
    about: About | null,
    user: User | null,
    userHasNoServices: boolean,
    setError: (error: { error: string; errorDescription: string }) => void,
    navigate: (path: string) => void,
    setFilteredActions: (actions: filteredEvents[]) => void,
    setFilteredReactions: (reactions: filteredEvents[]) => void
) => {
    if (!about || !user || userHasNoServices) { return; }
    const userServices: string[] = user?.services.map((service: any) => service.name) ?? [];
    const services =
        about?.server?.services
          ?.map((service: Service) => service.name)
          ?.filter((service: string) => userServices.includes(service)) ?? [];

    if (services.length === 0) {
      setError({ error: "API Error", errorDescription: "No services found" });
      navigate('/error/fetch');
    }

    const actions: filteredEvents[] = [];
    const reactions: filteredEvents[] = [];

    about?.server?.services?.forEach((service: Service) => {
      if (services.includes(service.name)) {
        if (service.actions && service.actions.length > 0) {
          actions.push({
            service: service.name,
            events: service.actions
          });
        }
        if (service.reactions && service.reactions.length > 0) {
          reactions.push({
            service: service.name,
            events: service.reactions
          });
        }
      }
    });

    if (!actions || !reactions) {
      setError({ error: "API Error", errorDescription: "No actions or reactions found" });
      navigate('/error/fetch');
    }

    setFilteredActions(actions);
    setFilteredReactions(reactions);
};

const isWorkflowValid = (
    formData: { name: string, description: string },
    workflowActions: Array<{action: Action, parameters: Record<string, string>}>,
    workflowReactions: Array<{reaction: Reaction, parameters: Record<string, string>}>
) => {
    if (!formData.name.trim()) return false;

    if (workflowActions.length === 0 || workflowReactions.length === 0) return false;

    const actionParamsValid = workflowActions.every(item =>
        !item?.action?.parameters?.length || item.action.parameters.every(param =>
            item.parameters[param.name] && item.parameters[param.name].trim() !== ''
        )
    );

    const reactionParamsValid = workflowReactions.every(item =>
        !item?.reaction?.parameters?.length || item.reaction.parameters.every(param =>
            item.parameters[param.name] && item.parameters[param.name].trim() !== ''
        )
    );

    return actionParamsValid && reactionParamsValid;
};

export {
    setDefaultData,
    isWorkflowValid,
};
