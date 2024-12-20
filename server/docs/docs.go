// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "http://www.swagger.io/support",
            "email": "support@example.com"
        },
        "license": {
            "name": "GPL-3.0",
            "url": "https://www.gnu.org/licenses/gpl-3.0.en.html#license-text"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/about.json": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Get information about the server",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "about"
                ],
                "summary": "Get information about the server",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    }
                }
            }
        },
        "/auth/health": {
            "get": {
                "description": "Validate the token and return 200 if valid, 401 if expired or invalid",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Check if the JWT is valid",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/auth/login": {
            "post": {
                "description": "Authenticate a user and return a JWT token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Login a user",
                "parameters": [
                    {
                        "description": "Login",
                        "name": "Login",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.LoginRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/auth/register": {
            "post": {
                "description": "Create a new user and return a JWT token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Register a user",
                "parameters": [
                    {
                        "description": "Register",
                        "name": "Register",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.RegisterRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "409": {
                        "description": "Conflict",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/ping": {
            "get": {
                "description": "ping",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "ping"
                ],
                "summary": "Ping",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/publish/message": {
            "post": {
                "description": "publish/Message",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "publish/Message"
                ],
                "summary": "Message",
                "parameters": [
                    {
                        "type": "string",
                        "description": "Message",
                        "name": "message",
                        "in": "formData",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/workflow/create": {
            "post": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Create a new workflow",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "workflow"
                ],
                "summary": "Create a workflow",
                "parameters": [
                    {
                        "description": "workflow",
                        "name": "workflow",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.WorkflowDTO"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/models.WorkflowDTO"
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/workflow/delete/{id}": {
            "delete": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "Delete a workflow by ID",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "workflow"
                ],
                "summary": "Delete a workflow",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "workflow ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "Not Found",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/workflow/list": {
            "get": {
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "description": "List all workflows",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "workflow"
                ],
                "summary": "List workflows",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.WorkflowDTO"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.EventDTO": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "parameters": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.ParametersDTO"
                    }
                },
                "service_id": {
                    "type": "integer"
                },
                "type": {
                    "$ref": "#/definitions/models.EventType"
                }
            }
        },
        "models.EventType": {
            "type": "string",
            "enum": [
                "action",
                "reaction"
            ],
            "x-enum-varnames": [
                "ActionEventType",
                "ReactionEventType"
            ]
        },
        "models.LoginRequest": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "models.ParametersDTO": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "event_id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "models.RegisterRequest": {
            "type": "object",
            "required": [
                "email",
                "password",
                "username"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "models.WorkflowDTO": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "events": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/models.EventDTO"
                    }
                },
                "is_active": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                },
                "status": {
                    "$ref": "#/definitions/models.WorkflowStatus"
                },
                "user_id": {
                    "type": "integer"
                }
            }
        },
        "models.WorkflowStatus": {
            "type": "string",
            "enum": [
                "pending",
                "processed",
                "failed"
            ],
            "x-enum-varnames": [
                "WorkflowStatusPending",
                "WorkflowStatusProcessed",
                "WorkflowStatusFailed"
            ]
        }
    },
    "securityDefinitions": {
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "AREA API",
	Description:      "API documentation for AREA backend",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
