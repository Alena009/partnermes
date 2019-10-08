var settingsDataView;
var settingsLayout;
var settingsForm;

function settingsInit(cell) {
	
	if (settingsLayout == null) {
		
            // init layout
            var settingsLayout = cell.attachLayout("1C");                
                settingsLayout.cells("a").hideHeader();

            var mainTabbar = settingsLayout.cells("a").attachTabbar();
                mainTabbar.addTab("a1", _("Role"), null, null, true);               
                mainTabbar.addTab("a2", _("Grupy zadań, zadania"));
                mainTabbar.addTab("a3", _("Grupy produktów"));                                
                mainTabbar.addTab("a4", _("Typy produktów"));
                mainTabbar.addTab("a5", _("Grupy pracowników"));
                //Tabs
                var rolesLayout = mainTabbar.tabs("a1").attachLayout("3W");
                    rolesLayout.cells("a").hideHeader();
                    rolesLayout.cells("a").setCollapsedText(_("Role"));
                    rolesLayout.cells("b").hideHeader(); 
                    rolesLayout.cells("b").setCollapsedText(_("Użytkownik"));
                    rolesLayout.cells("c").hideHeader(); 
                    rolesLayout.cells("c").setCollapsedText("Uprawnienia");
                    rolesLayout.setAutoSize("a", "a;b;c");               

                var tasksGroupsLayout = mainTabbar.tabs("a2").attachLayout("2U"); 
                    tasksGroupsLayout.cells("a").hideHeader(); 
                    tasksGroupsLayout.cells("a").setCollapsedText(_("Grupy zadań"));
                    tasksGroupsLayout.cells("b").hideHeader();
                    tasksGroupsLayout.cells("b").setCollapsedText(_("Zadania"));
                    tasksGroupsLayout.cells("a").setWidth(280);
                    tasksGroupsLayout.setAutoSize("a", "a;b");                

                var productsGroupsLayout = mainTabbar.tabs("a3").attachLayout("2U"); 
                    productsGroupsLayout.cells("a").hideHeader(); 
                    productsGroupsLayout.cells("a").setCollapsedText(_("Grupy produktów"));
                    productsGroupsLayout.cells("b").hideHeader();
                    productsGroupsLayout.cells("b").setCollapsedText(_("Produkty"));
                    productsGroupsLayout.cells("a").setWidth(280);
                    productsGroupsLayout.setAutoSize("a", "a;b"); 

                var typesProductsLayout = mainTabbar.tabs("a4").attachLayout("1C");
                    typesProductsLayout.cells("a").hideHeader();

                var workersGroupsLayout = mainTabbar.tabs("a5").attachLayout("1C");
                    workersGroupsLayout.cells("a").hideHeader();
                
                /**
                 * 
                 * Roles tab
                 * 
                 */
                var rolesToolBar = rolesLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Role")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Hide", type: "button", img: "fa fa-arrow-left"} 
                        ]
                });
                rolesToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{
                            var windowForm = createWindow(_("Role"), 300, 300);
                            var form = createForm(roleForm, windowForm);
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        ajaxPost("api/roles", form.getFormData(), function(data){ 
                                            if (data.success) {
                                                ajaxPost("api/rolespermissions/fillRole/" + data.data.id, '', '');                                                   
                                                rolesTree.addItem(data.data.id, data.data.name);
                                                windowForm.close();                                                                                                                                                            
                                            } else {
                                                dhtmlx.message({
                                                    title:_("Wiadomość"),
                                                    type:"alert",
                                                    text:_("Błąd dodawania rekordu do bazy danych!")
                                                });
                                            }
                                        });
                                    };break;
                                }
                            });
                        };break;
                        case 'Edit':{                            
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var windowForm = createWindow(_("Role"), 300, 300);
                                var form = createForm(roleForm, windowForm);
                                var data = {
                                    id: roleId,
                                    name: rolesTree.getItemText(roleId)
                                };
                                form.setFormData(data); 
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                           
                                            ajaxGet("api/roles/" + roleId + "/edit", form.getFormData(), function(data){                                                            
                                                if (data.success) {                                                 
                                                    rolesTree.setItemText(roleId, data.data.name);
                                                    windowForm.close();
                                                } 
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.setFormData(data); 
                                        };break;
                                    }
                                });                                
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, którą chcesz edytować!")
                                });
                            }
                        };break;  
                        case 'Del':{
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                dhtmlx.confirm({
                                    title:_("Ostrożność"),                                    
                                    text:_("Czy na pewno chcesz usunąć rolę?"),
                                    callback: function(result){
                                        if (result) {
                                            ajaxDelete("api/roles/" + roleId,'', function(data) {
                                                if (data.success) {
                                                    rolesTree.deleteItem(roleId);
                                                    usersGrid.fill(0);
                                                    permissionsGrid.fill(0);
                                                } else {
                                                    dhtmlx.alert({
                                                        title:_("Błąd!"),
                                                        type:"alert-error",
                                                        text:data.message
                                                    });
                                                }
                                            });                                              
                                        }
                                    }
                                });   
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, którą chcesz usunąć!")
                                });
                            }

                        };break;  
                        case 'Hide':{
                            rolesLayout.cells("a").collapse();                        
                        };break; 
                    };
                }); 
                var roleForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",   label:_("Nazwa"), offsetTop:13, labelWidth:80}, 
                            {type: "block", blockOffset: 0, position: "laabel-left", list: [
                                {type:"button", name:"save",   value:_("Zapisz"),     offsetTop:18},
                                {type: "newcolumn"},
                                {type:"button", name:"cancel", value:_("Anuluj"),     offsetTop:18}
                            ]}
                    ]}
                ]; 
                var usersToolBar = rolesLayout.cells("b").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Uzytkowniki")},
                                {type: "spacer"},                                
                                {type: "text", id: "find", text: _("Find:")},
                                {type: "buttonInput", id: "szukaj", text: "Szukaj", width: 100},
                                {type: "separator", id: "sep2"},
                                {id: "Cog", type: "button", img: "fa fa-spin fa-cog "},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-refresh"},
                                {type: "separator", id: "sep4"},
                                {id: "Hide", type: "button", img: "fa fa-arrow-left"} 
                        ]
                });
                usersToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Cog':{                                
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var dhxWins = new dhtmlXWindows();
                                w1 = dhxWins.createWindow({
                                        id:"w1",
                                        left:20,
                                        top:30,
                                        width: 500,
                                        height: 500,
                                        center:true,
                                        caption: _("Dolanczyc pracownikow do roli"),
                                        header: true,                                        
                                        onClose:function(){

                                        }
                                });                               
                                var addUsersGrid = dhxWins.window("w1").attachGrid({
                                    image_path:'codebase/imgs/',
                                    columns: [
                                        {
                                            label: _("Dolaczone"),
                                            width: 60,
                                            id: "in_departament",
                                            type: "ch",                                             
                                            align: "left"
                                        },                                                                                
                                        {
                                            label: _("Nazwisko"),
                                            width: 100,
                                            id: "lastname",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Imię"),
                                            id: "firstname",
                                            width: 100, 
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        },
                                        {
                                            label: _("Role"),
                                            width: 100,
                                            id: "role_name",
                                            type: "ed", 
                                            sort: "str", 
                                            align: "left"
                                        }                       
                                    ]                                       
                                }); 
                                addUsersGrid.attachEvent("onCheck", function(rId,cInd,state){
                                    var data = {
                                            role_id: roleId,
                                            user_id: rId
                                        };
                                    if (state) {                                                                            
                                        ajaxPost("api/usersroles", data, '');
                                    } else {
                                        ajaxGet("api/usersroles/del", data, '');
                                    }
                                    usersGrid.fill(roleId);                                   
                                });
                                ajaxGet("api/roles/0/users", '', function(data){                                     
                                    if (data && data.success){ 
                                        //remember array of all workers
                                        var allUsers = data.data;
                                        //asking array of workers for choosen departament
                                        ajaxGet("api/roles/" + roleId + "/users", '', function(data2){
                                            //remember array of workers in departament
                                            var departamentUsers = data2.data;
                                            //for every worker from all workers array we are checking:
                                            //does this worker is in choosen departament, if he is - then we
                                            //do marking "in_departament" for him
                                            allUsers.forEach(function(element){
                                                if (departamentUsers.find(x => x.id === element.id)) {
                                                    element.in_departament = true;
                                                }
                                            }); 
                                            addUsersGrid.parse((allUsers), "js");
                                        });
                                    }
                                });                                
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    type:"alert",
                                    text:_("Wybierz rolę, do której chcesz dodać użytkowników")
                                });
                            }                           
                        };break;
                        case 'Redo':{
                                var roleId = rolesTree.getSelectedId();
                                rolesTree.unselectItem(roleId);
                                usersGrid.fill(0);
                                permissionsGrid.fill(0);
                        };break; 
                        case 'Hide': {
                            rolesLayout.cells("b").collapse();   
                        };break;
                    }
                });
                var permissionsToolBar = rolesLayout.cells("c").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Uprawnienia")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-refresh"},
                                {type: "separator", id: "sep4"},
                                {id: "Hide", type: "button", img: "fa fa-arrow-right"} 
                        ]
                });
                permissionsToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{
                                var windowForm = createWindow(_("Permission"), 300, 300);
                                var form = createForm(permissionForm, windowForm);
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{                                                           
                                            ajaxPost("api/permissions", form.getFormData(), function(data){                                                                                                        
                                                ajaxPost("api/rolespermissions/addToRoles/" + data.data.id, '', function(data) {
                                                    if (data.success) {
                                                        permissionsGrid.fill(0);
                                                    } 
                                                });                                            
                                            });
                                        };break;
                                        case 'cancel':{
                                            form.clear();    
                                        };break;
                                    }
                                });
                            };break;
                        case 'Edit':{                                
                                var permissionId = permissionsGrid.getSelectedRowId();                                
                                if (permissionId) {  
                                    var windowForm = createWindow(_("Permission"), 300, 300);
                                    var form = createForm(permissionForm, windowForm);
                                    var data = {
                                        id: permissionId,
                                        name: permissionsGrid.cells(permissionId, 0).getValue(),
                                        description: permissionsGrid.cells(permissionId, 2).getValue()
                                    };
                                    form.setFormData(data); 
                                    form.attachEvent("onButtonClick", function(name){
                                        switch (name){
                                            case 'save':{                                                           
                                                ajaxGet("api/permissions/" + permissionId + "/edit", form.getFormData(), function(data){ 
                                                    if (data.success) {                                                           
                                                        permissionsGrid.fill(0);
                                                    } 
                                                });
                                            };break;
                                            case 'cancel':{
                                                form.setFormData(data); 
                                            };break;
                                        }
                                    });                                
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Wybierz uprawnienie, które chcesz edytować!")
                                    });
                                }                               
                        };break;
                        case 'Del':{
                                var permissionId = permissionsGrid.getSelectedRowId();                                
                                if (permissionId) {
                                    dhtmlx.confirm({
                                        title:_("Ostrożność"),                                    
                                        text:_("Czy na pewno chcesz usunąć uprawnienie?"),
                                        callback: function(result){
                                            if (result) {
                                                ajaxDelete("api/permissions/" + permissionId, '', function(data) {
                                                    if (data.success) {
                                                        permissionsGrid.deleteSelectedRows();    
                                                    }
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Wybierz uprawnienie, które chcesz usunąć!")
                                    });
                                }
                        };break;
                        case 'Redo':{
                                var roleId = rolesTree.getSelectedId();
                                rolesTree.unselectItem(roleId);
                                usersGrid.fill(0);
                                permissionsGrid.fill(0);
                        };break;
                        case 'Hide': {
                            rolesLayout.cells("c").collapse();   
                        };break;
                    }
                });
                var permissionForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:100},                                                                				                            
                            {type:"input",  name:"description", label:_("Opis"), offsetTop:13, labelWidth:100},                                                                				                            
                            {type:"button", name:"save",        value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel",      value:_("Anuluj"),     offsetTop:18}
                    ]}
                ];
                var rolesTree = rolesLayout.cells("a").attachTreeView({
                    skin: "dhx_skyblue",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect
                        //checkboxes: true,           // boolean, optional, enables checkboxes
                        //dnd: true,           // boolean, optional, enables drag-and-drop
                        context_menu: true,  
                }); 
                rolesTree.load = function(){ 
                    ajaxGet("api/roles", '', function(data) {                    
                        if (data && data.success){                            
                            rolesTree.loadStruct(data.data);                           
                        }                    
                    });
                }; 
                rolesTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        usersGrid.clearAll();
                        permissionsGrid.clearAll();			
                        usersGrid.fill(id);
                        permissionsGrid.fill(id);			
                        console.log(id);
                        return true;                        
                    }
                });
                var usersGrid = rolesLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [                        
                        {
                            label: _("Nazwisko"),
                            width: 100,
                            id: "firstname",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Imie"),
                            width: 100,
                            id: "lastname",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Role"),
                            width: 100,
                            id: "role_name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        }                        
                    ],
                        multiselect: true
                });               
                usersGrid.fill = function(id) {
                    ajaxGet("api/roles/" + id + "/users", '', function(data){                                     
                        if (data && data.success){
                            usersGrid.clearAll();
                            usersGrid.parse((data.data), "js");
                        }
                    });
                };
                var searchElem = usersToolBar.getInput('szukaj');
                     usersGrid.makeFilter(searchElem, 0, true);
                     usersGrid.makeFilter(searchElem, 1, true);                                 
                     usersGrid.filterByAll();
                var permissionsGrid = rolesLayout.cells("c").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Uprawnienie"),
                            width: 100,
                            id: "name",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Value"),
                            id: "value",
                            width: 50, 
                            type: "ch"       
                        },
                        {
                            label: _("Opis"),
                            id: "description",
                            width: 200, 
                            type: "ed"       
                        }                        
                    ],
                        multiselect: true
                }); 
                permissionsGrid.fill = function(id) {
                    ajaxGet("api/roles/" + id + "/permissions", '', function(data){                                     
                        if (data && data.success){
                            permissionsGrid.clearAll();
                            permissionsGrid.parse((data.data), "js");
                        }
                    });
                };
                permissionsGrid.attachEvent("onCheck", function(rId,cInd,state){
                    var roleId = rolesTree.getSelectedId();
                    if (roleId) {
                        var data = {
                                role_id: roleId,
                                permission_id: rId, 
                                value: +state
                            };
                        ajaxGet("api/rolespermissions/edit", data, '');

                        permissionsGrid.fill(roleId);                          
                    }                                 
                });
                rolesTree.load();                                                           
                usersGrid.fill(0);                 
                permissionsGrid.fill(0);                             

                /**
                 * 
                 * Tasks groups tab
                 * 
                 */                
                var tasksGroupsToolBar = tasksGroupsLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Grupy zadan")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Hide", type: "button", img: "fa fa-arrow-left"} 
                        ]
                });
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
                            case 'Hide':{
                                tasksGroupsLayout.cells("a").collapse();                        
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
                tasksGroupsTree.fill = function(i=null){	
                    ajaxGet("api/taskgroups/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            tasksGroupsTree.clearAll();                            
                            tasksGroupsTree.loadStruct(data.data);                           
                        }                    
                    });
                };
                tasksGroupsTree.fill();
                tasksGroupsTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=productsGroupsTree.getAllChecked();
                        grupy[grupy.length]=id;                      
                        tasksGrid.clearAll();
                        tasksGrid.fill(grupy);                          
                        return true;                        
                    }
                });
                tasksGroupsTree.attachEvent("onCheck",function(id){
                        var grupy=productsGroupsTree.getAllChecked(); 
                        tasksGrid.clearAll();
                        tasksGrid.fill(grupy);                        
                        return true;
                });                 
                var tasksGridToolBar = tasksGroupsLayout.cells("b").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Zadania")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-refresh"},
                                {type: "separator", id: "sep4"},
                                {id: "Hide", type: "button", img: "fa fa-arrow-right"} 
                        ]
                });                               
                tasksGridToolBar.attachEvent("onClick", function(id) {
                    switch (id){
                        case 'Add': {
                            var windowForm = createWindow(_("Nowe zadanie"), 300, 300);
                            var form = createForm(taskFormStruct, windowForm);
                            var groupsCombo = form.getCombo("task_group_id");
                            ajaxGet("api/taskgroups", "", function(data){                                                                                                        
                                if (data && data.success) {
                                    groupsCombo.addOption(data.data);
                                }                                           
                            });                            
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{ 
                                        //var idSelectedGroup = tasksGroupsTree.getSelectedId();
                                        ajaxPost("api/tasks", form.getFormData(), function(data){                                                                                                        
                                            if (data && data.success) {
                                                tasksGrid.fill(data.data.task_group_id);
                                            }                                           
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });                                
                        };break;
                        case 'Edit': {  };break;
                        case 'Del': {
                            var id = tasksGrid.getSelectedRowId();
                            if (id) {
                                ajaxDelete("api/tasks/" + id, "", function(data){
                                    if (data && data.success){
                                        tasksGrid.deleteRow(id);
                                    }
                                });    
                            }                                
                        };break;
                        case 'Redo': {
                            tasksGroupsTree.fill();
                            tasksGrid.fill(0);     
                        };break;
                        case 'Hide':{
                                tasksGroupsLayout.cells("b").collapse();                        
                        };break;
                    }
                }); 
                var tasksGrid = tasksGroupsLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Kod"),
                            width: 100,
                            id: "kod",
                            type: "ed", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Name"),
                            id: "name",
                            width: 200,
                            type: "ed", 
                            sort: "str", 
                            align: "left"     
                        },
                        {
                            label: _("Potrzebuje zamowienia"),
                            id: "for_order",
                            width: 100,
                            type: "ch",                            
                            align: "center"     
                        },
                        {
                            label: _("Grupa"),
                            id: "task_group_name",
                            width: 150,
                            type: "coro",                            
                            align: "left"     
                        }                      
                    ],
                        multiselect: true
                });                
                tasksGrid.fill = function(i = 0) {
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    ajaxGet("api/tasks/listbygroups/" + ids, "", function(data){
                        if (data && data.success){                    
                            tasksGrid.parse(data.data, "js");
                        }
                    });	                    
                };
                tasksGrid.fill(0);
                var grupyCombo = tasksGrid.getCombo(3);
                ajaxGet("api/taskgroups", "", function(data){                                                            
                    if (data.success && data.data) {
                        data.data.forEach(function(group){
                            grupyCombo.put(group.id, group.name);
                        });
                    }
                });
                var dpTasksGrid = new dataProcessor("api/tasks", "js");                
                dpTasksGrid.init(tasksGrid);
                dpTasksGrid.enableDataNames(true);
                dpTasksGrid.setTransactionMode("REST");
                dpTasksGrid.enablePartialDataSend(true);
                dpTasksGrid.enableDebug(true);
                dpTasksGrid.setUpdateMode("row", true);
                dpTasksGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    data.task_group_id = data.task_group_name;
                    ajaxGet("api/tasks/" + id + "/edit", data, function(data){                                                            
                        console.log(data.data);
                    });
                }); 


                /**
                 * 
                 * Products by groups tab
                 * 
                 */                            
                var productsGroupsToolBar = productsGroupsLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Grupy")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"}
                        ]
                });
                productsGroupsToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{			                                        
                                    createAddEditGroupWindow("api/prodgroups", "api/prodgroups", productsGroupsTree, 0);
                            };break;
                            case 'Edit':{
                                var id = tasksGroupsTree.getSelectedId();
                                if (id) {                                        
                                    createAddEditGroupWindow("api/prodgroups", "api/prodgroups/" + id + "/edit", productsGroupsTree, id);
                                }
                            };break;
                            case 'Del':{
                                var id = tasksGroupsTree.getSelectedId();
                                if (id) {
                                    deleteNodeFromTree(productsGroupsTree, "api/prodgroups/" + id);
                                }
                            };break;
                    }
                });
                var productsGroupsTree = productsGroupsLayout.cells("a").attachTreeView({
                        skin: "dhx_web",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect
                        checkboxes: true,           // boolean, optional, enables checkboxes
                        dnd: true,           // boolean, optional, enables drag-and-drop
                        context_menu: true           // boolean, optional, enables context menu			
                });                 
                productsGroupsTree.attachEvent("onDrop",function(id){			
                        var parent_id = arguments[1];
                        parent_id = (parent_id) ? parent_id+'' : 0;
                        var data = {
                            id: id,
                            parent_id: parent_id
                        };                        
                        ajaxGet("api/prodgroups/" + id + "/edit?", data, ''); 
                        return true;
                });  
                productsGroupsTree.fill = function(i=null){	
                    ajaxGet("api/prodgroups/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            productsGroupsTree.clearAll();                            
                            productsGroupsTree.loadStruct(data.data);                           
                        }                    
                    });
                };
                productsGroupsTree.fill();  
                productsGroupsTree.attachEvent("onSelect",function(id, mode){  
                    if (mode) {
                        var grupy=productsGroupsTree.getAllChecked();
                        grupy[grupy.length]=id;                      
                        productsByGroupsGrid.clearAll();
                        productsByGroupsGrid.fill(grupy);                          
                        return true;                        
                    }
                });
                productsGroupsTree.attachEvent("onCheck",function(id){
                        var grupy=productsGroupsTree.getAllChecked(); 
                        productsByGroupsGrid.clearAll();
                        productsByGroupsGrid.fill(grupy);                        
                        return true;
                });                 

                var productsByGroupsGridToolBar = productsGroupsLayout.cells("b").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Produkty")},
                                {type: "spacer"},				
                                {id: "Redo", type: "button", img: "fa fa-refresh"}
                        ]
                });                               
                productsByGroupsGridToolBar.attachEvent("onClick", function(btn) {
                    if (btn = 'Redo') {
                        productsGroupsTree.fill();
                        productsByGroupsGrid.fill(0);                        
                    }
                });          
                var productsByGroupsGrid = productsGroupsLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Kod"),
                            width: 100,
                            id: "product_kod",
                            type: "ro", 
                            sort: "str", 
                            align: "left"
                        },
                        {
                            label: _("Name"),
                            id: "product_name",
                            width: 100,
                            type: "ro", 
                            sort: "str", 
                            align: "left"     
                        },
                        {
                            label: _("Grupa"),
                            id: "product_group_name",
                            width: 100,
                            type: "co",                            
                            align: "left"     
                        },  
                        {
                            label: _("Typ"),
                            id: "product_type_name",
                            width: 100,
                            type: "ro", 
                            sort: "str", 
                            align: "left"     
                        }                       
                    ],
                        multiselect: true
                });                              
                productsByGroupsGrid.fill = function(i = 0) {
                    var ids = Array();
                    ids = (typeof i === 'string' || typeof i === 'number')  ? [i] : i;
                    ajaxGet("api/products/listbygroups/" + ids, "", function(data){
                        if (data && data.success){                    
                            productsByGroupsGrid.parse(data.data, "js");
                        }
                    });	                    
                };               
                var groupsCombo = productsByGroupsGrid.getCombo(2);//takes the column index                
                ajaxGet("api/prodgroups", "", function(data) {  
                    if (data.success && data.data) {
                        data.data.forEach(function(group){
                            groupsCombo.put(group.id, group.name);
                        });
                    }                    
                });
                var dpProductsByGroupsGrid = new dataProcessor("api/products", "js");                
                dpProductsByGroupsGrid.init(productsByGroupsGrid);
                dpProductsByGroupsGrid.enableDataNames(true);
                dpProductsByGroupsGrid.setTransactionMode("REST");
                dpProductsByGroupsGrid.enablePartialDataSend(true);
                dpProductsByGroupsGrid.enableDebug(true);
                dpProductsByGroupsGrid.setUpdateMode("row", true);
                dpProductsByGroupsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    data.product_group_id = data.product_group_name;
                    ajaxGet("api/products/" + id + "/edit", data, function(data){                                                            
                        console.log(data);
                    });
                });  
                productsByGroupsGrid.fill(0);                                


                /**
                 * 
                 * Types of products tab
                 * 
                 */

                var typesProductsGridToolBar = typesProductsLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Typy produktow")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},				
                                {id: "Del", type: "button", img: "fa fa-minus-square"}
                        ]
                });
                typesProductsGridToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                var addingWindow = createWindow(_("Dodaj typ produktu"), 300, 300);
                                var addingForm = createForm([
                                    {type:"fieldset",  offsetTop:0, label:_("Nowy typ produktu"), width:250, list:[                                                                          
                                            {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                            {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                {type: "newcolumn"},
                                                {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                            ]}
                                    ]}                                    
                                ], addingWindow);
                                addingForm.attachEvent("onButtonClick", function(name){
                                    if (name == 'save') {
                                        ajaxPost("api/prodtypes", addingForm.getFormData(), function(data){
                                            if (data && data.success) {
                                                typesProductsGrid.addRow(data.data.id, [data.data.name, data.data.description]);   
                                            }
                                        });
                                    }
                                });                                
                            };break;
                            case 'Del':{
                                var id = typesProductsGrid.getSelectedRowId();
                                if (id) {
                                    ajaxDelete("api/prodtypes/" + id, "", function(data){
                                        if (data && data.success){
                                            typesProductsGrid.deleteRow(id);
                                        }
                                    });    
                                }
                            };break;
                    }
                });               
                var typesProductsGrid = typesProductsLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {
                            label: _("Imie"),
                            id: "name",
                            width: 100,
                            type: "ed", 
                            sort: "str", 
                            align: "left"     
                        },                                                
                        {
                            label: _("Opis"),
                            id: "description",
                            width: 300,
                            type: "txt", 
                            sort: "str", 
                            align: "left"     
                        }                          
                    ],
                    multiselect: true                    
                });
                typesProductsGrid.fill = function() {              
                    ajaxGet("api/prodtypes", "", function(data){
                        if (data && data.success){                    
                            typesProductsGrid.parse(data.data, "js");
                        }
                    });	                    
                };                  
                typesProductsGrid.fill();
                var dptypesProductsGrid = new dataProcessor("api/products", "js");                
                dptypesProductsGrid.init(typesProductsGrid);
                dptypesProductsGrid.enableDataNames(true);
                dptypesProductsGrid.setTransactionMode("REST");
                dptypesProductsGrid.enablePartialDataSend(true);
                dptypesProductsGrid.enableDebug(true);
                dptypesProductsGrid.setUpdateMode("row", true);
                dptypesProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/prodtypes/" + id + "/edit", data, function(data){                                                            
                        console.log(data);
                    });
                });                                 


                /**
                 * 
                 * Groups of workers tab 
                 * 
                 */
                var workersGroupsToolBar = workersGroupsLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {type: "text", id: "title", text: _("Grupy")},
                                {type: "spacer"},
                                {id: "Add", type: "button", img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", img: "fa fa-edit"},
                                {id: "Del", type: "button", img: "fa fa-minus-square"}
                        ]
                });
                workersGroupsToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{			                                        
                                    createAddEditGroupWindow("api/departaments", "api/departaments", workersGroupsTree, 0);
                            };break;
                            case 'Edit':{
                                var id = workersGroupsTree.getSelectedId();
                                if (id) {                                        
                                    createAddEditGroupWindow("api/departaments", "api/departaments/" + id + "/edit", workersGroupsTree, id);
                                }
                            };break;
                            case 'Del':{
                                var id = workersGroupsTree.getSelectedId();
                                if (id) {
                                    deleteNodeFromTree(workersGroupsTree, "api/departaments/" + id);
                                }
                            };break;
                    }
                });
                var workersGroupsTree = workersGroupsLayout.cells("a").attachTreeView({
                        skin: "dhx_web",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect
                        checkboxes: true,           // boolean, optional, enables checkboxes
                        dnd: true,           // boolean, optional, enables drag-and-drop
                        context_menu: true           // boolean, optional, enables context menu			
                });                 
                workersGroupsTree.attachEvent("onDrop",function(id){			
                        var parent_id = arguments[1];
                        parent_id = (parent_id) ? parent_id+'' : 0;
                        var data = {
                            id: id,
                            parent_id: parent_id
                        };                        
                        ajaxGet("api/departaments/" + id + "/edit?", data, ''); 
                        return true;
                });  
                workersGroupsTree.fill = function(i=null){	
                    ajaxGet("api/departaments/grupytree", '', function(data) {                    
                        if (data && data.success){      
                            workersGroupsTree.clearAll();                            
                            workersGroupsTree.loadStruct(data.data);                           
                        }                    
                    });
                };
                workersGroupsTree.fill();                                		
	}
	
}

