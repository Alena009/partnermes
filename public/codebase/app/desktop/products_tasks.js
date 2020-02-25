var productsTasksLayout;

function productsTasksInit(cell) {
    if (productsTasksLayout == null) {
        var userData = JSON.parse(localStorage.getItem("userData")); 
        var userCanWrite;
        userData.permissions.forEach(function(elem){
            if (elem.name == 'products_tasks') {
                userCanWrite = elem.pivot.value;
            }
        });
        var productsTasksLayout = cell.attachLayout("1C");
        var mainTabbar = productsTasksLayout.cells("a").attachTabbar();
        mainTabbar.addTab("a1", _("Grupy zadań, zadania"), null, null, true);               
        mainTabbar.addTab("a2", _("Produkty-zadania"));             
/**
 * Tabs
 * 
 */
            var tasksGroupsLayout = mainTabbar.tabs("a1").attachLayout("2U"); 
            tasksGroupsLayout.cells("a").setText(_("Grupy zadań"));
            tasksGroupsLayout.cells("b").setText(_("Zadania"));
            tasksGroupsLayout.cells("a").setWidth(280);
            tasksGroupsLayout.setAutoSize("a", "a;b");
            var productsTasksLayout = mainTabbar.tabs("a2").attachLayout("4W"); 
            productsTasksLayout.cells("a").setText(_("Grupy produktów"));
			productsTasksLayout.cells("b").setText(_("Zadania do grup produktów"));            
            productsTasksLayout.cells("c").setText(_("Produkty"));
            productsTasksLayout.cells("d").setText(_("Zadania do produktów"));            
/**
 * Grupy zadan
 * 
 */
/**
 * A
 * 
 */
                var tasksGroupsToolBar;
                userCanWrite ? tasksGroupsToolBar = tasksGroupsLayout.cells("a").attachToolbar(standartToolbar):
                        tasksGroupsToolBar = tasksGroupsLayout.cells("a").attachToolbar(emptyToolbar);
                tasksGroupsToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{			                                        
                                    createAddEditGroupWindow("api/taskgroups", "api/taskgroups", tasksGroupsTree, 0);
                            };break;
                            case 'Edit':{
                                var id = tasksGroupsTree.getSelectedId();
                                if (id) {                                        
                                    createAddEditGroupWindow("api/taskgroups", "api/taskgroups/" + id + "/edit", tasksGroupsTree, id);
                                }
                            };break;
                            case 'Del':{
                                var id = tasksGroupsTree.getSelectedId();
                                if (id) {
                                    deleteNodeFromTree(tasksGroupsTree, "api/taskgroups/" + id);
                                }
                            };break;
                    }
                });
                var tasksGroupsTree = tasksGroupsLayout.cells("a").attachTreeView({
                        skin: "dhx_web",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect
                        checkboxes: true,           // boolean, optional, enables checkboxes
                        dnd: true,           // boolean, optional, enables drag-and-drop
                        context_menu: true           // boolean, optional, enables context menu			
                });                 
                tasksGroupsTree.attachEvent("onDrop",function(id){			
                        var parent_id = arguments[1];
                        parent_id = (parent_id) ? parent_id+'' : 0;
                        var data = {
                            id: id,
                            parent_id: parent_id
                        };                        
                        ajaxGet("api/taskgroups/" + id + "/edit?", data, ''); 
                        return true;
                });  
                tasksGroupsTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=tasksGroupsTree.getAllChecked();
                        grupy[grupy.length]=id;                      
                        tasksGrid.clearAll();
                        tasksGrid.fill(grupy);                          
                        return true;                        
                    }
                });
                tasksGroupsTree.attachEvent("onCheck",function(id){
                        var grupy=tasksGroupsTree.getAllChecked(); 
                        tasksGrid.clearAll();
                        tasksGrid.fill(grupy);                        
                        return true;
                });   
                tasksGroupsTree.fill = function(){	
                    ajaxGet("api/taskgroups/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            tasksGroupsTree.clearAll();                            
                            tasksGroupsTree.loadStruct(data.data);                           
                        }                    
                    });
                };
                tasksGroupsTree.fill();                
