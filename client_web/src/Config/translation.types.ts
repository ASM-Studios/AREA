export interface Translation {
    home: {
        title: string;
        description: string;
        getStarted: string;
        upperCards: {
            firstCard: {
                title: string;
                description: string;
            };
            secondCard: {
                title: string;
                description: string;
            };
            thirdCard: {
                title: string;
                description: string;
            };
        };
        lowerCards: {
            firstCard: {
                title: string;
                description: string;
            };
            secondCard: {
                title: string;
                description: string;
            };
            thirdCard: {
                title: string;
                description: string;
            };
        };
    };
    authForm: {
        login: {
            title: string;
            form: {
                email: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                        invalid: string;
                    };
                };
                password: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                        pattern: string;
                        length: string;
                    };
                };
                submitButton: string;
                noAccountLink: string;
            };
            errors: {
                loginFailed: string;
                jwtNotFound: string;
            };
        };
        register: {
            title: string;
            form: {
                username: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                    };
                };
                email: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                        invalid: string;
                    };
                };
                password: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                        pattern: string;
                        length: string;
                    };
                };
                confirmPassword: {
                    placeholder: string;
                    tooltip: string;
                    validation: {
                        required: string;
                        match: string;
                    };
                };
                submitButton: string;
                haveAccountLink: string;
            };
            errors: {
                registerFailed: string;
                jwtNotFound: string;
            };
            success: {
                registered: string;
            };
        };
    };
    header: {
        home: string;
        login: string;
        register: string;
        dashboard: string;
        createWorkflow: string;
        profile: {
            title: string;
            settings: string;
            logout: string;
            tooltip: string;
        }
    };
    footer: {
        reservedRights: string;
    };
    userPage: {
        profileCard: {
            title: string;
            welcomeMessage: string;
            description: string;
            logoutDescription: string;
            logoutButton: string;
        };
        themeSettings: {
            title: string;
            description: string;
            resetButton: string;
        };
        connectedServices: {
            title: string;
            description: string;
            connectedServices: string;
            connectedAt: string;
        };
    };
    callback: {
        errors: {
            stateMismatch: string;
            tokenExchange: string;
            invalidService: string;
            genericError: string;
        };
        loading: {
            title: string;
            description: string;
        };
        redirect: {
            message: string;
        };
    };
    oauthButtons: {
        signin: string;
        signup: string;
        connect: string;
        use: string;
        or: string;
    };
    dashboard: {
        cards: {
            firstCard: {
                title: string;
            }
            secondCard: {
                title: string;
            }
            thirdCard: {
                title: string;
            }
        };
        table: {
            title: string;
            createWorkflow: string;
            searchWorkflows: string;
        };
        errors: {
            fetchWorkflows: string;
            fetchUser: string;
        }
    };
    workflow: {
        table: {
            columns: {
                name: string;
                description: string;
                status: string;
                active: string;
                createdAt: string;
                updatedAt: string;
                actions: string;
            };
            activeStatus: {
                yes: string;
                no: string;
            };
            filters: {
                active: string;
                inactive: string;
            };
            tooltips: {
                edit: string;
                activate: string;
                deactivate: string;
                delete: string;
            };
            ariaLabels: {
                edit: string;
                activate: string;
                deactivate: string;
                delete: string;
            };
        };
        notifications: {
            success: {
                updated: string;
                deleted: string;
            };
            error: {
                updateFailed: string;
                deleteFailed: string;
            };
        };
        create: {
            form: {
                name: {
                    label: string;
                    placeholder: string;
                    example: string;
                    required: string;
                },
                description: {
                    label: string;
                    placeholder: string;
                    example: string;
                }
            },
            sections: {
                availableActions: string;
                availableReactions: string;
                selectedItems: string;
                when: string;
                then: string;
            },
            buttons: {
                foldAll: string;
                unfoldAll: string;
                clearActions: string;
                clearReactions: string;
                create: string;
                cancel: string;
            },
            errors: {
                noServices: {
                    title: string;
                    subtitle: string;
                    connectService: string;
                    goBack: string;
                };
                apiError: {
                    title: string;
                    subtitle: string;
                };
            },
            loading: string;
            success: {
                published: string;
            }
        },
        update: {
            form: {
                name: {
                    label: string;
                    placeholder: string;
                    example: string;
                    required: string;
                },
                description: {
                    label: string;
                    placeholder: string;
                    example: string;
                }
            },
            sections: {
                availableActions: string;
                availableReactions: string;
                selectedItems: string;
                when: string;
                then: string;
            },
            buttons: {
                foldAll: string;
                unfoldAll: string;
                clearActions: string;
                clearReactions: string;
                update: string;
                cancel: string;
            },
            errors: {
                noServices: {
                    title: string;
                    subtitle: string;
                    connectService: string;
                    goBack: string;
                };
                noWorkflow: {
                    title: string;
                    subtitle: string;
                };
                apiError: {
                    title: string;
                    subtitle: string;
                };
                updateFailed: string;
            },
            loading: string;
            success: {
                updated: string;
            }
        },
    };
    common: {
        table: {
            next: string;
            noData: string;
            ok: string;
            reset: string;
            filter: string;
            selectAll: string;
            sort: string;
            search: string;
            clear: string;
            apply: string;
            cancel: string;
            edit: string;
            delete: string;
            activate: string;
            deactivate: string;
            confirm: string;
            save: string;
            close: string;
            triggerDesc: string;
            triggerAsc: string;
            cancelSort: string;
        }
    };
    security: {
        errors: {
            unauthorized: string;
            invalidToken: string;
        }
    };
    errors: {
        api: {
            title: string;
            subtitle: string;
            backHome: string;
        };
        notFound: {
            title: string;
            subtitle: string;
            backHome: string;
        };
    };
}