var groupFormStruct = [
        {type:"fieldset",  offsetTop:0, label:_("Nowa grupa"), width:253, list:[                                
                {type:"combo",  name:"parent_id",       label:_("Grupa nadrzędna"),        options: [{text: "None", value: "0"}], inputWidth: 150},                                
                {type:"input",  name:"name",    	label:_("Imie grupy"),     	offsetTop:13, 	labelWidth:80},                                                                				
                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                    {type: "newcolumn"},
                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                ]}
        ]}
];

var taskFormStruct = [
        {type:"fieldset",  offsetTop:0, label:_("Nowe zlecenie"), width:253, list:[  
                {type:"combo",  name: "task_group_id", label:_("Grupa"), options: [], inputWidth: 150},                                                
                {type: "combo", label: "Potrzebuje zamowienia", name: "for_order", options:[
                    {text: "Tak", value: "1", selected: true},
                    {text: "Nie", value: "0"}]},
                {type:"input",  name:"kod",          label:_("Kod"),         offsetTop:13, labelWidth:80},                                                                				
                {type:"input",  name:"name",         label:_("Imie"),        offsetTop:13, labelWidth:80},                 
                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                    {type: "newcolumn"},
                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                ]}
        ]}
];

function createAddEditGroupWindow(urlForParentCombo, urlForSaveButton, treeObj, id = 0) {
    var grupyWindow = createWindow(_("Dodaj lub zmien grupe"), 300, 350);
    var grupyForm = createForm(groupFormStruct, grupyWindow);
    //if we editing some group, we removing parent_grop combo, because 
    //we can drag groups and change parent group by that way
    if (id) {
        grupyForm.removeItem("parent_id");
        grupyForm.setItemValue("name", treeObj.getItemText(id));
    } else {
        var dhxCombo = grupyForm.getCombo("parent_id");                             
        ajaxGet(urlForParentCombo, '', function(data) {                    
                dhxCombo.addOption(data.data);
        });  
    }
    grupyForm.attachEvent("onButtonClick", function(name){
        switch (name){
            case 'save':{
                if (id) {                    
                    ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){  
                        if (data && data.success) {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zapisane")
                            });                
                            grupyWindow.hide();
                            treeObj.setItemText(id, data.data.name);
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Błąd! Zmiany nie zostały zapisane")
                            });  
                        }
                    });
                } else {                   
                    ajaxPost(urlForSaveButton, grupyForm.getFormData(), function(data){                                                            
                        treeObj.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                        if (data.data.parent_id) {
                            treeObj.openItem(data.data.parent_id);
                        }
                        treeObj.selectItem(data.data.id);
                    });                
                }
            };break;         
            case 'cancel':{
                grupyForm.clear();
            };break;
        }
    });
    
    return grupyForm;
}