/**
 * B
 * 
 */                
                var tasksGridToolBar;
                userCanWrite ? tasksGridToolBar = tasksGroupsLayout.cells("b").attachToolbar(standartToolbar):                 
                        tasksGridToolBar = tasksGroupsLayout.cells("b").attachToolbar(emptyToolbar);                
                tasksGridToolBar.attachEvent("onClick", function(name) {                 
                    switch (name){
                        case 'Add': { 
                            var windowForm = createWindow(_("Zadanie"), 300, 300);
                            var form = createForm(taskFormStruct, windowForm);
                            var groupsCombo = form.getCombo("task_group_id");
                            ajaxGet("api/taskgroups", "", function(data){                                                            
                                if (data.success && data.data) {
                                    groupsCombo.addOption(data.data);
                                }
                            });                                  
                            form.attachEvent("onButtonClick", function(name){
                                if (name === 'save'){                                    
                                    ajaxPost("api/tasks", form.getFormData(), function(data){                                                                                                        
                                        if (data && data.success) {                                            
                                            tasksGrid.addRow(data.data.id, '');
                                            tasksGrid.setRowData(data.data.id, data.data);
                                            dpTasksGrid.setUpdated(data.data.id);
                                        }                                           
                                    });                                    
                                }
                            });                                
                        };break;
                        case 'Edit': {                                  
                            var taskId   = tasksGrid.getSelectedRowId();
                            if (taskId) {
                                var windowForm = createWindow(_("Zadanie"), 300, 300);
                                var form = createForm(taskFormStruct, windowForm);
                                var groupsCombo = form.getCombo("task_group_id");
                                ajaxGet("api/taskgroups", "", function(data){                                                            
                                    if (data.success && data.data) {
                                        groupsCombo.addOption(data.data);
                                    }
                                });                               
                                var taskData = tasksGrid.getRowData(taskId);                                                          
                                form.setFormData(taskData);                                
                                form.attachEvent("onButtonClick", function(name){
                                    if (name === 'save') {                                         
                                        ajaxGet("api/tasks/" + taskId + "/edit", form.getFormData(), function(data){                                                                                                        
                                            if (data && data.success) {
                                                tasksGrid.setRowData(data.data.id, data.data);  
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Zapisane!")
                                                });  
                                                windowForm.close();
                                            }                                           
                                        });                                    
                                    }
                                }); 
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz zadanie!")
                                });
                            }
                        };break;
                        case 'Del': {
                            var id = tasksGrid.getSelectedRowId();
                            if (id) {
                            dhtmlx.confirm({
                            title:_("Ostrożność"),                                    
                            text:_("Czy na pewno chcesz usunąć?"),
                            callback: function(result){
                                        if (result) {
                                            ajaxDelete("api/tasks/" + id, "", function(data){
                                                if (data && data.success){
                                                    tasksGrid.deleteRow(id);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Wiadomość"),
                                                        text:_("Błąd! Nie udało się usunąć!")
                                                    });                                            
                                                }
                                            });                                            
                                        }
                                    }
                                });                                    
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Wybierz zadanie!")
                                });                                
                            }                               
                        };break;
                        case 'Redo': {
                            tasksGroupsTree.fill();
                            tasksGrid.fill(0);     
                        };break;
                    }
                }); 
                var tasksGrid = tasksGroupsLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {label: _("Kod"),   id: "kod",             width: 100, type: "ed", sort: "str", align: "left"},
                        {label: _("Name"),  id: "name",            width: 200, type: "ed", sort: "str", align: "left"},
                        {label: _("Grupa"), id: "task_group_name", width: 150, type: "ro",            align: "left"},
                        {label: _("Potrzebuje zamówienia"), id: "for_order",       width: 50,  type: "ch",align: "left"},
                        {id: "task_group_id"}                        
                    ]
                });   
                tasksGrid.setColumnHidden(4,true);
                tasksGrid.attachHeader(",,#select_filter");  
		var dpTasksGrid = new dataProcessor("api/tasks", "js");                
                dpTasksGrid.init(tasksGrid);
                dpTasksGrid.enableDataNames(true);
                dpTasksGrid.setTransactionMode("REST");                
                dpTasksGrid.enableDebug(true);
                dpTasksGrid.setUpdateMode("row", true);
                dpTasksGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;                      
                    ajaxGet("api/tasks/" + id + "/edit", data, function(data){ 
                        if (data.success) {
                            dpTasksGrid.setUpdated(id);
                        }
                        //console.log(data);
                    });
                }); 
                tasksGrid.fill = function(i = 0) {
                    this.clearAll();
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    ajaxGet("api/tasks/listbygroups/" + ids, "", function(data){
                        if (data && data.success){                    
                            tasksGrid.parse(data.data, "js");
                        }
                    });	                    
                };
                tasksGrid.fill(0);
