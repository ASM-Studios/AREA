import { Translation } from '@Config/translation.types';

const fr_language: Translation = {
    home: {
        title: "Connectez Votre Monde Numérique",
        description: "Automatisez votre vie en connectant vos services préférés. Créez des flux d'automatisation puissants en quelques clics.",
        getStarted: "Commencer",
        upperCards: {
            firstCard: {
                title: "Automatisation Facile",
                description: "Créez des workflows d'automatisation puissants sans programmation !",
            },
            secondCard: {
                title: "Connectez vos Services",
                description: "Intégrez vos services et applications populaires. Faites-les travailler ensemble en toute transparence.",
            },
            thirdCard: {
                title: "Sûr et Fiable",
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
                description: "Détendez-vous et laissez Area s'occuper du reste",
            },
        },
    },
    authForm: {
        login: {
            title: "Connexion",
            form: {
                email: {
                    label: "Nom d'utilisateur",
                    placeholder: "exemple@exemple.com",
                    tooltip: "Veuillez saisir votre adresse email",
                    validation: {
                        required: "Veuillez saisir votre email !",
                        invalid: "Veuillez saisir une adresse email valide !"
                    }
                },
                password: {
                    label: "Mot de Passe",
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
            title: "Inscription",
            form: {
                username: {
                    label: "Nom d'Utilisateur",
                    placeholder: "Entrez votre nom d'utilisateur",
                    tooltip: "Veuillez saisir le nom d'utilisateur souhaité",
                    validation: {
                        required: "Veuillez saisir votre nom d'utilisateur !"
                    }
                },
                email: {
                    label: "Email",
                    placeholder: "exemple@exemple.com",
                    tooltip: "Veuillez saisir votre adresse email",
                    validation: {
                        required: "Veuillez saisir votre email !",
                        invalid: "Veuillez saisir un email valide !"
                    }
                },
                password: {
                    label: "Mot de Passe",
                    placeholder: "********",
                    tooltip: "Veuillez saisir votre mot de passe",
                    validation: {
                        required: "Veuillez saisir votre mot de passe !",
                        pattern: "Le mot de passe doit contenir au moins une lettre, un chiffre et un caractère spécial.",
                        length: "Le mot de passe doit contenir au moins 8 caractères."
                    }
                },
                confirmPassword: {
                    label: "Confirmer le Mot de Passe",
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
        register: "Inscription",
        dashboard: "Tableau de bord",
        createWorkflow: "Créer un Workflow",
        accessibility: "Accessibilité",
        download: "Téléchargements",
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
            title: "Informations Utilisateur",
            welcomeMessage: "Bon retour, {name} !",
            description: "Voici votre page utilisateur",
            logoutDescription: "Se déconnecter de votre compte",
            logoutButton: "Déconnexion",
        },
        themeSettings: {
            title: "Paramètres du Thème",
            description: "Personnalisez votre couleur de fond",
            resetButton: "Réinitialiser la Couleur",
        },
        connectedServices: {
            title: "Services Connectés",
            description: "Gérez vos services connectés",
            connectedServices: "Services Connectés",
            connectedAt: "Connecté le",
        },
    },
    callback: {
        errors: {
            stateMismatch: "État non correspondant. Veuillez réessayer.",
            tokenExchange: "Échec de l'échange de jeton",
            invalidService: "Service invalide : {service}",
            genericError: "Échec de la connexion avec {service}",
        },
        loading: {
            title: "Connexion à {service}",
            description: "Veuillez patienter pendant que nous finalisons votre authentification...",
        },
        redirect: {
            message: "Redirection en cours...",
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
                title: "Total des Automatisations",
            },
            secondCard: {
                title: "Automatisations Actives",
            },
            thirdCard: {
                title: "Mises à jour en attente",
            }
        },
        table: {
            title: "Activité",
            createWorkflow: "Créer un Workflow",
            searchWorkflows: "Rechercher des workflows",
        },
        errors: {
            fetchWorkflows: "Échec de la récupération des workflows",
            fetchUser: "Échec de la récupération des données utilisateur",
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
                updatedAt: "Mis à jour le",
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
        },
        handler: {
            form: {
                name: {
                    label: "Nom",
                    placeholder: "Entrez le nom de votre workflow",
                    example: "Mon Workflow",
                    required: "Veuillez entrer un nom pour votre workflow"
                },
                description: {
                    label: "Description",
                    placeholder: "Entrez la description de votre workflow",
                    example: "Ce workflow enverra un message à mon canal Slack lorsqu'un nouvel email arrive"
                }
            },
            sections: {
                availableActions: "Actions Disponibles",
                availableReactions: "Réactions Disponibles",
                selectedItems: "Éléments Sélectionnés",
                when: "Quand",
                then: "Alors"
            },
            buttons: {
                foldAll: "Tout Replier",
                unfoldAll: "Tout Déplier",
                clearActions: "Effacer les Actions",
                clearReactions: "Effacer les Réactions",
                create: "Créer",
                cancel: "Annuler",
                update: "Mettre à Jour"
            },
            errors: {
                noServices: {
                    title: "Aucun Service Connecté",
                    subtitle: "Vous devez connecter au moins un service pour créer un workflow",
                    connectService: "Connecter un Service",
                    goBack: "Retour"
                },
                apiError: {
                    title: "Erreur API",
                    subtitle: "Impossible d'obtenir les informations du service"
                }
            },
            loading: "Création du workflow en cours...",
            success: {
                published: "Workflow créé avec succès !"
            }
        },
        update: {
            form: {
                name: {
                    label: "Nom",
                    placeholder: "Entrez le nom de votre workflow",
                    example: "Mon Workflow",
                    required: "Veuillez entrer un nom pour votre workflow"
                },
                description: {
                    label: "Description",
                    placeholder: "Entrez la description de votre workflow",
                    example: "Ce workflow enverra un message à mon canal Slack lorsqu'un nouvel email arrive"
                }
            },
            sections: {
                availableActions: "Actions Disponibles",
                availableReactions: "Réactions Disponibles",
                selectedItems: "Éléments Sélectionnés",
                when: "Quand",
                then: "Alors"
            },
            buttons: {
                foldAll: "Tout Replier",
                unfoldAll: "Tout Déplier",
                clearActions: "Effacer les Actions",
                clearReactions: "Effacer les Réactions",
                update: "Mettre à Jour",
                cancel: "Annuler"
            },
            errors: {
                noServices: {
                    title: "Aucun Service Connecté",
                    subtitle: "Vous devez connecter au moins un service pour mettre à jour un workflow",
                    connectService: "Connecter un Service",
                    goBack: "Retour"
                },
                noWorkflow: {
                    title: "Workflow Introuvable",
                    subtitle: "Le workflow que vous essayez de modifier n'existe pas"
                },
                apiError: {
                    title: "Erreur API",
                    subtitle: "Impossible d'obtenir les informations du workflow"
                },
                updateFailed: "Échec de la mise à jour du workflow"
            },
            loading: "Mise à jour du workflow...",
            success: {
                updated: "Workflow mis à jour avec succès !"
            }
        }
    },
    common: {
        table: {
            noData: "Aucune donnée trouvée",
            ok: "OK",
            reset: "Réinitialiser",
            filter: "Filtrer",
            selectAll: "Tout Sélectionner",
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
            triggerDesc: "Décroissant",
            triggerAsc: "Croissant",
            cancelSort: "Annuler le tri",
            next: "Suivant"
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
            backHome: "Retour à l'Accueil"
        },
        notFound: {
            title: "404",
            subtitle: "Désolé, la page que vous recherchez n'existe pas.",
            backHome: "Retour à l'Accueil"
        },
        attack: {
            title: "Attaque Détectée",
            subtitle: "Désolé, cette page n'est pas disponible.",
            backHome: "Retour à l'Accueil"
        }
    },
    download: {
        title: "Préparation de l'application Android",
        description: "Veuillez patienter pendant que nous préparons votre téléchargement. Cela peut prendre quelques minutes.",
    }
};

export default fr_language;
