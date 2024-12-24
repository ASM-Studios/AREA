import { Translation } from '@Config/translation.types';

const pirate_language: Translation = {
    home: {
        title: "Connect Yer Digital Seven Seas",
        description: "Automate yer ship by connectin' yer favorite treasures. Create powerful automation flows faster than a flying Dutchman!",
        getStarted: "Set Sail!",
        upperCards: {
            firstCard: {
                title: "Easy As Ship",
                description: "Create powerful workflow routes without knowin' how to tie a sailor's knot!",
            },
            secondCard: {
                title: "Connect Yer Treasures",
                description: "Integrate with popular services faster than a mermaid's tail splash!",
            },
            thirdCard: {
                title: "Safe As A Captain's Log",
                description: "Yer data be protected better than Blackbeard's treasure chest!",
            },
        },
        lowerCards: {
            firstCard: {
                title: "Pick Yer Trigger",
                description: "Select what fires yer cannon",
            },
            secondCard: {
                title: "Add Yer Actions",
                description: "Chart the course of what happens next",
            },
            thirdCard: {
                title: "Watch 'er Sail",
                description: "Sit back with yer grog while Area does the work",
            },
        },
    },
    authForm: {
        login: {
            title: "Board Yer Ship",
            form: {
                email: {
                    placeholder: "captain@blackpearl.sea",
                    tooltip: "Enter yer message-in-a-bottle address",
                    validation: {
                        required: "We be needin' yer email, matey!",
                        invalid: "That ain't no proper email, ye scallywag!"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Enter yer secret code",
                    validation: {
                        required: "Where be yer password, ye landlubber?",
                        pattern: "Yer password needs letters, numbers, and special marks like a proper treasure map!",
                        length: "Yer password be too short! Need at least 8 marks!"
                    }
                },
                submitButton: "Board Ship",
                noAccountLink: "I don't have a ship yet"
            },
            errors: {
                loginFailed: "Blimey! Failed to board:",
                jwtNotFound: "Yer treasure map be missin'!"
            }
        },
        register: {
            title: "Join the Crew",
            form: {
                username: {
                    placeholder: "Enter yer pirate name",
                    tooltip: "What be yer sailor name?",
                    validation: {
                        required: "Ye need a proper pirate name!"
                    }
                },
                email: {
                    placeholder: "captain@blackpearl.sea",
                    tooltip: "Enter yer message-in-a-bottle address",
                    validation: {
                        required: "We be needin' yer email, matey!",
                        invalid: "That ain't no proper email, ye scallywag!"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Enter yer secret code",
                    validation: {
                        required: "Where be yer password, ye landlubber?",
                        pattern: "Yer password needs letters, numbers, and special marks like a proper treasure map!",
                        length: "Yer password be too short! Need at least 8 marks!"
                    }
                },
                confirmPassword: {
                    placeholder: "********",
                    tooltip: "Confirm yer secret code",
                    validation: {
                        required: "Confirm yer password, ye scurvy dog!",
                        match: "Yer passwords don't match, ye bilge rat!"
                    }
                },
                submitButton: "Join the Crew",
                haveAccountLink: "I already be part of the crew"
            },
            errors: {
                registerFailed: "Failed to join the crew:",
                jwtNotFound: "Yer treasure map be missin'!"
            },
            success: {
                registered: "Welcome aboard, ye new scalawag!"
            }
        }
    },
    header: {
        home: "Crow's Nest",
        login: "Board Ship",
        register: "Join Crew",
        dashboard: "Captain's Quarters",
        createWorkflow: "Chart New Course",
        profile: {
            title: "Sailor's Log",
            settings: "Ship Settings",
            logout: "Abandon Ship",
            tooltip: "Ye must be aboard to access yer quarters!",
        }
    },
    footer: {
        reservedRights: "©2024 ASM. All Rights Be Reserved, Ye Scurvy Dogs!"
    },
    userPage: {
        profileCard: {
            title: "Sailor's Log",
            welcomeMessage: "Welcome back, {name}, ye old sea dog!",
            description: "This be yer personal quarters",
            logoutDescription: "Ready to jump ship?",
            logoutButton: "Abandon Ship"
        },
        themeSettings: {
            title: "Ship's Colors",
            description: "Change yer vessel's appearance",
            resetButton: "Back to Original Colors"
        },
        connectedServices: {
            title: "Allied Ships",
            description: "Manage yer fleet connections",
            connectedServices: "Allied Vessels",
            connectedAt: "Joined forces at"
        }
    },
    errors: {
        api: {
            title: "Ship's Compass Be Broken",
            subtitle: "Arrr! The navigation system be down!",
            backHome: "Back To Port"
        },
        notFound: {
            title: "404 - Lost At Sea",
            subtitle: "Blimey! This map leads nowhere!",
            backHome: "Back To Safe Harbor"
        },
        attack: {
            title: "Attack Detected",
            subtitle: "Arrr! We be under attack!",
            backHome: "Back To Safe Harbor"
        }
    },
    callback: {
        errors: {
            stateMismatch: "Yer compass be spinnin' wrong! Try again, matey.",
            tokenExchange: "Failed to trade yer treasure map",
            invalidService: "That ain't no proper ship: {service}",
            genericError: "Failed to board the {service} vessel"
        },
        loading: {
            title: "Boarding {service}",
            description: "Hold fast while we secure yer passage..."
        },
        redirect: {
            message: "Settin' sail back to port..."
        }
    },
    oauthButtons: {
        signin: "Board with",
        signup: "Join crew with",
        connect: "Ally with",
        use: "Use",
        or: "Or"
    },
    dashboard: {
        cards: {
            firstCard: {
                title: "Total Voyages"
            },
            secondCard: {
                title: "Active Voyages"
            },
            thirdCard: {
                title: "Waitin' Orders"
            }
        },
        table: {
            title: "Ship's Log",
            createWorkflow: "Chart New Course",
            searchWorkflows: "Search yer routes"
        },
        errors: {
            fetchWorkflows: "Failed to fetch yer routes",
            fetchUser: "Failed to fetch yer sailor's papers"
        }
    },
    workflow: {
        table: {
            columns: {
                name: "Route Name",
                description: "Route Details",
                status: "Ship's Status",
                active: "Sailin'",
                createdAt: "First Charted",
                updatedAt: "Last Changed",
                actions: "Commands"
            },
            activeStatus: {
                yes: "Aye",
                no: "Nay"
            },
            filters: {
                active: "Sailin'",
                inactive: "Anchored"
            },
            tooltips: {
                edit: "Change route",
                activate: "Set sail",
                deactivate: "Drop anchor",
                delete: "Send to Davy Jones"
            },
            ariaLabels: {
                edit: "Change route",
                activate: "Set sail",
                deactivate: "Drop anchor",
                delete: "Send to Davy Jones"
            }
        },
        notifications: {
            success: {
                updated: "Route be changed",
                deleted: "Route sent to the depths"
            },
            error: {
                updateFailed: "Failed to change course",
                deleteFailed: "Failed to sink route"
            }
        },
        handler: {
            form: {
                name: {
                    label: "Route Name",
                    placeholder: "Name yer new route",
                    example: "Me Route",
                    required: "Ye must name yer route!"
                },
                description: {
                    label: "Route Details",
                    placeholder: "Tell us about yer route",
                    example: "This route sends a message to me crew when new booty arrives"
                }
            },
            sections: {
                availableActions: "Available Orders",
                availableReactions: "Available Responses",
                selectedItems: "Chosen Items",
                when: "When",
                then: "Then"
            },
            buttons: {
                foldAll: "Roll Up Maps",
                unfoldAll: "Spread Maps",
                clearActions: "Clear Orders",
                clearReactions: "Clear Responses",
                create: "Chart It",
                cancel: "Abandon",
                update: "Change Route"
            },
            errors: {
                noServices: {
                    title: "No Allied Ships",
                    subtitle: "Ye need at least one ally to chart a route",
                    connectService: "Find Allies",
                    goBack: "Return to Port"
                },
                apiError: {
                    title: "Crow's Nest Error",
                    subtitle: "Couldn't spot service information"
                }
            },
            loading: "Chartin' yer route...",
            success: {
                published: "Route be successfully charted!"
            }
        },
        update: {
            form: {
                name: {
                    label: "Route Name",
                    placeholder: "Name yer route",
                    example: "Me Route",
                    required: "Ye must name yer route!"
                },
                description: {
                    label: "Route Details",
                    placeholder: "Tell us about yer route",
                    example: "This route sends a message to me crew when new booty arrives"
                }
            },
            sections: {
                availableActions: "Available Orders",
                availableReactions: "Available Responses",
                selectedItems: "Chosen Items",
                when: "When",
                then: "Then"
            },
            buttons: {
                foldAll: "Roll Up Maps",
                unfoldAll: "Spread Maps",
                clearActions: "Clear Orders",
                clearReactions: "Clear Responses",
                update: "Update Chart",
                cancel: "Abandon"
            },
            errors: {
                noServices: {
                    title: "No Allied Ships",
                    subtitle: "Ye need at least one ally to change route",
                    connectService: "Find Allies",
                    goBack: "Return to Port"
                },
                noWorkflow: {
                    title: "Route Lost at Sea",
                    subtitle: "The route ye be tryin' to change has vanished"
                },
                apiError: {
                    title: "Crow's Nest Error",
                    subtitle: "Couldn't spot yer route information"
                },
                updateFailed: "Failed to update yer route"
            },
            loading: "Updatin' yer route...",
            success: {
                updated: "Route successfully updated!"
            }
        }
    },
    common: {
        table: {
            noData: "No treasure found",
            ok: "Aye",
            reset: "Start Fresh",
            filter: "Sort the Booty",
            selectAll: "Select All Treasure",
            sort: "Sort",
            search: "Search",
            clear: "Clear",
            apply: "Make it So",
            cancel: "Belay That",
            edit: "Change",
            delete: "Send to the Depths",
            activate: "Set Sail",
            deactivate: "Drop Anchor",
            confirm: "Aye, Do It",
            save: "Stow It",
            close: "Close",
            triggerDesc: "Bottom to Top",
            triggerAsc: "Top to Bottom",
            cancelSort: "Stop Sortin'",
            next: "Next Port"
        }
    },
    security: {
        errors: {
            unauthorized: "Ye ain't got permission to board this deck",
            invalidToken: "Yer papers be invalid - no boarding allowed"
        }
    }
};

export default pirate_language;
