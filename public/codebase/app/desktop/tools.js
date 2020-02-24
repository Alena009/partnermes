var toolsLayout;

function toolsInit(cell) {
    if (toolsLayout == null) {
        var userData = JSON.parse(localStorage.getItem("userData")); 
        var userCanWrite;
        userData.permissions.forEach(function(elem){
            if (elem.name == 'tools') {
                userCanWrite = elem.pivot.value;
            }
        });
                
        var toolsLayout = cell.attachLayout("1C");  
        toolsLayout.cells("a").hideHeader();
        var tabBar = toolsLayout.cells("a").attachTabbar();
      
        tabBar.addTab("a1", _("Operacje"), null, null, true);        
        tabBar.addTab("a2", _("Narzędzia"));               
        var operationsLayout = tabBar.tabs("a1").attachLayout("2U");        
        operationsLayout.setAutoSize("a", "a;b");  
        operationsLayout.cells("a").setText(_("Operacje"));                    
        operationsLayout.cells("b").setText(_("Informacja"));
        operationsLayout.cells("b").setWidth(330);
        operationsLayout.setAutoSize("a", "a;b");         
        var toolsListLayout = tabBar.tabs("a2").attachLayout("2U");        
        toolsListLayout.cells("a").setText(_("Narzędzia"));                    
        toolsListLayout.cells("b").setText(_("Informacja"));
        toolsListLayout.cells("b").setWidth(330);
        toolsListLayout.setAutoSize("a", "a;b"); 
/**
 * Operations
 * 
 */  
/**
 * A
 * 
 */
        var toolsOperationsGridToolbar;
        userCanWrite ? toolsOperationsGridToolbar = operationsLayout.cells("a").attachToolbar(standartToolbar):
                toolsOperationsGridToolbar = operationsLayout.cells("a").attachToolbar(emptyToolbar);
        toolsOperationsGridToolbar.attachEvent("onClick", function(id) { 
            switch (id){
                case 'Add':{  
                    toolOperationForm.clear();
                    toolOperationForm.setItemFocus("type_operation");
                    toolsOperationsGrid.clearSelection();
                };break;
                case 'Edit':{ 
                    var operationId = toolsOperationsGrid.getSelectedRowId();                            
                    if (operationId) {
                        toolsOperationsGrid.setItemFocus("type_operation");
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz operacje, którą chcesz zmienić!")
                        });
                    }                              
                };break;                    
                case 'Del': {                                                                                                                                                                                                                                                   
                    var operationId = toolsOperationsGrid.getSelectedRowId();                            
                    if (operationId) {
                        toolsOperationsGrid.delete("api/toolsoperations/" + operationId, operationId);
                        toolOperationForm.clear(); 
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Wybierz operacje, którą chcesz usunąć!")
                        });
                    }                            
                };break; 
                case 'Redo': {
                    toolOperationForm.clear();
                    toolsOperationsGrid.fill(0);
                };break;
            }
        });
        var toolsOperationsGrid = operationsLayout.cells("a").attachGrid({            
            image_path:'codebase/imgs/',
            columns: [                                                  
                {
                    label: _("Kod narzędzia"),                 
                    id: "kod",
                    type: "ro",                                             
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Pracownik"),                   
                    id: "user_name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Operacja"),                  
                    id: "type_operation",
                    type: "coro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Iłość"),                  
                    id: "amount",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    id: "user_id"
                },
                {
                    id: "tool_id"
                }
            ]
        }); 
        toolsOperationsGrid.setColumnHidden(4,true);
        toolsOperationsGrid.setColumnHidden(5,true);
        toolsOperationsGrid.fill = function(ids){
            toolsOperationsGrid.clearAll();
            ajaxGet('api/toolsoperations', '', function(data){
                if (data.data && data.success){			    
                    toolsOperationsGrid.parse(data.data, "js");
                }
            });			
        };    
        var operationsTypeCombo = toolsOperationsGrid.getCombo(2);        
        operationsTypeCombo.put('1', _('Give'));
        operationsTypeCombo.put('2', _('Return'));
        toolsOperationsGrid.fill(0);
