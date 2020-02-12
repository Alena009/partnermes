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
                mainTabbar.addTab("a4", _("Tłumaczenia"));
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
                var translationsLayout = mainTabbar.tabs("a4").attachLayout("1C");
                    translationsLayout.cells("a").hideHeader();                      
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
                var rolesTree = rolesLayout.cells("a").attachTreeView({
                    skin: "dhx_skyblue",    // string, optional, treeview's skin
                        iconset: "font_awesome", // string, optional, sets the font-awesome icons
                        multiselect: false,           // boolean, optional, enables multiselect                                 
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
                rolesTree.load();                                 
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
                var permissionForm = [
                    {type:"fieldset",  offsetTop:0, label:_("Dodaj lub zmien"), width:253, list:[                                			                            
                            {type:"combo",  name:"permission_id", label:_("Sekcja"), options:[], offsetTop:13, inputWidth: 150},                                                                				                            
                            {type: "block",    name: "buttonblock",inputWidth: 200,    className: "myBlock", list:[
                            {type: "button",   name: "save",   value:_("Zapisz"), offsetTop:18},
                            {type: "newcolumn"},
			    {type: "button",   name: "cancel", value:_("Anuluj"), offsetTop:18}
                        ]} 
                    ]}
                ];                
                permissionsToolBar.attachEvent("onClick", function(id) { 
                    switch (id){
                        case 'Add':{
                            var roleId = rolesTree.getSelectedId();
                            if (roleId) {
                                var windowForm = createWindow(_("Permission"), 300, 300);
                                var form = createForm(permissionForm, windowForm);
                                var permissionCombo = form.getCombo("permission_id");
                                ajaxGet("api/roles/" + roleId + "/freepermissions", "", function(data){
                                    permissionCombo.clearAll();
                                    permissionCombo.addOption(data.data);
                                });
                                form.attachEvent("onButtonClick", function(name){
                                    switch (name){
                                        case 'save':{    
                                            var data = form.getFormData();
                                            data.role_id = roleId;
                                            ajaxPost("api/rolespermissions", data, function(data) {
                                            if (data.success) {
                                                    permissionsGrid.fill(roleId);                                                
                                                } 
                                            });                                                                                        
                                        };break;
                                        case 'cancel':{
                                            form.clear();    
                                        };break;
                                    }
                                });
                            } else {
                                dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        type:"alert",
                                        text:_("Wybierz role, do której chcesz dodać uprawnienia!")
                                    });
                            }
                        };break;
//                        case 'Edit':{                                
//                                var permissionId = permissionsGrid.getSelectedRowId();                                
//                                if (permissionId) {  
//                                    var windowForm = createWindow(_("Permission"), 300, 300);
//                                    var form = createForm(permissionForm, windowForm);
//                                    var data = {
//                                        id: permissionId,
//                                        name: permissionsGrid.cells(permissionId, 0).getValue(),
//                                        description: permissionsGrid.cells(permissionId, 2).getValue()
//                                    };
//                                    form.setFormData(data); 
//                                    form.attachEvent("onButtonClick", function(name){
//                                        switch (name){
//                                            case 'save':{                                                           
//                                                ajaxGet("api/permissions/" + permissionId + "/edit", form.getFormData(), function(data){ 
//                                                    if (data.success) {                                                           
//                                                        permissionsGrid.fill(0);
//                                                    } 
//                                                });
//                                            };break;
//                                            case 'cancel':{
//                                                form.setFormData(data); 
//                                            };break;
//                                        }
//                                    });                                
//                                } else {
//                                    dhtmlx.alert({
//                                        title:_("Wiadomość"),
//                                        type:"alert",
//                                        text:_("Wybierz uprawnienie, które chcesz edytować!")
//                                    });
//                                }                               
//                        };break;
                        case 'Del':{
                                var permissionId = permissionsGrid.getSelectedRowId();                                
                                if (permissionId) {
                                    var roleId = rolesTree.getSelectedId();
                                    dhtmlx.confirm({
                                        title:_("Ostrożność"),                                    
                                        text:_("Czy na pewno chcesz usunąć uprawnienie?"),
                                        callback: function(result){
                                            if (result) {
                                                var data = {
                                                    role_id: roleId,
                                                    permission_id: permissionId                                                    
                                                };                                                
                                                ajaxGet("api/rolespermissions/delete", data, function(data) {
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
                var permissionsGrid = rolesLayout.cells("b").attachGrid({
                    image_path:'codebase/imgs/',
                    columns: [                                                
                        {
                            label: _("Sekcja"),
                            id: "description",
                            width: 200, 
                            type: "ed"       
                        },
                        {
                            label: _("Może zmienić informacje"),
                            id: "value",
                            width: 50, 
                            type: "ch"       
                        }                        
                    ]
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
                        ajaxGet("api/rolespermissions/edit", data, function(data) {
                            if (data && data.success) {
                                permissionsGrid.fill(roleId);                          
                            }
                        });                       
                    }                                 
                });                
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
/**
 * Tlumaczenia
 * 
 */
                var translationsSidebar = translationsLayout.cells("a").attachSidebar({
                        items: [
                        {id: "taskgroups",      text: _("Grupy zadań"),       icon: "a1.png", selected: true},
                        {id: "tasks",           text: _("Zadania"),           icon: "a1.png"},           
                        {id: "prodgroups",      text: _("Grupy produktów"),   icon: "a1.png"},
                        {id: "prodtypes",       text: _("Typy produktów"),    icon: "a1.png"},                         
                        {id: "products",        text: _("Produkty"),          icon: "a1.png"},     
                        {id: "departaments",    text: _("Grupy pracowników"), icon: "a1.png"},                         
                    ]
                });
                translationsSidebar.attachEvent("onSelect", function(id, lastId){
                    var translationsLayout = translationsSidebar.cells(id).attachLayout("2U");
                    translationsLayout.cells("a").setText(_("Wpisy"));
                    translationsLayout.cells("b").setText(_("Tłumaczenia"));
                    recordsGridToolBar = translationsLayout.cells("a").attachToolbar(emptyToolbar);                    
                    var recordsGrid = translationsLayout.cells("a").attachGrid({
                        image_path:'codebase/imgs/',
                        columns: [
                            {
                                label: _("Imie"),
                                id: "name",
                                width: 150,
                                type: "ro", 
                                sort: "str", 
                                align: "left"     
                            }                         
                        ] 
                    });
                    recordsGrid.fill("api/" + id);
                    recordsGrid.attachEvent("onRowSelect", function(rId) {
                        translationsGrid.fill("api/" + id + "/" + rId + "/translations"); 
                    }); 
                    translationsGridToolBar = translationsLayout.cells("b").attachToolbar({
                            iconset: "awesome",
                            items: [
                                    {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                                    {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                                    {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                                    {type: "separator", id: "sep3"},
                                    {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
                            ]
                    });
                    translationsGridToolBar.attachEvent("onClick", function(btn) {
                        switch (btn){
                            case 'Add':{
                                var selectedRecordId = recordsGrid.getSelectedRowId();
                                if (selectedRecordId) {
                                    var addingWindow = createWindow(_("Dodaj tłumaczenie"), 300, 300);
                                    var addingForm = createForm([
                                        {type:"fieldset",  offsetTop:0, label:_("Tłumaczenie"), width:250, list:[
                                                {type: "settings", position: "label-left", labelWidth: 115, inputWidth: 160},
                                                {type:"combo",  name:"locale",      label:_("Język"), required: true, options: []},                                              
                                                {type:"input",  name:"name",        label:_("Imie"), required: true, offsetTop:13},                                                                				
                                                {type:"input",  name:"description", label:_("Opis"), offsetTop:13, rows: 3},                                                                				
                                                {type:"input",  name:"pack",        label:_("Opakowanie"), offsetTop:13, rows: 3},                                                                				                                                
                                                {type: "block", name: "block", blockOffset: 0, position: "label-left", list: [
                                                    {type:"button", name:"save",    	value:_("Zapisz")},
                                                    {type: "newcolumn"},
                                                    {type:"button", name:"cancel",     	value:_("Anuluj")}
                                                ]}
                                        ]}                                    
                                    ], addingWindow);
                                    var localeCombo = addingForm.getCombo("locale");
                                    ajaxGet("api/language", "", function(data){
                                        if (data && data.success) {
                                            localeCombo.addOption(data.data);
                                        }
                                    });
                                    addingForm.attachEvent("onButtonClick", function(name){
                                        switch (name){
                                            case 'save': {                                    
                                                var data = addingForm.getFormData(); 
                                                data.locale = localeCombo.getComboText();
                                                ajaxGet("api/" + id + "/" + selectedRecordId + "/translations/add", data, function(data){
                                                    if (data && data.success) {
                                                        dhtmlx.alert({
                                                            title:_("Wiadomość"),
                                                            text:_("Zapisane!")
                                                        });  
                                                    }
                                                });                                                                
                                            };break;
                                        }
                                    });
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz wpis, do którego chcesz dodać tłumaczenie!")
                                    }); 
                                }
                            };break;
                            case 'Edit': {};break;
                            case 'Del': {
                                var selectedRecordId = recordsGrid.getSelectedRowId();
                                if (selectedRecordId) {
                                    var translationId = translationsGrid.getSelectedRowId();
                                    if (translationId) {
                                        ajaxGet("api/" + id + "/" + selectedRecordId + "/" + translationId + "/translations/del", "", function(data){
                                            if (data && data.success) {
                                                dhtmlx.alert({
                                                    title:_("Wiadomość"),
                                                    text:_("Usunięte!")
                                                });  
                                            }
                                        });                                     
                                    } else {
                                        dhtmlx.alert({
                                            title:_("Wiadomość"),
                                            text:_("Wybierz tłumaczenie które chcesz usunąć!")                                        
                                        });
                                    }                                    
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz wpis, do którego chcesz usunąć tłumaczenia!")                                        
                                    }); 
                                }                                     
                            };break;
                            case 'Redo': {
                                var selectedRecordId = recordsGrid.getSelectedRowId();
                                if (selectedRecordId) {
                                    translationsGrid.fill("api/" + id + "/" + selectedRecordId + "/translations");                                     
                                } else {
                                    dhtmlx.alert({
                                        title:_("Wiadomość"),
                                        text:_("Wybierz wpis, do którego chcesz zobaczyć tłumaczenia!")                                        
                                    }); 
                                }                                                                
                            };break;
                        }
                    });
                    var translationsGrid = translationsLayout.cells("b").attachGrid({
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
                                width: 100,
                                type: "ed", 
                                sort: "str", 
                                align: "left"     
                            }, 
                            {
                                label: _("Opakowanie"),
                                id: "pack",
                                width: 100,
                                type: "ed", 
                                sort: "str", 
                                align: "left"     
                            },
                            {
                                label: _("Język"),
                                id: "locale",
                                width: 50,
                                type: "ro", 
                                sort: "str", 
                                align: "left"     
                            }                          
                        ] 
                    });                   
                });
	}
	
}

var groupFormStruct = [
        {type:"fieldset",  offsetTop:0, label:_("Grupa"), width:253, list:[                                
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
        {type:"fieldset",  offsetTop:0, label:_("Zadanie"), width:253, list:[  
                {type:"combo",  name: "task_group_id", label:_("Grupa"), options: [], inputWidth: 150},                                                                
                {type:"input",  name:"kod",          label:_("Kod"),         offsetTop:13, labelWidth:80},                                                                				
                {type:"input",  name:"name",         label:_("Imie"),        offsetTop:13, labelWidth:80},                 
                {type:"checkbox", name:"for_order",    label:_("Potrzebuje zamówienia"), offsetTop:13, labelWidth:80},                 
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
    //if we editing some group, we removing parentgrop combo, because 
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
    grupyForm.addRecord = () => {
        ajaxPost(urlForSaveButton, grupyForm.getFormData(), function(data){
            if (data.success) {                                               
                treeObj.addItem(data.data.id, data.data.name, data.data.parent_id); // id, text, pId
                if (data.data.parent_id) { treeObj.openItem(data.data.parent_id); }
                treeObj.selectItem(data.data.id);  
                grupyForm.setItemValue('name', '');
            } else {
                dhtmlx.alert({
                    title:_("Wiadomość"),
                    text:_("Błąd! Informacja nie została zapisana")
                });  
            }
        });        
    };
    grupyForm.editRecord = () => {
        ajaxGet(urlForSaveButton, grupyForm.getFormData(), function(data){  
            if (data && data.success) {             
                grupyWindow.close();
                treeObj.setItemText(id, data.data.name);
                if (data.data.parent_id) { treeObj.openItem(data.data.parent_id); }
                treeObj.selectItem(data.data.id);                                                
            } else {
                dhtmlx.alert({
                    title:_("Wiadomość"),
                    text:_("Błąd! Zmiany nie zostały zapisane")
                });  
            }
        });        
    };
    grupyForm.saveEvent = (id = 0) => {
        id ? grupyForm.editRecord() : grupyForm.addRecord();
    };
    
    grupyForm.attachEvent("onKeyUp",function(inp, ev, name, value){
        if (name == 'name') {
            if (grupyForm.getItemValue('name') !== '') {                
                if (ev.code == 'Enter') {
                    grupyForm.saveEvent(id);
                }                
            }
        }
    });    
    grupyForm.attachEvent("onButtonClick", function(name){
        switch (name){
            case 'save':{
                grupyForm.saveEvent(id);
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
    myForm.setFocusOnFirstActive();
    myForm.enableLiveValidation(true);
    myForm.adjustParentSize();
    myForm.forEachItem(function(id){ 
        switch(myForm.getItemType(id)){
            case 'input':    {
                    var input = myForm.getInput(id); 
                    input.autocomplete = "off";                     
                };break;
            case 'combo':    {
                var myCombo = myForm.getCombo(id);
                myCombo.enableAutocomplete();                               
                myCombo.attachEvent("onKeyPressed", function(keyCode){
                    //if pressed button is not "up" or "down" arrow button 
                    //or is not enter button 
                    if (keyCode != 40 && keyCode != 38 && keyCode != 13) {    
                        var input = myCombo.getComboText().trim().toLowerCase().split(' ');
                        var mask = "";
                        for (var i = 0; i < input.length; i++) {
                            mask = mask + input[i] + "(.*)";                                                                                                                        
                        }                       
                        myCombo.filter(function(opt){
                            return opt.text.match(new RegExp(mask,"ig"))!=null;
                        }, true);                       
                    }                    
                });
                myCombo.attachEvent("onFocus", function(){
                    myCombo.setFocus();
                });                
            }
        };           
    });

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
                myForm.setItemFocus(myForm.getFirstActive());
            };break;            
            case 'cancel':{
                myForm.clear();                
            };break;
        }
    });   
    return myForm;         
}

function getNowDate() {
    var d = new Date();    
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }    
    var day = d.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var date = year + '-' + month + '-' + day;
    return date;   
}

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};   

dhtmlXGridObject.prototype.deleteMyRecordById = function(url){
    const thisGrid = this;
    let id = thisGrid.getSelectedRowId();                                       
    if (id) {
        dhtmlx.confirm({
            title: _("Ostrożność"),                                    
            text: _("Czy na pewno chcesz usunąć te informacje?"),
            callback: function(result){
                if (result) {                                     
                    ajaxDelete(url + '/' + id,'', function(data){
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

dhtmlXGridObject.prototype.setRegFilter = function(gridObj, colIdx) {
    gridObj.getFilterElement(colIdx)._filter = function (){
        var input = this.value; // gets the text of the filter input
        input = input.trim().toLowerCase().split(' ');
        return function(value, id){
            //for(var i = 0; i<ordersPositionsGrid.getColumnsNum(); i++){ // iterating through the columns
                var val = gridObj.cells(id, colIdx).getValue(); // gets the value of the current                                                    
                //making pattern string for regexp
                var searchStr = '';
                for (var i = 0; i < input.length; i++) {
                    searchStr = searchStr + input[i] + "(.*)";                                                                
                    //var searchStr = /^zz(.+)np(.+)/ig;
                }
                var regExp = new RegExp(searchStr, "ig");                                                          
                if (val.toLowerCase().match(regExp)){                                                             
                    return true;
                }                                                    
            //}
            return false;
        };
    };
}
        
dhtmlXGridObject.prototype.fill = function(url, toolbar = null) {
    if (toolbar) { toolbar.setItemImage("Redo", "fa fa-spin fa-spinner"); }
    var thisGrid = this;
    thisGrid.clearAll();
    ajaxGet(url, '', function(data){                                     
            if (data && data.success){                                    
                thisGrid.parse(data.data, "js");
                if (toolbar) { toolbar.setItemImage("Redo", "fa fa-refresh"); }
            } else {
//                dhtmlx.alert({
//                    title:_("Wiadomość"),
//                    text:_(data.message)
//                });                    
            }
        });     
};

dhtmlXGridObject.prototype.getUnCheckedRows = function(col_ind){
		var d = new Array();
		this.forEachRowA(function(id){
				var cell = this.cells(id, col_ind);
				if (cell.changeState && cell.getValue() == 0)
					d.push(id);
		},true);
		return d.join(",");
};

function fillProductsData(groupProduct) {
    var productsData = new dhtmlXDataStore();
    ajaxGet("api/prodgroups/products/" + groupProduct + "/" + localStorage.language, '', function(data){
        if (data && data.success) {
            productsData.parse(data.data);                
        }
    });
    return productsData;
} 


var standartToolbar = {
        iconset: "awesome",
        items: [
                {id: "Add",  type: "button", text: _("Dodaj"), img: "fa fa-plus-square "},
                {id: "Edit", type: "button", text: _("Edytuj"), img: "fa fa-edit"},
                {id: "Del",  type: "button", text: _("Usuń"), img: "fa fa-minus-square"},
                {type: "separator", id: "sep3"},
                {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
        ]
};

var emptyToolbar = {
        iconset: "awesome",
        items: [
                {id: "Redo", type: "button",text: _("Odśwież"), img: "fa fa-refresh"}
        ]
};

var treeStruct = {
                skin: "dhx_web",    // string, optional, treeview's skin
                iconset: "font_awesome", // string, optional, sets the font-awesome icons
                multiselect: false,           // boolean, optional, enables multiselect
                //checkboxes: true,           // boolean, optional, enables checkboxes
                dnd: true,           // boolean, optional, enables drag-and-drop
                context_menu: true           // boolean, optional, enables context menu			
};                                            

function getPermission(paragraph) {
    var userData = JSON.parse(localStorage.getItem("userData")); 
    userData.permissions.forEach(function(elem){
        if (elem.name === paragraph) {
            return elem.pivot.value;
        }
    });
}

dhtmlXGridObject.prototype.add = function(url, data) {
    var grid = this;
    ajaxPost(url, data, function(data){                                                                                                        
        if (data && data.success) {
            grid.addRow(data.data.id, '');
            grid.setRowData(data.data.id, data.data);
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Zapisane!")
//            });                     
            grid.callEvent("onGridReconstructed", []);
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Błąd! Zmiany nie zostały zapisane")
            });
        }                                          
    });      
};

dhtmlXGridObject.prototype.edit = function(url, data) {
    var grid = this;
    ajaxGet(url, data, function(data){                                                                                                        
        if (data && data.success) { 
            grid.setRowData(data.data.id, data.data);
//            dhtmlx.alert({
//                title:_("Wiadomość"),
//                text:_("Zapisane!")
//            });
            grid.callEvent("onGridReconstructed", []);
        } else {
            dhtmlx.alert({
                title:_("Wiadomość"),
                text:_("Błąd! Zmiany nie zostały zapisane")
            });
        }                                          
    });         
};

dhtmlXGridObject.prototype.delete = function(url, id) {
    var thisGrid = this;
    if (id) {                                
        dhtmlx.confirm({
            title: _("Ostrożność"),                                    
            text: _("Czy na pewno chcesz usunąć?"),
            callback: function(result){
                if (result) {                                                                                    
                    ajaxDelete(url, "", function(data){
                        if (data && data.success){
                            thisGrid.deleteRow(id);
                            grid.callEvent("onGridReconstructed", []);
                        } else {
                            dhtmlx.alert({
                                title:_("Wiadomość"),
                                text:_("Nie udało się usunąć!")
                            });
                        }
                    });   
                }
            }
        });                                     
    } else {
        dhtmlx.alert({
            title:_("Wiadomość"),
            text:_("Wybierz informację którą chcesz usunąć!")
        });                            
    }     
};

//dhtmlXGridObject.prototype.unSelectRowById = function(rowId) {
//    var grid = this;
//         
//};
//
//	this.selectRowById=function(row_id, multiFL, show, call){
//		if (!call)
//			call=false;
//		this.selectCell(this.getRowById(row_id), 0, call, multiFL, false, show);
//	}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") {
            window.history.pushState({'page_id': id}, null, '#settings');
            settingsInit(cell);
        } 
});