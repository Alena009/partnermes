function tasksModule(groupId) 
{
    var groupTasksWindow = createWindow(_("Zadania"), 500, 500);  
    var groupTasksLayout = groupTasksWindow.attachLayout("1C");
    groupTasksLayout.cells("a").hideHeader();
    var groupTasksGridToolbar = getTasksGridToolBar(groupTasksLayout.cells("a"), true);
    groupTasksGridToolbar.hideItem("AddToProduct");
    groupTasksGridToolbar.attachEvent("onClick", function(name) {
        switch(name) {
            case "AddToGroup": {                                        
                var addingForm = addEditTaskForm();                        
                addingForm.attachEvent("onButtonClick", function(name){
                    if (name == "save") {
                        var data = this.getFormData();
                        data.product_group_id = groupId;                                            
                        groupTasksGrid.add("api/prodgroups/addtask", data);
                        addingForm.clear();
                    }
                });                                                                                
            };break;
            case "Edit": {
                var taskId = groupTasksGrid.getSelectedRowId();  
                var data = groupTasksGrid.getRowData(taskId);
                if (data.product_group_id === groupId) {
                    var editForm = addEditTaskForm(taskId);
                    editForm.setFormData(data);
                    editForm.disableItem("task_id"); 
                    editForm.attachEvent("onButtonClick", function(name){
                        if (name == "save") {
                            var data = this.getFormData();
                            data.product_group_id = groupId;    
                            groupTasksGrid.edit("api/prodgroups/tasks/" + groupId +"/" + 
                                    data.task_id + "/edit", data);
                        }
                    });                                        
                } else {
                    dhtmlx.alert({
                        title:_("Wiadomość"),
                        text:_("Te zadanie należy do innej (starszej) grupy")
                    });
                }
            };break;                                 
            case "Del": {                                        
                var taskId = groupTasksGrid.getSelectedRowId(); 
                var data = groupTasksGrid.getRowData(taskId);
                if (data.product_group_id === groupId) {
                    groupTasksGrid.delete("api/prodgroups/deletetask/" + 
                            data.product_group_id + "/" + data.task_id, taskId);                         
                } else {
                    dhtmlx.alert({
                        title:_("Wiadomość"),
                        text:_("Te zadanie należy do innej (starszej) grupy")
                    });
                }                                                                                                           
            };break;           
            case "Redo": { 
                groupTasksGrid.fill("api/prodgroups/tasks/" + groupId + "/" + localStorage.language);                                                                    
            };break;
        }
    });     
    var groupTasksGrid = getTasksGrid(groupTasksLayout.cells("a"));                                      
    groupTasksGrid.fill("api/prodgroups/tasks/" + groupId + "/" + localStorage.language);   
    groupTasksGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
        var source = groupTasksGrid.getRowData(sId);
        var target = groupTasksGrid.getRowData(tId);
        var sourcePriority = source.priority;
        var targetPriority = target.priority;
              
        if (source.product_group_id === groupId && target.product_group_id === groupId) {
            source.priority = targetPriority;
            target.priority = sourcePriority;
            groupTasksGrid.edit("api/prodgroups/tasks/" + groupId +"/" + 
                                        source.task_id + "/edit", source);  
            groupTasksGrid.edit("api/prodgroups/tasks/" + groupId +"/" + 
                                        target.task_id + "/edit", target); 
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Nie można zmienić kolejność mędzy zadaniami róźnych grup")
            });
        }                            
    }); 
    var dpTasksGrid = new dataProcessor("api/prodgroups/tasks/" + groupId + "/" + localStorage.language, "js");                
    dpTasksGrid.init(groupTasksGrid);
    dpTasksGrid.enableDataNames(true);
    dpTasksGrid.setTransactionMode("REST");                
    dpTasksGrid.enableDebug(true);
    dpTasksGrid.setUpdateMode("row", true);
    dpTasksGrid.attachEvent("onBeforeDataSending", function(id, state, data){
        data.id = id;                      
        ajaxGet("api/prodgroups/tasks/" + groupId +"/" + data.task_id + "/edit", data, function(data){ 
            if (data.success) {
                dpTasksGrid.setUpdated(id);
            }
        });
    });     
    
    return groupTasksWindow;
}
