package controllers

import (
	"AREA/internal/models"
	"AREA/internal/pkg"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// WorkflowCreate godoc
// @Summary      Create a workflow
// @Description  Create a new workflow
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Param        workflow  body  models.WorkflowDTO  true  "workflow"
// @Success      200  {object}  models.WorkflowDTO
// @Failure      400  {object}  map[string]string
// @Router       /workflow/create [post]
func WorkflowCreate(c *gin.Context) {
	var workflow models.Workflow
	err := c.BindJSON(&workflow)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	workflow.UserID, err = pkg.GetUserFromToken(c)
	if err != nil {
		return
	}
	pkg.DB.Create(&workflow)
	c.JSON(200, gin.H{"workflow": workflow})
}

// WorkflowList godoc
// @Summary      List workflows
// @Description  List all workflows
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Success      200  {object}  []models.WorkflowDTO
// @Router       /workflow/list [get]
func WorkflowList(c *gin.Context) {
	var workflows []models.Workflow
	userID, err := pkg.GetUserFromToken(c)
	if err != nil {
		return
	}
	pkg.DB.Where("user_id = ?", userID).Find(&workflows)
	c.JSON(200, gin.H{"workflows": workflows})
}

// WorkflowDelete godoc
// @Summary      Delete a workflow
// @Description  Delete a workflow by ID
// @Security     Bearer
// @Tags         workflow
// @Accept       json
// @Produce      json
// @Param        id  path  int  true  "workflow ID"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /workflow/delete/{id} [delete]
func WorkflowDelete(c *gin.Context) {
	idParam := c.Param("id")
	workflowID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid workflow ID"})
		return
	}
	var workflow models.Workflow
	result := pkg.DB.First(&workflow, workflowID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Workflow not found"})
		return
	}
	result = pkg.DB.Delete(&workflow)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete workflow"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Workflow deleted successfully"})
}
