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
                    label: "message-in-a-bottle address",
                    placeholder: "captain@blackpearl.sea",
                    tooltip: "Enter yer message-in-a-bottle address",
                    validation: {
                        required: "We be needin' yer email, matey!",
                        invalid: "That ain't no proper email, ye scallywag!"
                    }
                },
                password: {
                    label: "secret code",
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
                    label: "pirate name",
                    placeholder: "Enter yer pirate name",
                    tooltip: "What be yer sailor name?",
                    validation: {
                        required: "Ye need a proper pirate name!"
                    }
                },
                email: {
                    label: "message-in-a-bottle address",
                    placeholder: "captain@blackpearl.sea",
                    tooltip: "Enter yer message-in-a-bottle address",
                    validation: {
                        required: "We be needin' yer email, matey!",
                        invalid: "That ain't no proper email, ye scallywag!"
                    }
                },
                password: {
                    label: "secret code",
                    placeholder: "********",
                    tooltip: "Enter yer secret code",
                    validation: {
                        required: "Where be yer password, ye landlubber?",
                        pattern: "Yer password needs letters, numbers, and special marks like a proper treasure map!",
                        length: "Yer password be too short! Need at least 8 marks!"
                    }
                },
                confirmPassword: {
                    label: "confirm secret code",
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
        },
        twoFactor: {
            title: "Double Check Yer Identity",
            description: "Enter the 6-digit secret code from yer authenticator map",
            form: {
                code: {
                    label: "secret code",
                    placeholder: "Enter yer code",
                    validation: {
                        required: "We be needin' that secret code, matey!",
                        length: "The code must be 6 numbers, no more, no less!",
                        numeric: "Numbers only, ye scallywag!"
                    }
                },
                submitButton: "Verify Identity"
            },
            errors: {
                verificationFailed: "That code be wrong, try again ye must!"
            },
            success: {
                verified: "Ye've proven yer identity, welcome aboard!"
            }
        }
    },
    header: {
        home: "Crow's Nest",
        login: "Board Ship",
        register: "Join Crew",
        dashboard: "Captain's Quarters",
        createWorkflow: "Chart New Course",
        accessibility: "Accessibility fer All Hands",
        download: "Get yer vessel",
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
            logoutButton: "Abandon Ship",
            securitySettings: "Ship's Security",
            enableTOTP: "Add Extra Protection",
            verifyEmail: "Verify Yer Message Bottle",
            enableEmailAuth: "Enable Message Bottle Auth",
            disable2FA: "Remove Extra Protection",
            setup2FATitle: "Setup Extra Protection",
            scan2FAQRCode: "Scan the treasure map with yer auth device",
            secretsManagement: "Manage Yer Secrets",
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
                activate: "Set route to sail",
                deactivate: "Drop route's anchor",
                delete: "Send route to Davy Jones",
                trigger: "Fire the cannons"
            },
            ariaLabels: {
                edit: "Change route",
                activate: "Set route to sail",
                deactivate: "Drop route's anchor",
                delete: "Send route to Davy Jones",
                trigger: "Fire the cannons"
            }
        },
        notifications: {
            success: {
                updated: "Route be changed",
                deleted: "Route sent to the depths",
                triggered: "Route be triggered"
            },
            error: {
                updateFailed: "Failed to change course",
                deleteFailed: "Failed to sink route",
                triggerFailed: "Failed to fire the cannons"
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
                availableActions: "Orders to Give",
                availableReactions: "Responses to Expect",
                availableVariables: "Variables to Use",
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
            next: "Next Port",
            previous: "Previous Port",
            continue: "Continue",
        }
    },
    security: {
        errors: {
            unauthorized: "Ye ain't got permission to board this deck",
            invalidToken: "Yer papers be invalid - no boarding allowed"
        }
    },
    download: {
        title: "Preparin' yer Android Vessel",
        description: "Hold fast while we ready yer treasure chest! Might take a few ticks of the compass",
    },
    accessibility: {
        title: "Ship's Accessibility Manifest",
        introduction: {
            title: "Captain's Orders",
            content: "This here scroll tells ye about how we make our digital vessel accessible to all hands aboard the AREA Client Web ship. We make sure every sailor, regardless of their abilities, can navigate our waters safely and efficiently."
        },
        importance: {
            title: "Why All Hands Matter",
            content: "Making our ship accessible to all crew members be vital for a successful voyage. It ensures that every sailor, regardless of their limitations, can navigate, understand, and interact with our vessel. By making our ship accessible, we not only follow the maritime laws but make sailing better for the entire crew!"
        },
        features: {
            title: "Ship's Accessibility Features",
            items: {
                semantic: "We use proper ship's markings that help navigation tools understand our vessel's layout better than a seasoned navigator!",
                keyboard: "Every part of our ship can be reached without using a mouse, perfect for sailors who prefer different ways of navigation!",
                contrast: "Our ship's colors be chosen carefully, making sure every sign be as clear as a lighthouse on a dark night!",
                aria: "We've got special markers (we call 'em ARIA) that help guide sailors through the more tricky parts of our vessel!",
                responsive: "Our ship adjusts its shape to fit any size port, from tiny rowboats to mighty galleons!"
            }
        },
        compliance: {
            title: "Maritime Laws We Follow",
            intro: "Our vessel follows these important sailing codes:",
            standards: {
                wcag: "We follow the Web Captain's Accessibility Guidelines, making sure our ship be seaworthy for all!",
                rgaa: "This be the French sailing code - we follow it too, with some extra rules for French waters!",
                en301: "This here's the European sailing standard - keeps us shipshape in European waters!"
            }
        },
        scores: {
            title: "Ship's Accessibility Ratings",
            intro: "Here be how well our ship rates for accessibility in different parts:",
            mean: "Our average accessibility score be 97 - that's better than most ships in these waters!"
        },
        conclusion: {
            title: "Final Words from the Captain",
            content: "We're committed to keeping our digital vessel accessible to every sailor who comes aboard. By following these maritime codes and constantly checking our ship's condition, we ensure smooth sailing for all!",
            learnMore: "For more sailing tips and guidelines, check out the"
        }
    }
};

export default pirate_language;
