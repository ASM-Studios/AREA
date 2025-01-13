import { Translation } from '@Config/translation.types';

const en_language: Translation = {
    home: {
        title: "Connect Your Digital World",
        description: "Automate your life by connecting your favorite services. Create powerful automation flows with just a few clicks.",
        getStarted: "Get Started",
        upperCards: {
            firstCard: {
                title: "Easy Automation",
                description: "Create powerful automation workflows with no coding required!",
            },
            secondCard: {
                title: "Connect Services",
                description: "Integrate with popular services and apps. Make them work together seamlessly.",
            },
            thirdCard: {
                title: "Secure & Reliable",
                description: "Your data is protected with enterprise-grade security. Run your automations with confidence.",
            },
        },
        lowerCards: {
            firstCard: {
                title: "Choose a Trigger",
                description: "Select an event that starts your automation",
            },
            secondCard: {
                title: "Add Actions",
                description: "Define what happens when the trigger fires",
            },
            thirdCard: {
                title: "Watch It Work",
                description: "Sit back and let Area handle the rest",
            },
        },
    },
    authForm: {
        login: {
            title: "Login",
            form: {
                email: {
                    label: "email",
                    placeholder: "example@example.com",
                    tooltip: "Please enter your email address",
                    validation: {
                        required: "Please input your email!",
                        invalid: "Please input a valid email address!"
                    }
                },
                password: {
                    label: "password",
                    placeholder: "********",
                    tooltip: "Please enter your password",
                    validation: {
                        required: "Please input your password!",
                        pattern: "Password must contain at least one letter, one number, and one special character.",
                        length: "Password must be at least 8 characters long."
                    }
                },
                submitButton: "Login",
                noAccountLink: "I don't have an account"
            },
            errors: {
                loginFailed: "Failed to login:",
                jwtNotFound: "Authentication token not found"
            }
        },
        register: {
            title: "Register",
            form: {
                username: {
                    label: "username",
                    placeholder: "Enter your username",
                    tooltip: "Please enter your desired username",
                    validation: {
                        required: "Please input your username!"
                    }
                },
                email: {
                    label: "email",
                    placeholder: "example@example.com",
                    tooltip: "Please enter your email address",
                    validation: {
                        required: "Please input your email!",
                        invalid: "Please input a valid email!"
                    }
                },
                password: {
                    label: "password",
                    placeholder: "********",
                    tooltip: "Please enter your password",
                    validation: {
                        required: "Please input your password!",
                        pattern: "Password must contain at least one letter, one number, and one special character.",
                        length: "Password must be at least 8 characters long."
                    }
                },
                confirmPassword: {
                    label: "password confirmation",
                    placeholder: "********",
                    tooltip: "Please confirm your password",
                    validation: {
                        required: "Please confirm your password!",
                        match: "The two passwords do not match!"
                    }
                },
                submitButton: "Register",
                haveAccountLink: "I already have an account"
            },
            errors: {
                registerFailed: "Failed to register:",
                jwtNotFound: "Authentication token not found"
            },
            success: {
                registered: "Successfully registered!"
            }
        }
    },
    header: {
        home: "Home",
        login: "Login",
        register: "Register",
        dashboard: "Dashboard",
        createWorkflow: "Create Workflow",
        accessibility: "Accessibility",
        download: "Downloads",
        profile: {
            title: "Profile",
            settings: "Settings",
            logout: "Logout",
            tooltip: "Please log in to access profile settings",
        }
    },
    footer: {
        reservedRights: "©2024 ASM. All Rights Reserved.",
    },
    userPage: {
        profileCard: {
            title: "User Information",
            welcomeMessage: "Welcome back, {name}!",
            description: "This is your user page",
            logoutDescription: "Logout from your account",
            logoutButton: "Logout",
        },
        themeSettings: {
            title: "Theme Settings",
            description: "Customize your background color",
            resetButton: "Reset to Default Color",
        },
        connectedServices: {
            title: "Connected Services",
            description: "Manage your connected services",
            connectedServices: "Connected Services",
            connectedAt: "Connected at",
        },
    },
    callback: {
        errors: {
            stateMismatch: "State mismatch. Please try again.",
            tokenExchange: "Failed to exchange token",
            invalidService: "Invalid service: {service}",
            genericError: "Failed to connect with {service}",
        },
        loading: {
            title: "Connecting to {service}",
            description: "Please wait while we complete your authentication...",
        },
        redirect: {
            message: "Redirecting you back...",
        }
    },
    oauthButtons: {
        signin: "Sign in with",
        signup: "Sign up with",
        connect: "Connect with",
        use: "Use",
        or: "Or",
    },
    dashboard: {
        cards: {
            firstCard: {
                title: "Total Automations",
            },
            secondCard: {
                title: "Active Automations",
            },
            thirdCard: {
                title: "Pending Updates",
            }
        },
        table: {
            title: "Activity",
            createWorkflow: "Create A Workflow",
            searchWorkflows: "Search workflows",
        },
        errors: {
            fetchWorkflows: "Failed to fetch workflows",
            fetchUser: "Failed to fetch user data",
        }
    },
    workflow: {
        table: {
            columns: {
                name: "Name",
                description: "Description",
                status: "Status",
                active: "Active",
                createdAt: "Created At",
                updatedAt: "Updated At",
                actions: "Actions"
            },
            activeStatus: {
                yes: "Yes",
                no: "No"
            },
            filters: {
                active: "Active",
                inactive: "Inactive"
            },
            tooltips: {
                edit: "Edit workflow",
                activate: "Activate workflow",
                deactivate: "Deactivate workflow",
                delete: "Delete workflow"
            },
            ariaLabels: {
                edit: "Edit workflow",
                activate: "Activate workflow",
                deactivate: "Deactivate workflow",
                delete: "Delete workflow"
            }
        },
        notifications: {
            success: {
                updated: "Workflow updated",
                deleted: "Workflow deleted"
            },
            error: {
                updateFailed: "Failed to update workflow",
                deleteFailed: "Failed to delete workflow"
            }
        },
        handler: {
            form: {
                name: {
                    label: "Name",
                    placeholder: "Enter workflow name",
                    example: "My Workflow",
                    required: "Please input a name for your workflow!"
                },
                description: {
                    label: "Description",
                    placeholder: "Describe your workflow",
                    example: "This workflow will..."
                }
            },
            sections: {
                availableActions: "Available Actions",
                availableReactions: "Available Reactions",
                selectedItems: "Selected Items",
                when: "When",
                then: "Then"
            },
            buttons: {
                foldAll: "Fold All",
                unfoldAll: "Unfold All",
                clearActions: "Clear Actions",
                clearReactions: "Clear Reactions",
                create: "Create Workflow",
                cancel: "Cancel",
                update: "Update"
            },
            errors: {
                noServices: {
                    title: "No Services Connected",
                    subtitle: "Please connect some services before creating a workflow",
                    connectService: "Connect Services",
                    goBack: "Go Back"
                },
                apiError: {
                    title: "API Error",
                    subtitle: "Failed to fetch service information"
                }
            },
            loading: "Creating workflow...",
            success: {
                published: "Workflow successfully created!"
            }
        },
        update: {
            form: {
                name: {
                    label: "Name",
                    placeholder: "Enter your workflow name",
                    example: "My Workflow",
                    required: "Please enter a name for your workflow"
                },
                description: {
                    label: "Description",
                    placeholder: "Enter your workflow description",
                    example: "This workflow will send a message to my Slack channel when a new email arrives"
                }
            },
            sections: {
                availableActions: "Available Actions",
                availableReactions: "Available Reactions",
                selectedItems: "Selected Items",
                when: "When",
                then: "Then"
            },
            buttons: {
                foldAll: "Fold All",
                unfoldAll: "Unfold All",
                clearActions: "Clear Actions",
                clearReactions: "Clear Reactions",
                update: "Update",
                cancel: "Cancel"
            },
            errors: {
                noServices: {
                    title: "No Services Connected",
                    subtitle: "You need to connect at least one service to update a workflow",
                    connectService: "Connect Service",
                    goBack: "Go Back"
                },
                noWorkflow: {
                    title: "Workflow Not Found",
                    subtitle: "The workflow you're trying to edit doesn't exist"
                },
                apiError: {
                    title: "API Error",
                    subtitle: "Could not fetch workflow information"
                },
                updateFailed: "Failed to update workflow"
            },
            loading: "Updating workflow...",
            success: {
                updated: "Workflow successfully updated!"
            }
        }
    },
    common: {
        table: {
            next: "Next",
            noData: "No data found",
            ok: "OK",
            reset: "Reset",
            filter: "Filter",
            selectAll: "Select All",
            sort: "Sort",
            search: "Search",
            clear: "Clear",
            apply: "Apply",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            activate: "Activate",
            deactivate: "Deactivate",
            confirm: "Confirm",
            save: "Save",
            close: "Close",
            triggerDesc: "Descending",
            triggerAsc: "Ascending",
            cancelSort: "Cancel Sort"
        }
    },
    security: {
        errors: {
            unauthorized: "You are not authorized to access this page",
            invalidToken: "You are not authenticated - token invalid"
        }
    },
    errors: {
        api: {
            title: "API Not Connected",
            subtitle: "Sorry, the API is currently not available.",
            backHome: "Back Home"
        },
        notFound: {
            title: "404",
            subtitle: "Sorry, the page you visited does not exist.",
            backHome: "Back Home"
        },
        attack: {
            title: "Attack Detected",
            subtitle: "Sorry, the page you visited is not available.",
            backHome: "Back Home"
        }
    },
    download: {
        title: "Preparing Android App",
        description: "Please wait while we prepare your download. This might take a few moments.",
    },
    accessibility: {
        title: "Accessibility Statement",
        introduction: {
            title: "Introduction",
            content: "This document provides an overview of the accessibility features implemented in the AREA Client Web project. Accessibility is a crucial aspect of web development, ensuring that all users, including those with disabilities, can access and interact with the website effectively."
        },
        importance: {
            title: "Importance of Accessibility",
            content: "Web accessibility is essential for creating an inclusive digital environment. It ensures that people with disabilities can perceive, understand, navigate, and interact with the web. By making the website accessible, we not only comply with legal requirements but also enhance the user experience for everyone."
        },
        features: {
            title: "Accessibility Features and Considerations",
            items: {
                semantic: "The use of semantic HTML elements helps screen readers and other assistive technologies understand the structure and content of the web pages.",
                keyboard: "All interactive elements are accessible via keyboard navigation, allowing users who cannot use a mouse to navigate the site.",
                contrast: "The website ensures sufficient color contrast between text and background, making it easier for users with visual impairments to read the content.",
                aria: "ARIA (Accessible Rich Internet Applications) attributes are used to enhance the accessibility of dynamic content and complex UI components.",
                responsive: "The site is designed to be responsive, ensuring accessibility across various devices and screen sizes."
            }
        },
        compliance: {
            title: "Compliance with Accessibility Norms",
            intro: "The AREA Client Web project complies with several accessibility standards, including:",
            standards: {
                wcag: "The project adheres to the guidelines set by WCAG 2.1, ensuring that the content is perceivable, operable, understandable, and robust.",
                rgaa: "This is the French accessibility standard that aligns with WCAG 2.1 but includes additional requirements specific to France.",
                en301: "This is the European standard for accessibility requirements for ICT products and services, which also aligns with WCAG 2.1."
            }
        },
        scores: {
            title: "Accessibility Scores",
            intro: "The following are the accessibility scores for each page, as measured by Google Chrome Lighthouse:",
            mean: "The mean accessibility score across all pages is 97, indicating a high level of accessibility compliance."
        },
        conclusion: {
            title: "Conclusion",
            content: "The AREA Client Web project is committed to providing an accessible experience for all users. By adhering to established accessibility standards and continuously evaluating our practices, we ensure that our website is inclusive and user-friendly.",
            learnMore: "For more information on accessibility practices and guidelines, please refer to the"
        }
    },
};

export default en_language;