/**
 * B
 * 
 */ 
        var toolOperationForm = createForm(toolOperationFormStruct, operationsLayout.cells("b"));
        var usersCombo = toolOperationForm.getCombo("user_id");
        ajaxGet("api/users", "", function(data){
            usersCombo.addOption(data.data);           
        });
        var toolsCombo = toolOperationForm.getCombo("tool_id");
        ajaxGet("api/tools", "", function(data){
            toolsCombo.addOption(data.data);
            toolsGrid.parse(data.data, "js");
        });
        toolOperationForm.attachEvent("onChange", function (name, value, state){
            if (name == "type" && "value" == "0" && state) {
                toolOperationForm.disableItem("amount_return");
            }
        });
        toolOperationForm.attachEvent("onButtonClick", function(name){
            if (name === 'save'){  
                var operationData = toolOperationForm.getFormData();
                if (toolsOperationsGrid.getSelectedRowId()) {                         
                    toolsOperationsGrid.edit("api/toolsoperations/" + operationData.id + "/edit", 
                                        operationData);                        
                } else {    
                    toolsOperationsGrid.add("api/toolsoperations", operationData);                
                }
            }
        });            
        toolOperationForm.bind(toolsOperationsGrid);        
/**
 * Tools
 * 
 */        
/**
 * A
 * 
 */
        var toolsGridToolbar;
        userCanWrite ? toolsGridToolbar = toolsListLayout.cells("a").attachToolbar(standartToolbar):
                toolsListLayout.cells("a").attachToolbar(emptyToolbar);
        toolsGridToolbar.attachEvent("onClick", function(id) { 
                switch (id){
                    case 'Add':{   
                        toolsForm.clear(); 
                        toolsForm.setItemFocus("kod");
                        toolsGrid.clearSelection();
                    };break;
                    case 'Edit':{ 
                        var toolId = toolsGrid.getSelectedRowId();                            
                        if (toolId) {
                            toolsForm.setItemFocus("kod");
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz narzędzie, które chcesz zmienić!")
                            });
                        }                              
                    };break;                    
                    case 'Del': {                                                                                                                                                                                                                                                   
                        var toolId = toolsGrid.getSelectedRowId();                            
                        if (toolId) {
                            toolsGrid.delete("api/tools/" + toolId, toolId);
                            toolsForm.clear();                              
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz , które chcesz usunąć!")
                            });
                        }                            
                    };break; 
                    case 'Redo': {  
                        toolsGrid.fill("api/tools");
                        toolsForm.clear(); 
                    };break;
                }
            });        
        var toolsGrid = toolsListLayout.cells("a").attachGrid({            
            image_path:'codebase/imgs/',
            columns: [                                                  
                {
                    label: _("Kod"),                 
                    id: "kod",
                    type: "ro",                                             
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Nazwa"),                   
                    id: "name",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                },
                {
                    label: _("Opis"),                  
                    id: "description",
                    type: "ro", 
                    sort: "str", 
                    align: "left"
                }                    
            ]
        });       
/**
 * B
 * 
 */        
        var toolsForm = createForm(newToolFormStruct, toolsListLayout.cells("b")); 
        toolsForm.attachEvent("onButtonClick", function(name){
            if (name === 'save'){  
                var toolData = toolsForm.getFormData();
                if (toolsGrid.getSelectedRowId()) {                         
                    toolsGrid.edit("api/tools/" + toolData.id + "/edit", toolData);                        
                } else {    
                    toolsGrid.add("api/tools", toolData);                
                }
            }
        });            
        toolsForm.bind(toolsGrid);
                                    
    }	    
}
var newToolFormStruct = [          
                    {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},   	                            
                    {type: "input", name: "kod",  required: true, label: _("Kod")},
                    {type: "input", name: "name", required: true, label: _("Nazwa")},
                    {type: "input", name: "description", label: _("Opis"), rows: 3},                                        
                    {type: "block", blockOffset: 0, position: "label-left", list: [
                        {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
                    ]}	
            ];
var toolOperationFormStruct = [          
        {type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},   
        {type: "combo", name: "type_operation", required: true, label: _("Operacja"), 
            options: [{text:"", value:"0"}, {text:_("Give"), value: "1"}, {text:_("Return"), value: "2"}]},		        
        {type: "combo", name: "user_id", required: true, label: _("Pracownik"), options: []},		
        {type: "combo", name: "tool_id", required: true, label: _("Narzędzia"), options: []},		
        {type: "input", name: "amount", required: true, label: _("Iłość")},
        {type: "block", blockOffset: 0, position: "label-left", list: [
            {type: "button", name: "save",   value: "Zapisz", offsetTop:18}                            
        ]}	
];

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){    
	if (id == "tools") {                        
            window.history.pushState({ 'page_id': id }, null, '#tools'); 
            toolsInit(cell);      
        }        
});