function deleteNodeFromTree(treeObj, deleteUrl) {
    var id = treeObj.getSelectedId();
    if (id) {
        dhtmlx.confirm({
        title:_("Ostrożność"),                                    
        text:_("Czy na pewno chcesz usunąć grupe?"),
        callback: function(result){
                    if (result) {
                        ajaxDelete(deleteUrl, '', function(data) {
                            if (data.success) {
                                treeObj.deleteItem(id);                                                    
                            } else {
                                dhtmlx.alert({
                                    title:_("Błąd!"),
                                    type:"alert-error",
                                    text:data.message
                                });
                            }
                        }); 
                    }
                }
            });
    }  else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            type:"alert",
            text:_("Wybierz grupe, która chcesz usunąć!")
        });
    }  
}

function createWindow (caption, height, width) {
    var dhxWins = new dhtmlXWindows();
    w1 = dhxWins.createWindow({
            id:"w1",
            left:20,
            top:30,
            width: width,
            height: height,
            center:true,
            caption: _(caption),
            header: true,
            onClose:function(){
                this.unload();
            }            
    });
    
    return w1;
}

function createForm(formStruct, windowObj){
    var myForm = windowObj.attachForm(formStruct, true);
    myForm.enableLiveValidation(true);
//    myForm.attachEvent("onValidateError", function (name, value, result){
//        dhtmlx.message({
//            title: "Close",
//            type: "alert-warning",
//            text: "Required field " + name + " is empty!"            
//        });
//    });
    myForm.forEachItem(function(id){ 
        switch(myForm.getItemType(id)){
            case 'input':    {
                    var input = myForm.getInput(id); 
                    input.autocomplete = "off";                     
                };break;
            case 'calendar': {myForm.getInput(id).autocomplete = "off"; };break;
            case 'combo':    {
                var myCombo = myForm.getCombo(id);
                myCombo.enableAutocomplete();
                myCombo.attachEvent("onKeyPressed", function(keyCode){
                    if (keyCode != 40 && keyCode != 38) {    
                        var input = myCombo.getComboText().trim().toLowerCase().split(' ');
                        var mask = "";
                        for (var i = 0; i < input.length; i++) {
                            mask = mask + input[i] + "(.*)";                                                                                                                        
                        }                       
                        myCombo.filter(function(opt){
                            return opt.text.match(new RegExp("^"+mask.toLowerCase(),"ig"))!=null;
                        }, true);                       
                    }
                });
            }
        };           
    });
                    
    myForm.attachEvent("onChange", function (name, value, state){
        if (name.indexOf("price") !== -1) {
            //var re = /^\d[0-9,]+\d$/;
            var re = /^\d{1,8}([,\.])?\d{1,2}$/;
            if (!re.test(value)) {
                myForm.setItemValue(name, "");
            }            
        } else if (name.indexOf("amount") !== -1) {
            var re = /^\d+$/;
            console.log("ertertert");
            if (!re.test(value)) {
                myForm.setItemValue(name, "");
            }            
        }        
    });  
    
    var dateEndCombo   = myForm.getCombo("num_week");
    if (dateEndCombo) {
        var numCurrentWeek = new Date().getWeekNumber();
        for (var i = 1; i <= 53; i++) {
            dateEndCombo.addOption(i, _("tydzień ") + i);
        }
        dateEndCombo.attachEvent("onChange", function(value, text){
            if (value < numCurrentWeek) {
                myForm.addItem(null, {type: "label", name: "on_next_year", label: _("Na nastepny rok")}, null, 1);
            } else {
                myForm.removeItem("on_next_year");
            }
        });  
    }
    
    myForm.attachEvent("onButtonClick", function(name){
        switch (name){  
            case 'save':{
                myForm.validate();
            };break;            
            case 'cancel':{
                myForm.clear();
                
            };break;
        }
    });
    
    return myForm;         
}

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};               

