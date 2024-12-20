import { Translation } from '@/Config/translation.types';
import { table } from 'console';

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
                    placeholder: "example@example.com",
                    tooltip: "Please enter your email address",
                    validation: {
                        required: "Please input your email!",
                        invalid: "Please input a valid email address!"
                    }
                },
                password: {
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
                    placeholder: "Enter your username",
                    tooltip: "Please enter your desired username",
                    validation: {
                        required: "Please input your username!"
                    }
                },
                email: {
                    placeholder: "example@example.com",
                    tooltip: "Please enter your email address",
                    validation: {
                        required: "Please input your email!",
                        invalid: "Please input a valid email!"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Please enter your password",
                    validation: {
                        required: "Please input your password!",
                        pattern: "Password must contain at least one letter, one number, and one special character.",
                        length: "Password must be at least 8 characters long."
                    }
                },
                confirmPassword: {
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
        }
    },
    common: {
        table: {
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
        }
    },
};

export default en_language;
