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
                mainTabbar.addTab("a2", _("Grupy zadan, zadania"));
                mainTabbar.addTab("a3", _("Grupy produktow"));                                
                mainTabbar.addTab("a4", _("Typy produktow"));
                mainTabbar.addTab("a5", _("Grupy pracownikow"));
               // mainTabbar.addTab("a7", _("Jezyk"));
            //Tabs
            var rolesLayout = mainTabbar.tabs("a1").attachLayout("3W");
                rolesLayout.cells("a").hideHeader();
                rolesLayout.cells("b").hideHeader();                
                rolesLayout.cells("c").hideHeader();                                
                rolesLayout.setAutoSize("a", "a;b;c");               
            
            var tasksGroupsLayout = mainTabbar.tabs("a2").attachLayout("2U"); 
                tasksGroupsLayout.cells("a").hideHeader();                
                tasksGroupsLayout.cells("b").hideHeader();
                tasksGroupsLayout.cells("a").setWidth(280);
                tasksGroupsLayout.setAutoSize("a", "a;b");                
                
            var productsGroupsLayout = mainTabbar.tabs("a3").attachLayout("2U"); 
                productsGroupsLayout.cells("a").hideHeader(); 
                productsGroupsLayout.cells("b").hideHeader(); 
                
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
                                {id: "Del", type: "button", img: "fa fa-minus-square"}
                        ]
                });
                rolesToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{
                            var form = createWindowWithForm(roleForm, 300, 300);
                            form.attachEvent("onButtonClick", function(name){
                                switch (name){
                                    case 'save':{                                                           
                                        ajaxPost("api/roles", form.getFormData(), function(data){ 
                                            if (data.success) {
                                                ajaxPost("api/rolespermissions/fillRole/" + data.data.id, '', '');
                                                rolesTree.addItem(data.data.id, data.data.name); 
                                            }
                                        });
                                    };break;
                                    case 'cancel':{
                                        form.clear();    
                                    };break;
                                }
                            });
                        };break;
                        case 'Edit':{                            
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var form = createWindowWithForm(roleForm, 300, 300);
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
                    };
                }); 
                var roleForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",   label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				                            
                            {type:"button", name:"save",   value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel", value:_("Anuluj"),     offsetTop:18}
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
                                {id: "Cog", type: "button", img: "fa fa-cog "},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", img: "fa fa-reply"}
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
                                {id: "Redo", type: "button", img: "fa fa-reply"}
                        ]
                });
                permissionsToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{
                                var form = createWindowWithForm(permissionForm, 300, 300);
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
                                    var form = createWindowWithForm(permissionForm, 300, 300);
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
                                {id: "Del", type: "button", img: "fa fa-minus-square"}
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
                                {id: "Redo", type: "button", img: "fa fa-reply"}
                        ]
                });                               
                tasksGridToolBar.attachEvent("onClick", function(id) {
                    switch (id){
                        case 'Add': {
                            var form = createWindowWithForm(taskFormStruct, "Nowe zadanie", 300, 300);
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
                                {id: "Redo", type: "button", img: "fa fa-reply"}
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
                                var addingForm = createWindowWithForm([
                                    {type:"fieldset",  offsetTop:0, label:_("Nowy typ produktu"), width:250, list:[                                                                          
                                            {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                            {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                {type: "newcolumn"},
                                                {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                            ]}
                                    ]}                                    
                                ], _("Dodaj typ produktu"), 300, 300);
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
                                    
                
//                productTypesToolBar.attachEvent("onClick", function(id) { 
//                    switch (id){
//		        case 'Add':{
//                            var form = createWindowWithForm(permissionForm, 300, 300);
//                            form.attachEvent("onButtonClick", function(name){
//                                switch (name){
//                                    case 'save':{                                                           
//                                        ajaxPost("api/prodtypes", form.getFormData(), function(data){ 
//                                            if (data.success) {                                                
//                                                productTypeGrid.fill();
//                                            }
//                                        });
//                                    };break;
//                                    case 'cancel':{
//                                        form.clear();    
//                                    };break;
//                                }
//                            });
//                        };break;
//		        case 'Del':{
//                            var id = productTypeGrid.getSelectedRowId();;
//                            if (id) {
//                                dhtmlx.confirm({
//                                    title:_("Ostrożność"),                                    
//                                    text:_("Czy na pewno chcesz usunąć?"),
//                                    callback: function(result){
//                                        if (result) {
//                                            ajaxDelete("api/prodtypes/" + id,'', function(data) {
//                                                if (data.success) {
//                                                    productTypeGrid.deleteSelectedRows();                                            
//                                                } else {
//                                                    dhtmlx.alert({
//                                                        title:_("Błąd!"),
//                                                        type:"alert-error",
//                                                        text:data.message
//                                                    });
//                                                }
//                                            });                                              
//                                        }
//                                    }
//                                });   
//                            } else {
//                                dhtmlx.alert({
//                                    title:_("Wiadomość"),
//                                    type:"alert",
//                                    text:_("Wybierz co chcesz usunąć!")
//                                });
//                            }
//                             
//                        };break;                     
//                    };
//                });                
//                                
//                productGroupsToolBar.attachEvent("onClick", function(id) {
//                    switch (id) {
//                        case 'Add':{
//                                var id = productGroupTree.getSelectedItemId(),
//				parent = productGroupTree.getParentId(id) || 0;                                   
//                                
//				var form = createWindowWithForm(permissionForm, 300, 300);
//                                var data = {
//                                    'parent_id': parent                                    
//                                };
//                                form.attachEvent("onButtonClick", function(name){
//                                    switch (name){
//                                        case 'save':{ 
//                                            Object.assign(data, form.getFormData());
//                                            ajaxPost("api/prodgroups", data, function(data){ 
//                                                if (data.success) {                                                
//                                                    productGroupTree.insertNewItem(id || parent,data.data.id,data.data.name);
////					            productGroupTree.selectItem('_new');
////					            productGroupTree.editItem('_new');
//                                                }
//                                            });
//                                        };break;
//                                        case 'cancel':{
//                                            form.clear();    
//                                        };break;
//                                    }
//                                });		
//					
//                                                                
//                        };break;                        
//                        case 'Edit':{
//					var id = productGroupTree.getSelectedItemId(),
//						parent = productGroupTree.getParentId(id) || 0;
//						if(id){
//							productGroupTree.focusItem(id);
//							productGroupTree.editItem(id);
//						}
//                        };break;
//                        case 'Del':{
//                                var id = productGroupTree.getSelectedItemId(),
//                                        parent = productGroupTree.getParentId(id) || 0;
//                                        if(id){							
//                                                var ch = productGroupTree.getSubItems(id);
//                                                productGroupTree.deleteItem(id,true);
//                                                ch = ch.split(',');
//                                                for (k=0;k<ch.length;k++){
//                                                        i=ch[k];
//                                                        productGroupTree.moveItem(i,'item_child',parent);
//                                                };
//                                        }
//                        };break;                        
//                    };
//                });
//                
//                productGroupTree.attachEvent("onEdit", function(state, id, tree, value){
//                    console.log('onEdit', arguments);
//                });                
                
//                var new_data = ajaxGet("api/workerslist/" + i, '', function(data){                                     
//				if (data && data.success){
//                                    pracownicyGrid.parse((data.data), "js");
//                                }
//			});
//		settingsLayout.cells("b").hideHeader();
//		settingsLayout.cells("b").setWidth(330);
//		settingsLayout.cells("b").fixSize(true, true);
//		settingsLayout.setAutoSize("a", "a;b");
//		
//		// attach data view
//		settingsDataView = settingsLayout.cells("a").attachDataView({
//			type: {
//				template: "<div style='position:relative;'>"+
//						"<div class='settings_image'><img src='imgs/settings/#image#' border='0' ondragstart='return false;'></div>"+
//						"<div class='settings_title'>#title#"+
//							"<div class='settings_descr'>#descr#</div>"+
//						"</div>"+
//						"</div>",
//				margin: 10,
//				padding: 20,
//				height: 120
//			},
//			autowidth: 2,
//			drag: false,
//			select: true,
//			edit: false
//		});
//		
//		settingsDataView.load(A.server+"settings.xml?type="+A.deviceType, function(){
//			settingsDataView.select("contacts");
//		});
//		
//		settingsDataView.attachEvent("onAfterSelect", function(id){
//			// attach form
//			var formData = [];
//			formData.push({type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160});
//			formData = formData.concat(settingsFormStruct[id]);
//			settingsForm = settingsLayout.cells("b").attachForm(formData);
//			settingsForm.setSizes = settingsForm.centerForm;
//			settingsForm.setSizes();
//		});		
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
    var grupyForm = createWindowWithForm(groupFormStruct, "Dodaj lub zmien grupe", 300, 350);
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
        dhxCombo.setComboValue(treeObj.getSelectedId());
        dhxCombo.setComboText(treeObj.getItemText(treeObj.getSelectedId()));
    }
    grupyForm.attachEvent("onButtonClick", function(name){
        switch (name){
            case 'save':{
                if (id) {                    
                    ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){                                                                                                            
                        treeObj.setItemText(id, data.data.name);
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

function createWindowWithForm(formStruct, caption, height, width){
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
//                var obj = dhxWins.window("w1").getAttachedObject();
//                if (typeof(window.dhtmlXFormObject) == "function" && obj instanceof dhtmlXFormObject) {
//                    
//                }               
            }            
    });
    //initializing form 
    var myForm = dhxWins.window("w1").attachForm(formStruct, true);
    myForm.enableLiveValidation(true);
//    myForm.attachEvent("onValidateError", function (name, value, result){
//        dhtmlx.message({
//            title: "Close",
//            type: "alert-warning",
//            text: "You can't close this window!"            
//        });
//    });
    myForm.forEachItem(function(id){ 
        switch(myForm.getItemType(id)){
            case 'input':    {myForm.getInput(id).autocomplete = "off"; };break;
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
 
    return myForm;         
} 

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") {
            window.history.pushState({'page_id': id}, null, '#settings');
            settingsInit(cell);
        } 
});