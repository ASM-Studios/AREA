import { Translation } from '@Config/translation.types';

const es_language: Translation = {
    home: {
        title: "Conecta Tu Mundo Digital",
        description: "Automatiza tu vida conectando tus servicios favoritos. Crea potentes flujos de automatización con solo unos clics.",
        getStarted: "Comenzar",
        upperCards: {
            firstCard: {
                title: "Automatización Fácil",
                description: "¡Crea potentes flujos de trabajo de automatización sin necesidad de programar!",
            },
            secondCard: {
                title: "Conecta Servicios",
                description: "Integra con servicios y aplicaciones populares. Hazlos trabajar juntos sin problemas.",
            },
            thirdCard: {
                title: "Seguro y Confiable",
                description: "Tus datos están protegidos con seguridad de nivel empresarial. Ejecuta tus automatizaciones con confianza.",
            },
        },
        lowerCards: {
            firstCard: {
                title: "Elige un Disparador",
                description: "Selecciona un evento que inicie tu automatización",
            },
            secondCard: {
                title: "Añade Acciones",
                description: "Define qué sucede cuando se activa el disparador",
            },
            thirdCard: {
                title: "Míralo Funcionar",
                description: "Relájate y deja que Area se encargue del resto",
            },
        },
    },
    authForm: {
        login: {
            title: "Iniciar Sesión",
            form: {
                email: {
                    placeholder: "ejemplo@ejemplo.com",
                    tooltip: "Por favor ingresa tu correo electrónico",
                    validation: {
                        required: "¡Por favor ingresa tu correo electrónico!",
                        invalid: "¡Por favor ingresa una dirección de correo válida!"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Por favor ingresa tu contraseña",
                    validation: {
                        required: "¡Por favor ingresa tu contraseña!",
                        pattern: "La contraseña debe contener al menos una letra, un número y un carácter especial.",
                        length: "La contraseña debe tener al menos 8 caracteres."
                    }
                },
                submitButton: "Iniciar Sesión",
                noAccountLink: "No tengo una cuenta"
            },
            errors: {
                loginFailed: "Error al iniciar sesión:",
                jwtNotFound: "Token de autenticación no encontrado"
            }
        },
        register: {
            title: "Registrarse",
            form: {
                username: {
                    placeholder: "Ingresa tu nombre de usuario",
                    tooltip: "Por favor ingresa el nombre de usuario deseado",
                    validation: {
                        required: "¡Por favor ingresa tu nombre de usuario!"
                    }
                },
                email: {
                    placeholder: "ejemplo@ejemplo.com",
                    tooltip: "Por favor ingresa tu correo electrónico",
                    validation: {
                        required: "¡Por favor ingresa tu correo electrónico!",
                        invalid: "¡Por favor ingresa un correo válido!"
                    }
                },
                password: {
                    placeholder: "********",
                    tooltip: "Por favor ingresa tu contraseña",
                    validation: {
                        required: "¡Por favor ingresa tu contraseña!",
                        pattern: "La contraseña debe contener al menos una letra, un número y un carácter especial.",
                        length: "La contraseña debe tener al menos 8 caracteres."
                    }
                },
                confirmPassword: {
                    placeholder: "********",
                    tooltip: "Por favor confirma tu contraseña",
                    validation: {
                        required: "¡Por favor confirma tu contraseña!",
                        match: "¡Las contraseñas no coinciden!"
                    }
                },
                submitButton: "Registrarse",
                haveAccountLink: "Ya tengo una cuenta"
            },
            errors: {
                registerFailed: "Error al registrarse:",
                jwtNotFound: "Token de autenticación no encontrado"
            },
            success: {
                registered: "¡Registro exitoso!"
            }
        }
    },
    header: {
        home: "Inicio",
        login: "Iniciar Sesión",
        register: "Registrarse",
        dashboard: "Panel de Control",
        createWorkflow: "Crear Flujo de Trabajo",
        profile: {
            title: "Perfil",
            settings: "Configuración",
            logout: "Cerrar Sesión",
            tooltip: "Por favor inicia sesión para acceder a la configuración del perfil",
        }
    },
    footer: {
        reservedRights: "©2024 ASM. Todos los derechos reservados.",
    },
    userPage: {
        profileCard: {
            title: "Información del Usuario",
            welcomeMessage: "¡Bienvenido de nuevo, {name}!",
            description: "Esta es tu página de usuario",
            logoutDescription: "Cerrar sesión de tu cuenta",
            logoutButton: "Cerrar Sesión",
        },
        themeSettings: {
            title: "Configuración del Tema",
            description: "Personaliza tu color de fondo",
            resetButton: "Restablecer al Color Predeterminado",
        },
        connectedServices: {
            title: "Servicios Conectados",
            description: "Administra tus servicios conectados",
            connectedServices: "Servicios Conectados",
            connectedAt: "Conectado el",
        },
    },
    callback: {
        errors: {
            stateMismatch: "Estado no coincide. Por favor intenta de nuevo.",
            tokenExchange: "Error al intercambiar el token",
            invalidService: "Servicio inválido: {service}",
            genericError: "Error al conectar con {service}",
        },
        loading: {
            title: "Conectando con {service}",
            description: "Por favor espera mientras completamos tu autenticación...",
        },
        redirect: {
            message: "Redirigiendo...",
        }
    },
    oauthButtons: {
        signin: "Iniciar sesión con",
        signup: "Registrarse con",
        connect: "Conectar con",
        use: "Usar",
        or: "O",
    },
    dashboard: {
        cards: {
            firstCard: {
                title: "Total de Automatizaciones",
            },
            secondCard: {
                title: "Automatizaciones Activas",
            },
            thirdCard: {
                title: "Actualizaciones Pendientes",
            }
        },
        table: {
            title: "Actividad",
            createWorkflow: "Crear un Flujo de Trabajo",
            searchWorkflows: "Buscar flujos de trabajo",
        },
        errors: {
            fetchWorkflows: "Error al obtener los flujos de trabajo",
            fetchUser: "Error al obtener los datos del usuario",
        }
    },
    workflow: {
        table: {
            columns: {
                name: "Nombre",
                description: "Descripción",
                status: "Estado",
                active: "Activo",
                createdAt: "Creado el",
                updatedAt: "Actualizado el",
                actions: "Acciones"
            },
            activeStatus: {
                yes: "Sí",
                no: "No"
            },
            filters: {
                active: "Activo",
                inactive: "Inactivo"
            },
            tooltips: {
                edit: "Editar flujo de trabajo",
                activate: "Activar flujo de trabajo",
                deactivate: "Desactivar flujo de trabajo",
                delete: "Eliminar flujo de trabajo"
            },
            ariaLabels: {
                edit: "Editar flujo de trabajo",
                activate: "Activar flujo de trabajo",
                deactivate: "Desactivar flujo de trabajo",
                delete: "Eliminar flujo de trabajo"
            }
        },
        notifications: {
            success: {
                updated: "Flujo de trabajo actualizado",
                deleted: "Flujo de trabajo eliminado"
            },
            error: {
                updateFailed: "Error al actualizar el flujo de trabajo",
                deleteFailed: "Error al eliminar el flujo de trabajo"
            }
        },
        create: {
            form: {
                name: {
                    label: "Nombre",
                    placeholder: "Ingresa el nombre de tu flujo de trabajo",
                    example: "Mi Flujo de Trabajo",
                    required: "Por favor ingresa un nombre para tu flujo de trabajo"
                },
                description: {
                    label: "Descripción",
                    placeholder: "Ingresa la descripción de tu flujo de trabajo",
                    example: "Este flujo de trabajo enviará un mensaje a mi canal de Slack cuando llegue un nuevo correo"
                }
            },
            sections: {
                availableActions: "Acciones Disponibles",
                availableReactions: "Reacciones Disponibles",
                selectedItems: "Elementos Seleccionados",
                when: "Cuando",
                then: "Entonces"
            },
            buttons: {
                foldAll: "Plegar Todo",
                unfoldAll: "Desplegar Todo",
                clearActions: "Limpiar Acciones",
                clearReactions: "Limpiar Reacciones",
                create: "Crear",
                cancel: "Cancelar"
            },
            errors: {
                noServices: {
                    title: "No Hay Servicios Conectados",
                    subtitle: "Necesitas conectar al menos un servicio para crear un flujo de trabajo",
                    connectService: "Conectar Servicio",
                    goBack: "Volver"
                },
                apiError: {
                    title: "Error de API",
                    subtitle: "No se pudo obtener la información del servicio"
                }
            },
            loading: "Creando flujo de trabajo...",
            success: {
                published: "¡Flujo de trabajo creado exitosamente!"
            }
        },
        update: {
            form: {
                name: {
                    label: "Nombre",
                    placeholder: "Ingresa el nombre de tu flujo de trabajo",
                    example: "Mi Flujo de Trabajo",
                    required: "Por favor ingresa un nombre para tu flujo de trabajo"
                },
                description: {
                    label: "Descripción",
                    placeholder: "Ingresa la descripción de tu flujo de trabajo",
                    example: "Este flujo de trabajo enviará un mensaje a mi canal de Slack cuando llegue un nuevo correo"
                }
            },
            sections: {
                availableActions: "Acciones Disponibles",
                availableReactions: "Reacciones Disponibles",
                selectedItems: "Elementos Seleccionados",
                when: "Cuando",
                then: "Entonces"
            },
            buttons: {
                foldAll: "Plegar Todo",
                unfoldAll: "Desplegar Todo",
                clearActions: "Limpiar Acciones",
                clearReactions: "Limpiar Reacciones",
                update: "Actualizar",
                cancel: "Cancelar"
            },
            errors: {
                noServices: {
                    title: "No Hay Servicios Conectados",
                    subtitle: "Necesitas conectar al menos un servicio para actualizar un flujo de trabajo",
                    connectService: "Conectar Servicio",
                    goBack: "Volver"
                },
                noWorkflow: {
                    title: "Flujo de Trabajo No Encontrado",
                    subtitle: "El flujo de trabajo que intentas editar no existe"
                },
                apiError: {
                    title: "Error de API",
                    subtitle: "No se pudo obtener la información del flujo de trabajo"
                },
                updateFailed: "Error al actualizar el flujo de trabajo"
            },
            loading: "Actualizando flujo de trabajo...",
            success: {
                updated: "¡Flujo de trabajo actualizado exitosamente!"
            }
        }
    },
    common: {
        table: {
            noData: "No se encontraron datos",
            ok: "Aceptar",
            reset: "Restablecer",
            filter: "Filtrar",
            selectAll: "Seleccionar Todo",
            sort: "Ordenar",
            search: "Buscar",
            clear: "Limpiar",
            apply: "Aplicar",
            cancel: "Cancelar",
            edit: "Editar",
            delete: "Eliminar",
            activate: "Activar",
            deactivate: "Desactivar",
            confirm: "Confirmar",
            save: "Guardar",
            close: "Cerrar",
            triggerDesc: "Descendente",
            triggerAsc: "Ascendente",
            cancelSort: "Cancelar Ordenamiento",
            next: "Siguiente",
        }
    },
    security: {
        errors: {
            unauthorized: "No estás autorizado para acceder a esta página",
            invalidToken: "No estás autenticado - token inválido"
        }
    },
    errors: {
        api: {
            title: "API No Conectada",
            subtitle: "Lo sentimos, la API no está disponible actualmente.",
            backHome: "Volver al Inicio"
        },
        notFound: {
            title: "404",
            subtitle: "Lo sentimos, la página que visitaste no existe.",
            backHome: "Volver al Inicio"
        }
    },
};

export default es_language;
