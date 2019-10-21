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
                mainTabbar.addTab("a2", _("Statusy zamówień"));
                mainTabbar.addTab("a3", _("Kraj, język"));
                //Tabs
                var rolesLayout = mainTabbar.tabs("a1").attachLayout("3U");
                    rolesLayout.cells("a").setText(_("Role"));                    
                    rolesLayout.cells("b").setText(_("Uprawnienia"));                    
                    rolesLayout.cells("c").setText("Użytkownik");                     
                    rolesLayout.setAutoSize("a", "a;b;c");                                                 
                var statusesLayout = mainTabbar.tabs("a2").attachLayout("1C");
                    statusesLayout.cells("a").hideHeader();       
                var countriesLayout = mainTabbar.tabs("a3").attachLayout("2U");
                    countriesLayout.cells("a").setText(_("Kraj"));                    
                    countriesLayout.cells("b").setText(_("Język"));                     
        
/**
 * 
 * Roles tab
 * 
 */
                var rolesToolBar = rolesLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
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
                            {type: "block", blockOffset: 0, position: "label-left", list: [
                                {type:"button", name:"save",   value:_("Zapisz"),     offsetTop:18},
                                {type: "newcolumn"},
                                {type:"button", name:"cancel", value:_("Anuluj"),     offsetTop:18}
                            ]}
                    ]}
                ]; 
                var usersToolBar = rolesLayout.cells("c").attachToolbar({
                        iconset: "awesome",
                        items: [                                
                                {id: "Cog", type: "button", text: _("Dodaj do roli"), img: "fa fa-spin fa-cog "},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
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
                                        var allUsers = data.data;
                                        ajaxGet("api/roles/" + roleId + "/users", '', function(data2){
                                            var departamentUsers = data2.data;
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
                var permissionsToolBar = rolesLayout.cells("b").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                {type: "separator", id: "sep3"},
                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
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
                                                        windowForm.close();
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
                    }
                });
                var permissionForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			
                            {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:100},                                                                				                            
//                            {type:"combo",  name:"name",        label:_("Nazwa rozdzialu"), options:[
//                                    {text: "Gant", value: "gantt"},
//                                    {text: "Gant", value: "timeline"},
//                                    {text: "Gant", value: "zlecenia"},
//                                    {text: "Gant", value: "pracownicy"},
//                                    {text: "Gant", value: "clients"},
//                                    {text: "Gant", value: "clients"},
//                                    {text: "Gant", value: "clients"},
//                                ], offsetTop:13, labelWidth:100},               
                            {type:"input",  name:"description", label:_("Opis"), offsetTop:13, labelWidth:100},                                                                				                            
                            {type:"button", name:"save",        value:_("Zapisz"),     offsetTop:18},
                            {type:"button", name:"cancel",      value:_("Anuluj"),     offsetTop:18}
                    ]}
                ];
                var rolesTree = rolesLayout.cells("a").attachTreeView({
                    skin: "dhx_skyblue",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect
                        checkboxes: true,           // boolean, optional, enables checkboxes
                        dnd: true,           // boolean, optional, enables drag-and-drop
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
                        return true;                        
                    }
                });
                var permissionsGrid = rolesLayout.cells("b").attachGrid({
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
                var usersGrid = rolesLayout.cells("c").attachGrid({
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
                usersGrid.fill(0);                 
                permissionsGrid.fill(0);                                         
/**
 * Statuses
 */                
                statusesGridToolBar = statusesLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                {type: "separator",   id: "sep4"}, 
                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                        ]
                });
                statusesGridToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                var addingWindow = createWindow(_("Dodaj status"), 300, 300);
                                var addingForm = createForm([
                                    {type:"fieldset",  offsetTop:0, label:_("Nowy status"), width:250, list:[                                                                          
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
                                        ajaxPost("api/statuses", addingForm.getFormData(), function(data){
                                            if (data && data.success) {
                                                statusesGrid.addRow(data.data.id, [data.data.name, data.data.description]);  
                                                addingWindow.close();
                                            }
                                        });
                                    }
                                });                                
                            };break;
                            case 'Edit': {
                                var id = statusesGrid.getSelectedRowId();
                                if (id) {
                                    var addingWindow = createWindow(_("Edytuj status"), 300, 300);
                                    var addingForm = createForm([
                                        {type:"fieldset",  offsetTop:0, label:_("Status"), width:250, list:[                                                                          
                                                {type:"input",  name:"name",        label:_("Nazwa"), offsetTop:13, labelWidth:80},                                                                				
                                                {type:"input",  name:"description", label:_("Opis"),  offsetTop:13, labelWidth:80, rows: 3},                                                                				
                                                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                    {type: "newcolumn"},
                                                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                                ]}
                                        ]}                                    
                                    ], addingWindow);
                                    var rowData = statusesGrid.getRowData(id);
                                    addingForm.setFormData(rowData);
                                    addingForm.attachEvent("onButtonClick", function(name){
                                        if (name == 'save') {
                                            ajaxGet("api/statuses/" + statusesGrid.getSelectedRowId() + "/edit", addingForm.getFormData(), function(data){
                                                if (data && data.success) {
                                                    statusesGrid.fill();
                                                    addingWindow.close();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz status który chcesz edytować!")
                                    });
                                }
                            };break; 
                            case 'Del':{
                                var id = statusesGrid.getSelectedRowId();
                                if (id) {
                                    ajaxDelete("api/statuses/" + id, "", function(data){
                                        if (data && data.success){
                                            statusesGrid.deleteRow(id);
                                        }
                                    });    
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz status który chcesz usunąć!")
                                    });
                                }
                            };break;
                            case 'Redo': {
                                    statusesGrid.fill();
                            } 
                    }
                });               
                var statusesGrid = statusesLayout.cells("a").attachGrid({
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
                statusesGrid.fill = function() {   
                    this.clearAll();
                    ajaxGet("api/statuses", "", function(data){
                        if (data && data.success){                    
                            statusesGrid.parse(data.data, "js");
                        }
                    });	                    
                };                  
                statusesGrid.fill();
                var dpStatusesProductsGrid = new dataProcessor("api/statuses", "js");                
                dpStatusesProductsGrid.init(statusesGrid);
                dpStatusesProductsGrid.enableDataNames(true);
                dpStatusesProductsGrid.setTransactionMode("REST");
                dpStatusesProductsGrid.enablePartialDataSend(true);
                dpStatusesProductsGrid.enableDebug(true);
                dpStatusesProductsGrid.setUpdateMode("row", true);
                dpStatusesProductsGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/statuses/" + id + "/edit", data, function(data){                                                            
                        
                    });
                });                 