//dhtmlXGridObject.prototype._in_header_stat_total_sum=function(tag,index,data){//'stat_rowcount'-counter name
//    var calc=function(){                       // function used for calculations
//        var total_sum = 0;
//        var data;
//        this.forEachRow(function(id){
//            data = this.getRowData(id);
//            total_sum += (data.price * data.amount); 
//        });
//        return total_sum;
//    };
//    this._stat_in_header(tag,calc,index,data); // default statistics handler processor
//}; 
                            
//function regExpFilter(input, colIdx, gridObj) {
//                                input = input.trim().toLowerCase().split(' ');
//                                return function(value, id){
//                                    //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
//                                        var val = gridObj.cells(id, colIdx).getValue(); // gets the value of the current                                                    
//                                        //making pattern string for regexp
//                                        var searchStr = '';
//                                        for (var i = 0; i < input.length; i++) {
//                                            searchStr = searchStr + input[i] + "(.*)";                                                                
//                                            //var searchStr = /^zz(.+)np(.+)/ig;
//                                        }
//                                        var regExp = new RegExp("^" + searchStr, "ig");                                                          
//                                        if (val.toLowerCase().match(regExp)){                                                             
//                                            return true;
//                                        }                                                    
//                                    //}
//                                    return false;
//                                };    
//}                            

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") {
            window.history.pushState({'page_id': id}, null, '#settings');
            settingsInit(cell);
        } 
});