/**
 * Products-tasks
 * 
 */
/**
 * A
 * 
 */
                var productsGroupsTree = productsTasksLayout.cells("a").attachTreeView(treeStruct);                                 
                productsGroupsTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {                                                
                        productsGrid.zaladuj(productsGroupsTree.getSelectedId());
                        zadaniaGroupGrid.fill(productsGroupsTree.getSelectedId());
                    }
                });    
                productsGroupsTree.fill = function(i=null){	
                    ajaxGet("api/prodgroups/grupytree/" + localStorage.language, '', function(data) {                    
                        if (data && data.success){      
                            productsGroupsTree.clearAll();                            
                            productsGroupsTree.loadStruct(data.data);                           
                        }                    
                    });
                };
                productsGroupsTree.fill();
/**
 * B
 * 
 */				
	        var zadaniaGroupToolBar;        
                userCanWrite ? zadaniaGroupToolBar = productsTasksLayout.cells("b").attachToolbar(standartToolbar):   
                        zadaniaGroupToolBar = productsTasksLayout.cells("b").attachToolbar(emptyToolbar);                                      
                zadaniaGroupToolBar.attachEvent("onClick", function(name) {
                    var groupId = productsGroupsTree.getSelectedId();
                    if (groupId) {
                        switch(name) {                
                            case "Add": {                                    
                                var formStruct = [
                                        {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                                        {type: "combo", name: "task_id",  required: true, label: _("Zadanie"), options: []},		
                                        {type: "input", name: "duration", required: true, label: _("Czas na wykonanie, min: ")}, 
                                        {type: "checkbox", name: "required", label: _("Obowiązkowe: ")},                                                                    
                                        {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                            {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                            {type: "newcolumn"},
                                            {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                                        ]}              
                                    ];                                                                
                                var addTaskToGroupWindow = createWindow(_("Zadanie"), 300, 300);
                                var addTaskToGroupForm = createForm(formStruct, addTaskToGroupWindow);
                                var tasksCombo = addTaskToGroupForm.getCombo("task_id");
                                ajaxGet("api/tasks", "", function(data){
                                    if (data && data.success) {
                                        tasksCombo.addOption(data.data);
                                    }
                                });
                                addTaskToGroupForm.attachEvent("onButtonClick", function(name){
                                    if (name == "save") {
                                        var data = this.getFormData();
                                        data.product_group_id = groupId;
                                        zadaniaGroupGrid.add("api/prodgroups/"+groupId+"/tasks" , data); 
                                        addTaskToGroupForm.clear();
                                    }
                                });                            							
                            };break;                        
                            case "Edit": {
                                var taskId = zadaniaGroupGrid.getSelectedRowId();
                                if (taskId) {
                                    var formStruct = [
                                        {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},                                    
                                        {type: "input", name: "duration", required: true, label: _("Czas na wykonanie, min: ")},                                                                    
                                        {type: "checkbox", name: "required", label: _("Obowiązkowe: ")},                                                                    
                                        {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                            {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                            {type: "newcolumn"},
                                            {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                                        ]}              
                                    ];                                                                
                                    var addTaskToGroupWindow = createWindow(_("Zadanie"), 300, 300);
                                    var addTaskToGroupForm = createForm(formStruct, addTaskToGroupWindow);                                
                                    var taskData = zadaniaGroupGrid.getRowData(taskId);
                                    addTaskToGroupForm.setFormData(taskData);
                                    addTaskToGroupForm.attachEvent("onButtonClick", function(name){
                                        if (name == "save") {
                                            var data = this.getFormData();
                                            data.product_group_id = groupId;
                                            zadaniaGroupGrid.edit("api/prodgroups/"+groupId+"/tasks/"+taskId+"/edit" , data); 
                                            addTaskToGroupWindow.close();
                                        }
                                    });   
                                } else {
                                    dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz zadanie!")
                                    });
                                }
                            };break;                
                            case "Del": {                                      
                                var taskId = zadaniaGroupGrid.getSelectedRowId();
                                if (taskId) { 
                                    zadaniaGroupGrid.delete("api/prodgroups/"+groupId+"/tasks/"+taskId+"", taskId);				
                                } else {
                                    dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz zadanie!")
                                    });
                                }
                            };break;
                            case "Redo": {                                
                                zadaniaGroupGrid.fill(groupId);
                            };break;            
                        }
                    } else {
                        dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz grupę!")
                        });
                    }
                });  
                var zadaniaGroupGrid = productsTasksLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [                        
                        {label: _("Kod"),       id: "kod",      type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Zadanie"),   id: "name",     type: "ro", width: 150, sort: "str", align: "left"},
                        {label: _("Czas, min"), id: "duration", type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Kolejnosc"), id: "priority", type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Obowiązkowe"), id: "required", type: "ch", width: 30,  sort: "str", align: "left"},
                        {id: "product_group_id"},
                        {id: "task_id"}
                    ]
                });        
                zadaniaGroupGrid.setColumnHidden(5,true);
                zadaniaGroupGrid.setColumnHidden(6,true);
                zadaniaGroupGrid.attachHeader("#select_filter,#select_filter");		                
                zadaniaGroupGrid.enableDragAndDrop(true);                
                zadaniaGroupGrid.fill = function(id = 0){	
                    this.clearAll();					
                    ajaxGet("api/prodgroups/" + id + "/tasks", '', function(data){                                     
                        if (data && data.success){
                            zadaniaGroupGrid.parse((data.data), "js");
                        }
                    });                        
                };                  
                zadaniaGroupGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
                    var thisGrid = zadaniaGroupGrid;
                    var source = thisGrid.getRowData(sId);
                    var target = thisGrid.getRowData(tId);
                    var sourcePriority = source.priority;
                    var targetPriority = target.priority;

                    if (source.product_group_id === target.product_group_id) {
                        source.priority = targetPriority;
                        target.priority = sourcePriority;
                        thisGrid.edit("api/prodgroups/" + source.product_group_id +"/tasks/" + 
                                                    source.task_id + "/edit", source);  
                        thisGrid.edit("api/prodgroups/" + target.product_group_id +"/tasks/" + 
                                                    target.task_id + "/edit", target); 
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Nie można zmienić kolejność mędzy zadaniami róźnych grup")
                        });
                    }                                                
                });  
