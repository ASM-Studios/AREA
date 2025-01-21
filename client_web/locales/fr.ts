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
        },
        twoFactor: {
            title: "Authentification à Deux Facteurs",
            description: "Veuillez saisir le code à 6 chiffres de votre application d'authentification",
            form: {
                code: {
                    label: "code de vérification",
                    placeholder: "Entrez le code",
                    validation: {
                        required: "Veuillez saisir le code de vérification",
                        length: "Le code doit contenir 6 chiffres",
                        numeric: "Le code ne doit contenir que des chiffres"
                    }
                },
                submitButton: "Vérifier"
            },
            errors: {
                verificationFailed: "Code de vérification invalide"
            },
            success: {
                verified: "Vérification réussie !"
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
            securitySettings: "Paramètres de Sécurité",
            enableTOTP: "Activer l'Authentification TOTP",
            verifyEmail: "Vérifier l'Email",
            enableEmailAuth: "Activer l'Authentification par Email",
            disable2FA: "Désactiver 2FA",
            setup2FATitle: "Configuration de l'Authentification à Deux Facteurs",
            scan2FAQRCode: "Scannez le code QR avec votre application d'authentification",
            secretsManagement: "Gestion des Secrets",
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
                availableVariables: "Variables Disponibles",
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
            next: "Suivant",
            previous: "Précédent",
            continue: "Continuer",
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
    },
    accessibility: {
        title: "Déclaration d'Accessibilité",
        introduction: {
            title: "Introduction",
            content: "Ce document présente un aperçu des fonctionnalités d'accessibilité mises en œuvre dans le projet AREA Client Web. L'accessibilité est un aspect crucial du développement web, garantissant que tous les utilisateurs, y compris ceux en situation de handicap, puissent accéder et interagir efficacement avec le site web."
        },
        importance: {
            title: "Importance de l'Accessibilité",
            content: "L'accessibilité web est essentielle pour créer un environnement numérique inclusif. Elle garantit que les personnes en situation de handicap peuvent percevoir, comprendre, naviguer et interagir avec le web. En rendant le site accessible, nous respectons non seulement les exigences légales mais améliorons aussi l'expérience utilisateur pour tous."
        },
        features: {
            title: "Fonctionnalités et Considérations d'Accessibilité",
            items: {
                semantic: "L'utilisation d'éléments HTML sémantiques aide les lecteurs d'écran et autres technologies d'assistance à comprendre la structure et le contenu des pages web.",
                keyboard: "Tous les éléments interactifs sont accessibles via la navigation au clavier, permettant aux utilisateurs ne pouvant pas utiliser de souris de naviguer sur le site.",
                contrast: "Le site assure un contraste de couleur suffisant entre le texte et l'arrière-plan, facilitant la lecture pour les utilisateurs malvoyants.",
                aria: "Les attributs ARIA (Applications Internet Riches Accessibles) sont utilisés pour améliorer l'accessibilité du contenu dynamique et des composants d'interface complexes.",
                responsive: "Le site est conçu pour être réactif, assurant l'accessibilité sur différents appareils et tailles d'écran."
            }
        },
        compliance: {
            title: "Conformité aux Normes d'Accessibilité",
            intro: "Le projet AREA Client Web est conforme à plusieurs normes d'accessibilité, notamment :",
            standards: {
                wcag: "Le projet respecte les directives WCAG 2.1, garantissant que le contenu est perceptible, utilisable, compréhensible et robuste.",
                rgaa: "Il s'agit de la norme française d'accessibilité qui s'aligne sur WCAG 2.1 mais inclut des exigences supplémentaires spécifiques à la France.",
                en301: "Il s'agit de la norme européenne pour les exigences d'accessibilité des produits et services TIC, qui s'aligne également sur WCAG 2.1."
            }
        },
        scores: {
            title: "Scores d'Accessibilité",
            intro: "Voici les scores d'accessibilité pour chaque page, mesurés par Google Chrome Lighthouse :",
            mean: "Le score moyen d'accessibilité sur toutes les pages est de 97, indiquant un haut niveau de conformité à l'accessibilité."
        },
        conclusion: {
            title: "Conclusion",
            content: "Le projet AREA Client Web s'engage à fournir une expérience accessible à tous les utilisateurs. En respectant les normes d'accessibilité établies et en évaluant continuellement nos pratiques, nous garantissons que notre site web est inclusif et convivial.",
            learnMore: "Pour plus d'informations sur les pratiques et directives d'accessibilité, veuillez consulter l'"
        }
    },
};

export default fr_language;
