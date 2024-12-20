import { Translation } from '@/Config/translation.types';

const fr_language: Translation = {
    home: {
        title: "Connectez Votre Monde Numérique",
        description: "Automatisez votre vie en connectant vos services préférés. Créez des flux d'automatisation puissants en quelques clics.",
        getStarted: "Commencer",
        upperCards: {
            firstCard: {
                title: "Automatisation Facile",
                description: "Créez des workflows d'automatisation puissants dès maintenant, et cela sans aucune programmation !",
            },
            secondCard: {
                title: "Connectez vos Services",
                description: "Intégrez vos applications et services préférés. Faites-les travailler ensemble en toute transparence.",
            },
            thirdCard: {
                title: "Sécurisé et Fiable",
                description: "Vos données sont protégées avec une sécurité de niveau entreprise. Exécutez vos automatisations en toute confiance.",
            },
        },
        lowerCards: {
            firstCard: {
                title: "Choisissez un Déclencheur",
                description: "Sélectionnez un événement qui démarre votre automatisation",
            },
            secondCard: {
                title: "Ajoutez des Actions",
                description: "Définissez ce qui se passe lorsque le déclencheur s'active",
            },
            thirdCard: {
                title: "Regardez-le Fonctionner",
                description: "Détendez-vous et laissez l'Area s'occuper du reste de votre automatisation",
            },
        },
    },
    authForm: {
        login: {
            title: "Connexion",
            form: {
                email: {
                    placeholder: "exemple@exemple.com",
                    tooltip: "Veuillez saisir votre adresse e-mail",
                    validation: {
                        required: "Veuillez saisir votre e-mail !",
                        invalid: "Veuillez saisir une adresse e-mail valide !"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Veuillez saisir votre mot de passe",
                    validation: {
                        required: "Veuillez saisir votre mot de passe !",
                        pattern: "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.",
                        length: "Le mot de passe doit contenir au moins 8 caractères."
                    }
                },
                submitButton: "Se connecter",
                noAccountLink: "Je n'ai pas de compte"
            },
            errors: {
                loginFailed: "Échec de la connexion :",
                jwtNotFound: "Jeton d'authentification non trouvé"
            }
        },
        register: {
            title: "S'inscrire",
            form: {
                username: {
                    placeholder: "Entrez votre nom d'utilisateur",
                    tooltip: "Veuillez saisir votre nom d'utilisateur souhaité",
                    validation: {
                        required: "Veuillez saisir votre nom d'utilisateur !"
                    }
                },
                email: {
                    placeholder: "exemple@exemple.com",
                    tooltip: "Veuillez saisir votre adresse e-mail",
                    validation: {
                        required: "Veuillez saisir votre e-mail !",
                        invalid: "Veuillez saisir une adresse e-mail valide !"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Veuillez saisir votre mot de passe",
                    validation: {
                        required: "Veuillez saisir votre mot de passe !",
                        pattern: "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.",
                        length: "Le mot de passe doit contenir au moins 8 caractères."
                    }
                },
                confirmPassword: {
                    placeholder: "********",
                    tooltip: "Veuillez confirmer votre mot de passe",
                    validation: {
                        required: "Veuillez confirmer votre mot de passe !",
                        match: "Les deux mots de passe ne correspondent pas !"
                    }
                },
                submitButton: "S'inscrire",
                haveAccountLink: "J'ai déjà un compte"
            },
            errors: {
                registerFailed: "Échec de l'inscription :",
                jwtNotFound: "Jeton d'authentification non trouvé"
            },
            success: {
                registered: "Inscription réussie !"
            }
        }
    },
    header: {
        home: "Accueil",
        login: "Connexion",
        register: "S'inscrire",
        dashboard: "Tableau de bord",
        createWorkflow: "Créer un Workflow",
        profile: {
            title: "Profil",
            settings: "Paramètres",
            logout: "Déconnexion",
            tooltip: "Veuillez vous connecter pour accéder aux paramètres du profil",
        }
    },
    footer: {
        reservedRights: "©2024 ASM. Tous droits réservés.",
    },
    userPage: {
        profileCard: {
            title: "Informations de l'utilisateur",
            welcomeMessage: "Bon retour, {name} !",
            description: "Voici votre page utilisateur",
            logoutDescription: "Déconnectez-vous de votre compte",
            logoutButton: "Déconnexion",
        },
        themeSettings: {
            title: "Paramètres du thème",
            description: "Personnalisez votre couleur de fond",
            resetButton: "Réinitialiser la couleur par défaut",
        },
        connectedServices: {
            title: "Services connectés",
            description: "Gérez vos services connectés",
            connectedServices: "Services connectés",
            connectedAt: "Connecté le",
        },
    },
    callback: {
        errors: {
            stateMismatch: "Mismatch d'état. Veuillez réessayer.",
            tokenExchange: "Échec de l'échange de jeton",
            invalidService: "Service invalide: {service}",
            genericError: "Échec de la connexion avec {service}",
        },
        loading: {
            title: "Connexion à {service}",
            description: "Veuillez patienter pendant que nous complétons votre authentification...",
        },
        redirect: {
            message: "Vous êtes redirigé...",
        }
    },
    oauthButtons: {
        signin: "Se connecter avec",
        signup: "S'inscrire avec",
        connect: "Se connecter avec",
        use: "Utiliser",
        or: "Ou",
    },
    dashboard: {
        cards: {
            firstCard: {
                title: "Total Automations",
            },
            secondCard: {
                title: "Automations Active",
            },
            thirdCard: {
                title: "Automations En Attente",
            }
        },
        table: {
            title: "Activité",
            createWorkflow: "Créer un Workflow",
            searchWorkflows: "Rechercher des workflows",
        },
        errors: {
            fetchWorkflows: "Échec de la récupération des workflows",
            fetchUser: "Échec de la récupération des données de l'utilisateur",
        }
    },
    workflow: {
        table: {
            columns: {
                name: "Nom",
                description: "Description",
                status: "Statut",
                active: "Actif",
                createdAt: "Créé le",
                updatedAt: "Modifié le",
                actions: "Actions"
            },
            activeStatus: {
                yes: "Oui",
                no: "Non"
            },
            filters: {
                active: "Actif",
                inactive: "Inactif"
            },
            tooltips: {
                edit: "Modifier le workflow",
                activate: "Activer le workflow",
                deactivate: "Désactiver le workflow",
                delete: "Supprimer le workflow"
            },
            ariaLabels: {
                edit: "Modifier le workflow",
                activate: "Activer le workflow",
                deactivate: "Désactiver le workflow",
                delete: "Supprimer le workflow"
            }
        },
        notifications: {
            success: {
                updated: "Workflow mis à jour",
                deleted: "Workflow supprimé"
            },
            error: {
                updateFailed: "Échec de la mise à jour du workflow",
                deleteFailed: "Échec de la suppression du workflow"
            }
        }
    },
    common: {
        table: {
            noData: "Aucune donnée trouvée",
            ok: "OK",
            reset: "Réinitialiser",
            filter: "Filtrer",
            selectAll: "Tout sélectionner",
            sort: "Trier",
            search: "Rechercher",
            clear: "Effacer",
            apply: "Appliquer",
            cancel: "Annuler",
            edit: "Modifier",
            delete: "Supprimer",
            activate: "Activer",
            deactivate: "Désactiver",
            confirm: "Confirmer",
            save: "Enregistrer",
            close: "Fermer",
            triggerDesc: "Descendant",
            triggerAsc: "Ascendant",
            cancelSort: "Annuler le tri"
        }
    },
    security: {
        errors: {
            unauthorized: "Vous n'êtes pas autorisé à accéder à cette page",
            invalidToken: "Vous n'êtes pas authentifié - jeton invalide"
        }
    },
    errors: {
        api: {
            title: "API Non Connectée",
            subtitle: "Désolé, l'API n'est actuellement pas disponible.",
            backHome: "Retour à l'accueil"
        },
        notFound: {
            title: "404",
            subtitle: "Désolé, la page que vous avez visitée n'existe pas.",
            backHome: "Retour à l'accueil"
        }
    },
};

export default fr_language;