/**
 * C
 * 
 */
                var productsGrid = productsTasksLayout.cells("c").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [                        
                        {label: _("Kod"),           id: "kod",                
                            type: "ro", sort: "str", align: "left"},
                        {label: _("Imie produktu"), id: "name",               
                            type: "ro", sort: "str", align: "left"},
                        {label: _("Typ produktu"),  id: "product_type_name",  
                            type: "ro", sort: "str", align: "left"},
                        {label: _("Grupa produktu"),id: "product_group_name", 
                            type: "ro", sort: "str", align: "left"},
                        {id: "product_group_id"}                        
                    ]                        
                });                
                productsGrid.attachHeader("#text_filter,#text_filter,#select_filter,#select_filter");	
                productsGrid.setRegFilter(productsGrid, 0);
                productsGrid.setRegFilter(productsGrid, 1);   
                productsGrid.setColumnHidden(4,true);
                productsGrid.attachEvent("onRowSelect", function(id, ind) {            
                    zadaniaProductGrid.fill(id);     
                });  
                productsGrid.zaladuj = (i = 0) => {	              
                    productsGrid.fill("api/prodgroups/"+i+"/products/" + 
                            localStorage.language, null);
                };                   
/**
 * D
 * 
 */				
  	        var zadaniaProductToolBar;        
                if (userCanWrite) {
                    zadaniaProductToolBar = productsTasksLayout.cells("d").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},                                    
                                    {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                    {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},                                    
                                    {type: "separator", id: "sep3"},
                                    {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
                            ]                    
                    });   
                } else {
                    zadaniaProductToolBar = productsTasksLayout.cells("d").attachToolbar(emptyToolbar);                      
                }
                zadaniaProductToolBar.attachEvent("onClick", function(name) {
                    var productId = productsGrid.getSelectedRowId();
                    if (productId) {
                        switch(name) {                
                            case "Add": { 
                                var formStruct = [
                                        {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                                        {type: "combo", name: "task_id",  required: true, label: _("Zadanie"), options: []},		
                                        {type: "input", name: "duration", required: true, label: _("Czas na wykonanie, min: ")}, 
                                        {type: "checkbox", name: "required", label: _("Obowiązkowe: ")},                                                                    
                                        {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                            {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                            {type: "newcolumn"},
                                            {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                                        ]}              
                                    ];                                                                
                                var addTaskToProductWindow = createWindow(_("Zadanie"), 300, 300);
                                var addTaskToProductForm = createForm(formStruct, addTaskToProductWindow);
                                var tasksCombo = addTaskToProductForm.getCombo("task_id");
                                ajaxGet("api/products/"+productId+"/freetasks/" + localStorage.language, "", function(data){
                                    if (data && data.success) {
                                        tasksCombo.addOption(data.data);
                                    }
                                });
                                addTaskToProductForm.attachEvent("onButtonClick", function(name){
                                    if (name == "save") {
                                        var data = this.getFormData();
                                        data.product_id = productId;
                                        zadaniaProductGrid.add("api/products/"+productId+"/tasks" , data); 
                                        addTaskToProductForm.clear();
                                    }
                                });                            							
                            };break;                        
                            case "Edit": {
                                var taskId = zadaniaProductGrid.getSelectedRowId();
                                if (taskId) {
                                    if (!zadaniaProductGrid.getRowData(taskId).for_group) {
                                        var formStruct = [
                                            {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},                                    
                                            {type: "input", name: "duration", required: true, label: _("Czas na wykonanie, min: ")},  
                                            {type: "checkbox", name: "required", label: _("Obowiązkowe: ")},                                                                    
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type: "button", name: "save", value: "Zapisz", offsetTop:18},                                        
                                                {type: "newcolumn"},
                                                {type:"button",  name: "cancel", value: "Anuluj", offsetTop:18}
                                            ]}              
                                        ];                                                                
                                        var addTaskToProductWindow = createWindow(_("Zadanie"), 300, 300);
                                        var addTaskToProductForm = createForm(formStruct, addTaskToProductWindow);                                
                                        var taskData = zadaniaProductGrid.getRowData(taskId);
                                        addTaskToProductForm.setFormData(taskData);
                                        addTaskToProductForm.attachEvent("onButtonClick", function(name){
                                            if (name == "save") {
                                                var data = this.getFormData();
                                                data.product_id = productId;
                                                zadaniaProductGrid.edit("api/products/"+productId+"/tasks/"+taskId+"/edit" , data); 
                                                addTaskToProductWindow.close();
                                            }
                                        }); 
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Te zadanie, należy do grupy!")
                                        });
                                    }
                                } else {
                                    dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz zadanie!")
                                    });
                                }
                            };break;                
                            case "Del": {                                      
                                var taskId = zadaniaProductGrid.getSelectedRowId();
                                if (taskId) { 
                                    if (!zadaniaProductGrid.getRowData(taskId).for_group) {
                                        zadaniaProductGrid.delete("api/products/"+productId+"/tasks/"+taskId, taskId);				
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Te zadanie, należy do grupy!")
                                        });
                                    }
                                } else {
                                    dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz zadanie!")
                                    });
                                }
                            };break;
                            case "Redo": {                                
                                zadaniaProductGrid.fill(productId);
                            };break;            
                        }
                    } else {
                        dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Wybierz produkt!")
                        });
                    }
                });  
                var zadaniaProductGrid = productsTasksLayout.cells("d").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [                        
                        {label: _("Kod"),       id: "kod",      type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Zadanie"),   id: "name",     type: "ro", width: 150, sort: "str", align: "left"},
                        {label: _("Czas, min"), id: "duration", type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Kolejnosc"), id: "priority", type: "ro", width: 50,  sort: "str", align: "left"},
                        {label: _("Obowiązkowe"), id: "required", type: "ch", width: 30,  sort: "str", align: "left"},
                        {id: "product_id"},
                        {id: "task_id"}, 
                        {id: "for_group"}
                    ]

                });        
                zadaniaProductGrid.setColumnHidden(5,true);
                zadaniaProductGrid.setColumnHidden(6,true);
                zadaniaProductGrid.setColumnHidden(7,true);
                zadaniaProductGrid.attachHeader("#select_filter,#select_filter");		                
                zadaniaProductGrid.enableDragAndDrop(true); 
                zadaniaProductGrid.attachEvent("onRowCreated", function(rId,rObj,rXml){
                    var data = zadaniaProductGrid.getRowData(rId);
                    if (data.for_group) {
                        zadaniaProductGrid.setRowColor(rId,"lightgrey");
                    }
                });                  
                zadaniaProductGrid.fill = function(id = 0){	
                    this.clearAll();					
                    ajaxGet("api/products/"+id+"/tasks", '', function(data){                                     
                        if (data && data.success){
                            zadaniaProductGrid.parse((data.data), "js");
                        }
                    });                        
                };  
                
                zadaniaProductGrid.attachEvent("onDrop", function(sId,tId,dId,sObj,tObj,sCol,tCol){
                    var thisGrid = zadaniaProductGrid;
                    var source = thisGrid.getRowData(sId);
                    var target = thisGrid.getRowData(tId);
                    var sourcePriority = source.priority;
                    var targetPriority = target.priority;

                    if (!source.for_group && !target.for_group) {
                        source.priority = targetPriority;
                        target.priority = sourcePriority;
                        thisGrid.edit("api/products/" + source.product_id +"/tasks/" + 
                                                    source.task_id + "/edit", source);  
                        thisGrid.edit("api/products/" + target.product_id +"/tasks/" + 
                                                    target.task_id + "/edit", target); 
                    } else {
                        dhtmlx.alert({
                            title:_("Wiadomość"),
                            text:_("Nie można zmienić kolejność mędzy zadaniami róźnych produktu i grupy")
                        });
                    }              
                });  
    }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
    if (id == "products_tasks") {
        window.history.pushState({'page_id': id}, null, '#products_tasks');
        productsTasksInit(cell);      
    }       
});