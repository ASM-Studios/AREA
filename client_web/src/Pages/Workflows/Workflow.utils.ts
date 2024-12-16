import React from "react";
import { Action, Reaction, Parameter, SelectedAction, SelectedReaction, About, Service } from "@/types";
import { toast } from "react-toastify";

interface WorkflowUtilsConfig {
  about: About | null;
  setSelectedActions: React.Dispatch<React.SetStateAction<SelectedAction[]>>;
  setSelectedReactions: React.Dispatch<React.SetStateAction<SelectedReaction[]>>;
  setActiveActionKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveReactionKeys: React.Dispatch<React.SetStateAction<string[]>>;
}

export const createWorkflowUtils = (config: WorkflowUtilsConfig) => {
  const {
    about,
    setSelectedActions,
    setSelectedReactions,
    setActiveActionKeys,
    setActiveReactionKeys,
  } = config;

  const toggleAction = (action: Action) => {
    setSelectedActions(prev => {
      if (prev.length > 0) {
        toast.error("Only one action is allowed for now");
        return prev;
      }

      const parameters = action.parameters?.length
        ? action.parameters.reduce((acc: Record<string, string>, param: Parameter) => ({
            ...acc,
            [param.name]: ''
          }), {})
        : [];

      return [
        ...prev,
        {
          id: Number(action.id),
          name: action.name,
          description: action.description,
          parameters: parameters as Record<string, string>
        }
      ];
    });
  };

  const toggleReaction = (reaction: Reaction) => {
    setSelectedReactions(prev => {
      if (prev.length > 0) {
        toast.error("Only one reaction is allowed for now");
        return prev;
      }

      const parameters = reaction.parameters?.length
        ? reaction.parameters.reduce((acc: Record<string, string>, param: Parameter) => ({
            ...acc,
            [param.name]: ''
          }), {})
        : [];

      return [
        ...prev,
        {
          id: reaction.id,
          name: reaction.name,
          description: reaction.description,
          parameters: parameters as Record<string, string>
        }
      ];
    });
  };

  const areAllParametersFilled = (
    selectedActions: SelectedAction[],
    selectedReactions: SelectedReaction[]
  ) => {
    const actionsComplete = selectedActions.every(action => {
      if (!action.parameters) return true;
      return Object.values(action.parameters).every(value => value !== '');
    });

    const reactionsComplete = selectedReactions.every(reaction => {
      if (!reaction.parameters) return true;
      return Object.values(reaction.parameters).every(value => value !== '');
    });

    return actionsComplete && reactionsComplete;
  };

  const handleFoldAllActions = () => {
    setActiveActionKeys([]);
  };

  const handleUnfoldAllActions = () => {
    if (about) {
      setActiveActionKeys(about.server.services.map((service: Service) => service.name));
    }
  };

  const handleFoldAllReactions = () => {
    setActiveReactionKeys([]);
  };

  const handleUnfoldAllReactions = () => {
    if (about) {
      setActiveReactionKeys(about.server.services.map((service: Service) => service.name));
    }
  };

  return {
    toggleAction,
    toggleReaction,
    areAllParametersFilled,
    handleFoldAllActions,
    handleUnfoldAllActions,
    handleFoldAllReactions,
    handleUnfoldAllReactions,
  };
};