/**
 * Countries, Languages
 */
                countriesGridToolBar = countriesLayout.cells("a").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                {type: "separator",   id: "sep4"}, 
                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                        ]
                });
                countriesGridToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                var addingWindow = createWindow(_("Dodaj kraj"), 300, 300);
                                var addingForm = createForm([
                                    {type:"fieldset",  offsetTop:0, label:_("Nowy status"), width:250, list:[                                                                          
                                            {type:"input",  name:"name",  label:_("Imie"),          offsetTop:13, labelWidth:80},                                                                				                                            
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                {type: "newcolumn"},
                                                {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                            ]}
                                    ]}                                    
                                ], addingWindow);
                                addingForm.attachEvent("onButtonClick", function(name){
                                    if (name == 'save') {
                                        ajaxPost("api/country", addingForm.getFormData(), function(data){
                                            if (data && data.success) {
                                                countriesGrid.addRow(data.data.id, [data.data.name]);  
                                                addingWindow.close();
                                            }
                                        });
                                    }
                                });                                
                            };break;
                            case 'Edit': {
                                var id = countriesGrid.getSelectedRowId();
                                if (id) {
                                    var addingWindow = createWindow(_("Edytuj kraj"), 300, 300);
                                    var addingForm = createForm([
                                        {type:"fieldset",  offsetTop:0, label:_("Kraj"), width:250, list:[                                                                          
                                                {type:"input",  name:"name",        label:_("Imie"), offsetTop:13, labelWidth:80},                                                                				                                                
                                                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                    {type: "newcolumn"},
                                                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                                ]}
                                        ]}                                    
                                    ], addingWindow);
                                    var rowData = countriesGrid.getRowData(id);
                                    addingForm.setFormData(rowData);
                                    addingForm.attachEvent("onButtonClick", function(name){
                                        if (name == 'save') {
                                            ajaxGet("api/country/" + countriesGrid.getSelectedRowId() + "/edit", addingForm.getFormData(), function(data){
                                                if (data && data.success) {
                                                    countriesGrid.fill();
                                                    addingWindow.close();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz kraj który chcesz edytować!")
                                    });
                                }
                            };break; 
                            case 'Del':{
                                var id = countriesGrid.getSelectedRowId();
                                if (id) {
                                    ajaxDelete("api/country/" + id, "", function(data){
                                        if (data && data.success){
                                            countriesGrid.deleteRow(id);
                                        }
                                    });    
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz kraj który chcesz usunąć!")
                                    });
                                }
                            };break;
                            case 'Redo': {
                                    countriesGrid.fill();
                            } 
                    }
                });               
                var countriesGrid = countriesLayout.cells("a").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [
                        {label: _("Imie"), id: "name", width: 100, type: "ed",  sort: "str", align: "left"},                                                                         
                    ]                  
                });
                countriesGrid.fill = function() {   
                    this.clearAll();
                    ajaxGet("api/country", "", function(data){
                        if (data && data.success){                    
                            countriesGrid.parse(data.data, "js");
                        }
                    });	                    
                };                  
                countriesGrid.fill();
                var dpCountriesGrid = new dataProcessor("api/country", "js");                
                dpCountriesGrid.init(countriesGrid);
                dpCountriesGrid.enableDataNames(true);
                dpCountriesGrid.setTransactionMode("REST");
                dpCountriesGrid.enablePartialDataSend(true);
                dpCountriesGrid.enableDebug(true);
                dpCountriesGrid.setUpdateMode("row", true);
                dpCountriesGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/country/" + id + "/edit", data, function(data){                                                            
                        
                    });
                });  
                
                languagesGridToolBar = countriesLayout.cells("b").attachToolbar({
                        iconset: "awesome",
                        items: [
                                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                {type: "separator",   id: "sep4"}, 
                                {id: "Redo", type: "button", text: _("Odśwież"), img: "fa fa-refresh"}
                        ]
                });
                languagesGridToolBar.attachEvent("onClick", function(btn) {
                    switch (btn){
                            case 'Add':{
                                var addingWindow = createWindow(_("Dodaj język"), 300, 300);
                                var addingForm = createForm([
                                    {type:"fieldset",  offsetTop:0, label:_("Nowy język"), width:250, list:[                                                                          
                                            {type:"input",  name:"name",  label:_("Nazwa"),         offsetTop:13, labelWidth:80},                                                                				
                                            {type:"input",  name:"short", label:_("Krótkie imię"),  offsetTop:13, labelWidth:80},                                                                				
                                            {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                {type: "newcolumn"},
                                                {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                            ]}
                                    ]}                                    
                                ], addingWindow);
                                addingForm.attachEvent("onButtonClick", function(name){
                                    if (name == 'save') {
                                        ajaxPost("api/language", addingForm.getFormData(), function(data){
                                            if (data && data.success) {
                                                languagesGrid.addRow(data.data.id, [data.data.name, data.data.short]);  
                                                addingWindow.close();
                                            }
                                        });
                                    }
                                });                                
                            };break;
                            case 'Edit': {
                                var id = languagesGrid.getSelectedRowId();
                                if (id) {
                                    var addingWindow = createWindow(_("Edytuj język"), 300, 300);
                                    var addingForm = createForm([
                                        {type:"fieldset",  offsetTop:0, label:_("Status"), width:250, list:[                                                                          
                                                {type:"input",  name:"name",  label:_("Nazwa"),         offsetTop:13, labelWidth:80},                                                                				
                                                {type:"input",  name:"short", label:_("Krótkie imię"),  offsetTop:13, labelWidth:80},                                                                				
                                                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                    {type:"button", name:"save",    	value:_("Zapisz"),   		offsetTop:18},
                                                    {type: "newcolumn"},
                                                    {type:"button", name:"cancel",     	value:_("Anuluj"),   		offsetTop:18}
                                                ]}
                                        ]}                                    
                                    ], addingWindow);
                                    var rowData = languagesGrid.getRowData(id);
                                    addingForm.setFormData(rowData);
                                    addingForm.attachEvent("onButtonClick", function(name){
                                        if (name == 'save') {
                                            ajaxGet("api/language/" + languagesGrid.getSelectedRowId() + "/edit", addingForm.getFormData(), function(data){
                                                if (data && data.success) {
                                                    languagesGrid.fill();
                                                    addingWindow.close();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz język który chcesz edytować!")
                                    });
                                }
                            };break; 
                            case 'Del':{
                                var id = languagesGrid.getSelectedRowId();
                                if (id) {
                                    ajaxDelete("api/language/" + id, "", function(data){
                                        if (data && data.success){
                                            languagesGrid.deleteRow(id);
                                        }
                                    });    
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz język który chcesz usunąć!")
                                    });
                                }
                            };break;
                            case 'Redo': {
                                    languagesGrid.fill();
                            } 
                    }
                });               
                var languagesGrid = countriesLayout.cells("b").attachGrid({
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
                            label: _("Krótkie imię"),
                            id: "short",
                            width: 50,
                            type: "ed", 
                            sort: "str", 
                            align: "left"     
                        }                          
                    ]                   
                });
                languagesGrid.fill = function() {   
                    this.clearAll();
                    ajaxGet("api/language", "", function(data){
                        if (data && data.success){                    
                            languagesGrid.parse(data.data, "js");
                        }
                    });	                    
                };                  
                languagesGrid.fill();
                var dpLanguagesGrid = new dataProcessor("api/language", "js");                
                dpLanguagesGrid.init(languagesGrid);
                dpLanguagesGrid.enableDataNames(true);
                dpLanguagesGrid.setTransactionMode("REST");
                dpLanguagesGrid.enablePartialDataSend(true);
                dpLanguagesGrid.enableDebug(true);
                dpLanguagesGrid.setUpdateMode("row", true);
                dpLanguagesGrid.attachEvent("onBeforeDataSending", function(id, state, data){
                    data.id = id;
                    ajaxGet("api/language/" + id + "/edit", data, function(data){                                                            
                        
                    });
                });                  

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
    grupyForm.attachEvent("onKeyUp",function(inp, ev, name, value){
        if (name == 'name') {
            if (grupyForm.getItemValue('name') !== '') {                
                if (ev.code == 'Enter') {
                    if (id) {                    
                        ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){  
                            if (data && data.success) {             
                                grupyWindow.close();
                                treeObj.setItemText(id, data.data.name);
                                if (data.data.parent_id) {
                                    treeObj.openItem(data.data.parent_id);
                                }
                                treeObj.selectItem(data.data.id);
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Zapisane")
                                });                                
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Błąd! Zmiany nie zostały zapisane")
                                });  
                            }
                        });
                    } else {                   
                        ajaxPost(urlForSaveButton, grupyForm.getFormData(), function(data){
                            if (data.success) {                                               
                                treeObj.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                                if (data.data.parent_id) {
                                    treeObj.openItem(data.data.parent_id);
                                }
                                treeObj.selectItem(data.data.id);
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Zapisane")
                                });
                            } else {
                                dhtmlx.alert({
                                    title:_("Wiadomość"),
                                    text:_("Błąd! Informacja nie została zapisana")
                                });  
                            }
                        });                
                    }
                }                
            }
        }
    });    
    grupyForm.attachEvent("onButtonClick", function(name){
        switch (name){
            case 'save':{
                if (id) {                    
                    ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){  
                        if (data && data.success) {             
                            grupyWindow.close();
                            treeObj.setItemText(id, data.data.name);
                            if (data.data.parent_id) {
                                treeObj.openItem(data.data.parent_id);
                            }
                            treeObj.selectItem(data.data.id);   
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zapisane")
                            });                             
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Błąd! Zmiany nie zostały zapisane")
                            });  
                        }
                    });
                } else {                   
                    ajaxPost(urlForSaveButton, grupyForm.getFormData(), function(data){
                        if (data.success) {                                         
                            treeObj.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                            if (data.data.parent_id) {
                                treeObj.openItem(data.data.parent_id);
                            }
                            treeObj.selectItem(data.data.id);
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Zapisane")
                            });                            
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Błąd! Informacja nie została zapisana")
                            });  
                        }
                    });                
                }
            };break;         
            case 'cancel':{
                grupyForm.reset();
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
                    
//    myForm.attachEvent("onChange", function (name, value, state){
//        if ((name.indexOf("price") !== -1) ||                
//                (name.indexOf("weight") !== -1) ||
//                (name.indexOf("area") !== -1)) {
//            //var re = /^\d[0-9,]+\d$/;
//            //var re = /^\d{1,8}([,\.])?\d{1,2}$/;
//            var re = /^\d{1,8}([\.])?\d{1,2}$/;
//            if (!re.test(value)) {
//                myForm.setItemValue(name, "");
//            }            
//        } else if (name.indexOf("amount") !== -1) {
//            var re = /^\d+$/;            
//            if (!re.test(value)) {
//                myForm.setItemValue(name, "");
//            }            
//        }        
//    });  
//    
    var dateEndCombo   = myForm.getCombo("num_week");
    if (dateEndCombo) {
        var numCurrentWeek = new Date().getWeekNumber();
        for (var i = 1; i <= 53; i++) {
            dateEndCombo.addOption(i, "" + i);
        }
        dateEndCombo.attachEvent("onChange", function(value, text){
            if (value < numCurrentWeek) {
                if (!myForm.isItem("on_next_year")) {
                    myForm.addItem(null, {type: "label", name: "on_next_year", label: _("Na nastepny rok")}, null, 1);
                }
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
    myForm.adjustParentSize();
    
    return myForm;         
}

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};   

dhtmlXGridObject.prototype.deleteMyRecordById = function(url){
    var thisGrid = this;
    var id = thisGrid.getSelectedRowId();                                       
    if (id) {
        dhtmlx.confirm({
            title: _("Ostrożność"),                                    
            text: _("Czy na pewno chcesz usunąć te informacje?"),
            callback: function(result){
                if (result) {                                     
                    ajaxDelete(url + id,'', function(data){
                        if (data && data.success) {
                            thisGrid.deleteRow(id);
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Nie udało się usunąć informacje!")
                            }); 
                        }
                    }); 
                }
            }
        });                                                  
    } else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            text:_("Wybierz co chcesz usunąć!")
        });                        
    }
};

//dhtmlXGridObject.prototype.fill = function(url) {
//    var thisGrid = this;
//    thisGrid.clearAll();
//    ajaxGet(url, '', function(data){                                     
//        if (data && data.success){                                    
//            thisGrid.parse(data.data, "js");
//        } else {
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Komponenty nie zostały załadowane. \n\
//                        Odśwież stronę!")
//            });                    
//        }
//    });     
//};

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
                                                    



window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") {
            window.history.pushState({'page_id': id}, null, '#settings');
            settingsInit(cell);
        } 
});